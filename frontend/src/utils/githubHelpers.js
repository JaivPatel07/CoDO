export const GITHUB_OAUTH_REDIRECT = "http://localhost:5173/github/callback";

export function connectGithub() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  window.location.href =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(GITHUB_OAUTH_REDIRECT)}` +
    `&scope=read:user user:email repo`;
}

export function parseGithubRepoUrl(url) {
  const trimmed = (url || "").trim().replace(/\.git$/, "").replace(/\/$/, "");
  const match = trimmed.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export async function fetchPublicGithubRepo(owner, repo) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Repository not found. Check the URL and try again."
        : `Unable to fetch repository (${response.status}).`
    );
  }
  return response.json();
}

export function mapGithubApiRepoToForm(repo) {
  const technologies = [...(repo.topics || [])];
  if (repo.language && !technologies.includes(repo.language)) {
    technologies.unshift(repo.language);
  }

  return {
    github_repo_id: String(repo.id),
    repository_name: repo.name,
    repository_url: repo.html_url,
    tagline: repo.description || "",
    description: repo.description || "",
    owner_username: repo.owner?.login || "",
    owner_profile_pic: repo.owner?.avatar_url || "",
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    open_issues: repo.open_issues_count || 0,
    technologies,
  };
}

export function mapGraphqlRepoToForm(repo, ownerLogin, ownerAvatar) {
  const technologies = [];
  if (repo.primaryLanguage?.name) technologies.push(repo.primaryLanguage.name);
  (repo.languages?.edges || []).forEach(({ node }) => {
    if (node?.name && !technologies.includes(node.name)) technologies.push(node.name);
  });

  return {
    github_repo_id: repo.id,
    repository_name: repo.name,
    repository_url: repo.url,
    tagline: repo.description || "",
    description: repo.description || "",
    owner_username: ownerLogin,
    owner_profile_pic: ownerAvatar || "",
    stars: repo.stargazerCount || 0,
    forks: repo.forkCount || 0,
    open_issues: 0,
    technologies,
  };
}

export function getViewerRepos(gitProfileData) {
  const viewer = gitProfileData?.data?.viewer;
  if (!viewer) return { viewer: null, repos: [] };

  const repos = (viewer.repositories?.nodes || [])
    .filter((repo) => !repo.isPrivate && !repo.isFork)
    .map((repo) => ({
      ...repo,
      ownerLogin: viewer.login,
      ownerAvatar: viewer.avatarUrl,
    }));

  return { viewer, repos };
}

export async function enrichRepoFromPublicApi(formData) {
  const parsed = parseGithubRepoUrl(formData.repository_url);
  if (!parsed) return formData;

  try {
    const repo = await fetchPublicGithubRepo(parsed.owner, parsed.repo);
    return { ...formData, ...mapGithubApiRepoToForm(repo) };
  } catch {
    return formData;
  }
}

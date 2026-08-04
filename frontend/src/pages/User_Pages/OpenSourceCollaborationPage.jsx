import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Code2,
  Edit2,
  Filter,
  FolderGit2,
  GitFork,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { fetchOpenSourceProjects, createOpenSourceProject, updateOpenSourceProject, deleteOpenSourceProject } from "../../api/opensource_apis";
import { fetch_git_profile } from "../../api/public_apis";
import { UserContext } from "../../contextAPI/userContext";
import {
  connectGithub,
  enrichRepoFromPublicApi,
  fetchPublicGithubRepo,
  getViewerRepos,
  mapGithubApiRepoToForm,
  mapGraphqlRepoToForm,
  parseGithubRepoUrl,
} from "../../utils/githubHelpers";

const STATUS_FILTERS = ["All", "Looking for Contributors", "Good First Issues", "Actively Developing", "Maintenance"];
const DIFFICULTIES = ["Beginner Friendly", "Intermediate", "Advanced"];
const SORTS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Stars", value: "most_stars" },
  { label: "Most Forks", value: "most_forks" },
  { label: "Most Issues", value: "most_issues" },
];

const statusAccent = {
  "Looking for Contributors": "bg-violet-50 text-violet-700 border-violet-200",
  "Good First Issues": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Actively Developing": "bg-sky-50 text-sky-700 border-sky-200",
  Maintenance: "bg-orange-50 text-orange-700 border-orange-200",
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

const EMPTY = {
  tagline: "No tagline added — open the project to learn more.",
  description: "The maintainer hasn't written a description yet.",
  category: "General",
  technologies: "Tech stack not listed yet",
  roles: "No specific roles listed — open to contributors",
  skills: "No skills specified yet",
  owner: "Unknown maintainer",
};

function hasText(value) {
  return Boolean(value && String(value).trim());
}

function displayTagline(project) {
  if (hasText(project.tagline)) return project.tagline;
  if (hasText(project.description)) return project.description;
  return EMPTY.tagline;
}

function formatRelativeDate(dateStr) {
  if (!dateStr) return "Recently added";
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function cardGradient(name = "") {
  const palettes = [
    "from-violet-600 via-indigo-600 to-slate-900",
    "from-emerald-600 via-teal-600 to-slate-900",
    "from-sky-600 via-blue-600 to-slate-900",
    "from-fuchsia-600 via-purple-600 to-slate-900",
    "from-orange-500 via-rose-600 to-slate-900",
  ];
  const index = (name || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % palettes.length;
  return palettes[index];
}

function buildPayload(formData) {
  return {
    ...formData,
    technologies: Array.isArray(formData.technologies)
      ? formData.technologies
      : String(formData.technologies || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    roles_needed: Array.isArray(formData.roles_needed)
      ? formData.roles_needed
      : String(formData.roles_needed || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
    skills_required: Array.isArray(formData.skills_required)
      ? formData.skills_required
      : String(formData.skills_required || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
  };
}

function sortProjects(projects, sort) {
  const list = [...projects];
  switch (sort) {
    case "oldest":
      return list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    case "most_stars":
      return list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    case "most_forks":
      return list.sort((a, b) => (b.forks || 0) - (a.forks || 0));
    case "most_issues":
      return list.sort((a, b) => (b.open_issues || 0) - (a.open_issues || 0));
    default:
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{formatNumber(value)}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-slate-500">{hint}</p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[24px] border border-[#E9E9EF] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        >
          <div className="relative h-[140px] animate-pulse bg-slate-100" />
          <div className="animate-pulse p-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-slate-100" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="h-7 w-4/5 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-3/4 rounded bg-slate-100" />
            </div>
            <div className="mt-6 h-10 rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onPublish, clearFilters, hasFilters }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-violet-100 bg-violet-50 text-violet-500">
        <FolderGit2 size={36} />
      </div>
      <h3 className="mt-6 text-2xl font-black text-slate-950">No open source projects yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-6 text-slate-500">
        {hasFilters
          ? "No projects match your filters. Try adjusting your search or clearing filters."
          : "Import a repository from GitHub and publish it to start collaborating with the community."}
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Clear filters
          </button>
        )}
        <button
          onClick={onPublish}
          className="rounded-2xl bg-violet-600 px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700"
        >
          Publish Repository
        </button>
      </div>
    </div>
  );
}

function FilterDropdown({ label, options, value, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        <span>{label}:</span>
        <span className="font-bold text-violet-700">{value}</span>
        <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full z-10 mt-2 w-56 origin-top-left rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className={`w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition-colors ${
                value === option ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ProjectCard = memo(function ProjectCard({ project, userName, isOwner, onEdit, onDelete, deleteBusy }) {
  const navigate = useNavigate();
  const category = hasText(project.category) ? project.category.toUpperCase() : EMPTY.category.toUpperCase();
  const status = project.status || "Looking for Contributors";
  const difficulty = project.difficulty || "Beginner Friendly";
  const statusClass = statusAccent[status] || "bg-slate-50 text-slate-700 border-slate-200";
  const hasTech = project.technologies?.length > 0;
  const hasRoles = project.roles_needed?.length > 0;
  const tagline = displayTagline(project);
  const isEmptyTagline = !hasText(project.tagline) && !hasText(project.description);

  return (
    <article
      className="group relative mx-auto flex w-full max-w-[340px] cursor-pointer flex-col overflow-hidden rounded-[24px] border border-[#E9E9EF] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,24,39,0.12)]"
      onClick={() => navigate(`/user/${userName}/open-source/${project.id}`)}
    >
      {isOwner && (
        <div className="absolute right-3 top-3 z-20 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            aria-label={`Edit ${project.repository_name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            disabled={deleteBusy === project.id}
            aria-label={`Delete ${project.repository_name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/90 text-red-600 shadow-md backdrop-blur-sm transition hover:bg-red-50 disabled:opacity-60"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <div className="relative h-[148px] overflow-hidden rounded-t-[24px] bg-slate-100">
        {project.banner_url ? (
          <img
            src={project.banner_url}
            alt={`${project.repository_name} banner`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-slate-900 px-4 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
              <FaGithub size={24} className="opacity-90" />
            </div>
            <p className="mt-3 truncate text-sm font-bold">{project.repository_name || "Unnamed repository"}</p>
          </div>
        )}

        <div className="absolute inset-x-0 top-4 grid grid-cols-3 items-center gap-1.5 px-3">
          <span className="justify-self-start truncate rounded-full bg-[#7C3AED]/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm backdrop-blur-md">
            {category.slice(0, 14)}
          </span>
          <span className="justify-self-center rounded-full border border-white/50 bg-white/80 px-2.5 py-1 text-[10px] font-black text-[#111827] shadow-sm backdrop-blur-md">
            {difficulty.split(" ")[0]}
          </span>
          <span className={`justify-self-end truncate rounded-full border px-2.5 py-1 text-[10px] font-black shadow-sm backdrop-blur-md ${statusClass}`}>
            {status === "Looking for Contributors" ? "Hiring" : status.split(" ")[0]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-gradient-to-br from-violet-50 to-indigo-50 text-violet-600">
            <Code2 size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[13px] font-bold text-[#111827]">
                {project.owner_username || EMPTY.owner}
              </p>
              {isOwner && (
                <span className="shrink-0 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  You
                </span>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] text-[#6B7280]">
              <Calendar size={11} />
              {formatRelativeDate(project.created_at)}
            </p>
          </div>
          <div className="ml-auto flex shrink-0 flex-col items-end gap-1 text-[11px] font-bold text-[#6B7280]">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-500" />
              {formatNumber(project.stars)}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={12} />
              {formatNumber(project.forks)}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="line-clamp-1 text-[18px] font-bold leading-tight text-[#111827]">
            {project.repository_name || "Untitled repository"}
          </h3>
          <p className={`mt-2 line-clamp-2 min-h-[40px] text-[13px] leading-6 ${isEmptyTagline ? "italic text-slate-400" : "text-[#6B7280]"}`}>
            {tagline}
          </p>
        </div>

        <div className="mt-4 min-h-[28px]">
          {hasTech ? (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 3).map((tech) => (
                <span key={tech} className="rounded-md border border-violet-100 bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          ) : (
            <p className="text-[11px] font-medium italic text-slate-400">{EMPTY.technologies}</p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#6B7280]">
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
            <MessageCircle size={12} />
            {formatNumber(project.open_issues)} open issues
          </span>
          {hasRoles ? (
            <span className="inline-flex items-center gap-1 truncate rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              <Users size={12} />
              {project.roles_needed.slice(0, 2).join(", ")}
            </span>
          ) : (
            <span className="truncate italic text-slate-400">{EMPTY.roles}</span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-t border-slate-100 pt-4">
          <a
            href={project.repository_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white px-3 text-[13px] font-bold text-[#6B7280] transition hover:border-[#A78BFA] hover:text-[#7C3AED]"
          >
            <FaGithub size={14} />
            GitHub
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/${userName}/open-source/${project.id}`);
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[18px] bg-[#111827] px-4 text-[13px] font-bold text-white transition hover:bg-slate-800"
          >
            Details
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
});

function DeleteConfirmModal({ project, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Trash2 size={24} />
        </div>
        <h3 className="mt-4 text-center text-lg font-bold text-slate-900">Delete this project?</h3>
        <p className="mt-2 text-center text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{project.repository_name}</span> will be permanently removed from open source collaboration. This cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectFormModal({ onClose, onSuccess, username, editProject = null }) {
  const isEdit = Boolean(editProject);
  const [step, setStep] = useState(isEdit ? 2 : 1);
  const [importMode, setImportMode] = useState("url");
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [githubFetchLoading, setGithubFetchLoading] = useState(false);
  const [githubFetchError, setGithubFetchError] = useState("");
  const [gitProfileLoading, setGitProfileLoading] = useState(true);
  const [gitConnected, setGitConnected] = useState(false);
  const [gitViewer, setGitViewer] = useState(null);
  const [gitRepos, setGitRepos] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [repoSearch, setRepoSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    editProject
      ? {
          github_repo_id: editProject.github_repo_id || "",
          repository_name: editProject.repository_name || "",
          repository_url: editProject.repository_url || "",
          tagline: editProject.tagline || "",
          description: editProject.description || "",
          category: editProject.category || "",
          difficulty: editProject.difficulty || "Beginner Friendly",
          technologies: editProject.technologies || [],
          roles_needed: editProject.roles_needed || [],
          skills_required: editProject.skills_required || [],
          status: editProject.status || "Looking for Contributors",
          stars: editProject.stars || 0,
          forks: editProject.forks || 0,
          open_issues: editProject.open_issues || 0,
          owner_username: editProject.owner_username || "",
        }
      : {
          github_repo_id: "",
          repository_name: "",
          repository_url: "",
          tagline: "",
          description: "",
          category: "",
          difficulty: "Beginner Friendly",
          technologies: [],
          roles_needed: [],
          skills_required: [],
          status: "Looking for Contributors",
          stars: 0,
          forks: 0,
          open_issues: 0,
        }
  );

  useEffect(() => {
    let cancelled = false;

    const loadGitProfile = async () => {
      if (!username) {
        setGitProfileLoading(false);
        return;
      }
      try {
        const data = await fetch_git_profile(username);
        if (cancelled) return;
        const { viewer, repos } = getViewerRepos(data);
        setGitConnected(Boolean(viewer));
        setGitViewer(viewer);
        setGitRepos(repos);
        if (viewer && repos.length > 0) setImportMode("connected");
      } catch {
        if (!cancelled) {
          setGitConnected(false);
          setGitViewer(null);
          setGitRepos([]);
        }
      } finally {
        if (!cancelled) setGitProfileLoading(false);
      }
    };

    loadGitProfile();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const filteredRepos = useMemo(() => {
    const query = repoSearch.trim().toLowerCase();
    if (!query) return gitRepos;
    return gitRepos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description || "").toLowerCase().includes(query)
    );
  }, [gitRepos, repoSearch]);

  const applyRepoFormData = (mapped) => {
    setFormData((prev) => ({
      ...prev,
      ...mapped,
      roles_needed: prev.roles_needed,
      skills_required: prev.skills_required,
      category: prev.category,
      difficulty: prev.difficulty,
      status: prev.status,
    }));
    setStep(2);
  };

  const fetchFromUrl = async () => {
    setGithubFetchLoading(true);
    setGithubFetchError("");
    try {
      const parsed = parseGithubRepoUrl(githubRepoUrl);
      if (!parsed) {
        throw new Error("Invalid GitHub URL. Use format: https://github.com/owner/repo");
      }
      const repo = await fetchPublicGithubRepo(parsed.owner, parsed.repo);
      applyRepoFormData(mapGithubApiRepoToForm(repo));
    } catch (err) {
      setGithubFetchError(err.message || "Failed to fetch repository.");
    } finally {
      setGithubFetchLoading(false);
    }
  };

  const fetchFromConnectedRepo = async () => {
    setGithubFetchLoading(true);
    setGithubFetchError("");
    try {
      const repo = gitRepos.find((item) => item.id === selectedRepoId);
      if (!repo) throw new Error("Select a repository from your GitHub account.");

      let mapped = mapGraphqlRepoToForm(repo, repo.ownerLogin, repo.ownerAvatar);
      mapped = await enrichRepoFromPublicApi(mapped);
      applyRepoFormData(mapped);
    } catch (err) {
      setGithubFetchError(err.message || "Failed to import repository.");
    } finally {
      setGithubFetchLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.repository_name || !formData.repository_url) {
      alert("Repository information is missing.");
      return;
    }
    if (!hasText(formData.tagline)) {
      alert("Please add a tagline so others know what your project is about.");
      return;
    }
    if (!hasText(formData.description)) {
      alert("Please add a description explaining the project goals.");
      return;
    }

    try {
      setLoading(true);
      const payload = buildPayload(formData);
      if (isEdit) {
        await updateOpenSourceProject(editProject.id, payload);
      } else {
        await createOpenSourceProject(payload);
      }
      onSuccess(isEdit ? "Project updated successfully" : "Project published successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || `Failed to ${isEdit ? "update" : "publish"} project.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <FaGithub className="h-5 w-5" />
            {isEdit ? "Edit Project" : step === 1 ? "Import from GitHub" : "Add Collaboration Details"}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
          {step === 1 && !isEdit ? (
            <div className="space-y-5">
              <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => setImportMode("connected")}
                  disabled={!gitConnected}
                  className={`flex-1 rounded-xl px-3 py-2 text-[13px] font-bold transition ${
                    importMode === "connected" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"
                  } disabled:opacity-40`}
                >
                  My Repositories
                </button>
                <button
                  onClick={() => setImportMode("url")}
                  className={`flex-1 rounded-xl px-3 py-2 text-[13px] font-bold transition ${
                    importMode === "url" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  Import by URL
                </button>
              </div>

              {importMode === "connected" ? (
                gitProfileLoading ? (
                  <div className="py-8 text-center text-sm text-slate-500">Loading your GitHub repositories...</div>
                ) : !gitConnected ? (
                  <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-5 text-center">
                    <FaGithub className="mx-auto mb-3 h-8 w-8 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900">Connect GitHub to browse your repos</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      Link your GitHub account to import repositories you own without typing URLs.
                    </p>
                    <button
                      onClick={connectGithub}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                    >
                      <FaGithub size={14} />
                      Connect GitHub
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        {gitViewer?.avatarUrl ? (
                          <img src={gitViewer.avatarUrl} alt={gitViewer.login} className="h-8 w-8 rounded-full" />
                        ) : (
                          <FaGithub className="h-5 w-5" />
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-900">{gitViewer.login}</p>
                          <p className="text-xs text-emerald-700">GitHub connected</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{gitRepos.length} public repos</span>
                    </div>

                    <input
                      type="text"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                      placeholder="Search your repositories..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />

                    <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-2">
                      {filteredRepos.length === 0 ? (
                        <p className="py-6 text-center text-sm text-slate-500">No public repositories found.</p>
                      ) : (
                        filteredRepos.map((repo) => (
                          <button
                            key={repo.id}
                            onClick={() => setSelectedRepoId(repo.id)}
                            className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                              selectedRepoId === repo.id
                                ? "border-violet-300 bg-violet-50"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-900">{repo.name}</p>
                                <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                                  {repo.description || "No description"}
                                </p>
                              </div>
                              <div className="shrink-0 text-right text-xs font-semibold text-slate-500">
                                <p>{formatNumber(repo.stargazerCount)} stars</p>
                                <p>{formatNumber(repo.forkCount)} forks</p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Paste any public GitHub repository URL to import its real metadata.
                  </p>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Repository URL</label>
                    <input
                      type="url"
                      value={githubRepoUrl}
                      onChange={(e) => {
                        setGithubRepoUrl(e.target.value);
                        setGithubFetchError("");
                      }}
                      placeholder="https://github.com/owner/repo"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>
              )}

              {githubFetchError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={16} />
                  {githubFetchError}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-2 text-sm font-bold text-slate-900">
                  {isEdit ? "Linked repository" : "Imported from GitHub"}
                </h3>
                <p className="text-sm text-slate-700">
                  <strong>Repo:</strong>{" "}
                  <a href={formData.repository_url} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline">
                    {formData.repository_name || "Not linked"}
                  </a>
                </p>
                {formData.owner_username && (
                  <p className="text-sm text-slate-700">
                    <strong>Owner:</strong> {formData.owner_username}
                  </p>
                )}
                <p className="text-sm text-slate-700">
                  <strong>Stars:</strong> {formData.stars} | <strong>Forks:</strong> {formData.forks} |{" "}
                  <strong>Issues:</strong> {formData.open_issues}
                </p>
                {formData.technologies?.length > 0 ? (
                  <p className="mt-1 text-sm text-slate-700">
                    <strong>Tech:</strong> {formData.technologies.join(", ")}
                  </p>
                ) : (
                  <p className="mt-1 text-sm italic text-slate-400">{EMPTY.technologies}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Description & Goals</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                  placeholder="What is this project about? Why should students contribute?"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Roles Needed (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.roles_needed) ? formData.roles_needed.join(", ") : formData.roles_needed}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roles_needed: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Frontend, Backend, DevOps"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Skills Required (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(formData.skills_required) ? formData.skills_required.join(", ") : formData.skills_required}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skills_required: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Git, REST API, React"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                  >
                    {DIFFICULTIES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                  >
                    {STATUS_FILTERS.filter((s) => s !== "All").map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Web App, CLI Tool, Library"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 outline-none focus:border-violet-400"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
          {step === 1 && !isEdit ? (
            <>
              <button onClick={onClose} className="px-5 py-2 font-medium text-slate-600 hover:text-slate-900">
                Cancel
              </button>
              <button
                onClick={importMode === "connected" ? fetchFromConnectedRepo : fetchFromUrl}
                disabled={
                  githubFetchLoading ||
                  (importMode === "url" ? !githubRepoUrl : !selectedRepoId || !gitConnected)
                }
                className="rounded-xl bg-slate-900 px-6 py-2 font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {githubFetchLoading ? "Importing..." : "Next Step"}
              </button>
            </>
          ) : (
            <>
              {!isEdit && (
                <button onClick={() => setStep(1)} className="px-5 py-2 font-medium text-slate-600 hover:text-slate-900">
                  Back
                </button>
              )}
              {isEdit && <button onClick={onClose} className="px-5 py-2 font-medium text-slate-600 hover:text-slate-900">Cancel</button>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto rounded-xl bg-violet-600 px-6 py-2 font-medium text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60"
              >
                {loading ? (isEdit ? "Saving..." : "Publishing...") : isEdit ? "Save Changes" : "Publish Project"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function OpenSourceCollaborationPage() {
  const { user_name } = useParams();
  const { userData } = useContext(UserContext);
  const displayUserName = user_name || userData?.username || localStorage.getItem("username");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [sort, setSort] = useState("newest");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const isProjectOwner = (project) => project.owner_username === displayUserName;

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      setDeleteBusy(deleteTarget.id);
      await deleteOpenSourceProject(deleteTarget.id);
      setProjects((current) => current.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast(`"${deleteTarget.repository_name}" deleted`);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete project.");
    } finally {
      setDeleteLoading(false);
      setDeleteBusy(null);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchOpenSourceProjects();
      setProjects(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch (err) {
      console.error("Error loading projects", err);
      setError("Failed to load open source projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const displayedProjects = useMemo(() => {
    let list = [...projects];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.repository_name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.tagline?.toLowerCase().includes(query) ||
          p.owner_username?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query) ||
          p.technologies?.some((tech) => tech.toLowerCase().includes(query)) ||
          p.roles_needed?.some((role) => role.toLowerCase().includes(query)) ||
          p.skills_required?.some((skill) => skill.toLowerCase().includes(query))
      );
    }

    if (selectedStatus !== "All") {
      list = list.filter((p) => p.status === selectedStatus);
    }

    if (selectedDifficulty !== "All") {
      list = list.filter((p) => p.difficulty === selectedDifficulty);
    }

    return sortProjects(list, sort);
  }, [projects, searchQuery, selectedStatus, selectedDifficulty, sort]);

  const statValues = useMemo(
    () => ({
      total: projects.length,
      seeking: projects.filter((p) => p.status === "Looking for Contributors").length,
      goodFirst: projects.filter((p) => p.status === "Good First Issues").length,
    }),
    [projects]
  );

  const hasFilters = searchQuery.trim() || selectedStatus !== "All" || selectedDifficulty !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedDifficulty("All");
    setSort("newest");
  };

  return (
    <div>
      {toast && (
        <div className="fixed right-4 top-20 z-50 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-[13px] font-bold text-slate-800 shadow-2xl shadow-violet-500/10">
          {toast}
        </div>
      )}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Open Source <span className="text-violet-600">Collaboration</span>
              </h1>
              <p className="mt-1 text-[13px] font-medium text-slate-500">
                Discover projects, import from GitHub, and publish your own repositories.
              </p>
            </div>
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#111827] px-5 text-[13px] font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Publish Repository
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories, technologies, owners..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-[13px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </label>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                <Filter size={12} />
                Clear Filters
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <FilterDropdown label="Status" options={STATUS_FILTERS} value={selectedStatus} onSelect={setSelectedStatus} />
            <FilterDropdown label="Difficulty" options={["All", ...DIFFICULTIES]} value={selectedDifficulty} onSelect={setSelectedDifficulty} />
            <div className="relative ml-auto w-full sm:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort projects"
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[13px] font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                {SORTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] font-bold text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {loading ? (
            <SkeletonGrid />
          ) : displayedProjects.length === 0 ? (
            <EmptyState onPublish={() => setIsPublishModalOpen(true)} clearFilters={clearFilters} hasFilters={hasFilters} />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {displayedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  userName={displayUserName}
                  isOwner={isProjectOwner(project)}
                  deleteBusy={deleteBusy}
                  onEdit={(item) => setEditProject(item)}
                  onDelete={(item) => setDeleteTarget(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isPublishModalOpen && (
          <ProjectFormModal
            username={displayUserName}
            onClose={() => setIsPublishModalOpen(false)}
            onSuccess={(message) => {
              setIsPublishModalOpen(false);
              loadProjects();
              showToast(message);
            }}
          />
        )}
        {editProject && (
          <ProjectFormModal
            username={displayUserName}
            editProject={editProject}
            onClose={() => setEditProject(null)}
            onSuccess={(message) => {
              setEditProject(null);
              loadProjects();
              showToast(message);
            }}
          />
        )}
        {deleteTarget && (
          <DeleteConfirmModal
            project={deleteTarget}
            loading={deleteLoading}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

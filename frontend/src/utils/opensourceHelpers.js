export const EMPTY = {
  tagline: "No tagline added — the maintainer can add one when editing this project.",
  description: "The maintainer hasn't written a project description yet.",
  category: "Uncategorized",
  technologies: "No tech stack listed yet.",
  roles: "No specific roles listed — open to all contributors.",
  skills: "No skills specified yet.",
  owner: "Unknown maintainer",
  status: "Status not set",
  difficulty: "Difficulty not set",
};

export function hasText(value) {
  return Boolean(value && String(value).trim());
}

export function displayTagline(project) {
  if (hasText(project?.tagline)) return project.tagline;
  if (hasText(project?.description)) return project.description;
  return EMPTY.tagline;
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return "Recently added";
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

export function cardGradient(name = "") {
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

export function buildOpenSourcePayload(formData) {
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

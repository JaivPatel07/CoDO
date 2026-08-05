export const EMPTY = {
    tagline: "No tagline added — open the project to learn more.",
    description: "The maintainer hasn't written a description yet.",
    category: "General",
    technologies: "Tech stack not listed yet",
    roles: "No specific roles listed — open to contributors",
    skills: "No skills specified yet",
    owner: "Unknown maintainer",
};

export const statusAccent = {
    "Looking for Contributors": "bg-violet-50 text-violet-700 border-violet-200",
    "Good First Issues": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Actively Developing": "bg-sky-50 text-sky-700 border-sky-200",
    Maintenance: "bg-orange-50 text-orange-700 border-orange-200",
};

export function hasText(value) {
    return Boolean(value && String(value).trim());
}

export function displayTagline(project) {
    if (hasText(project.tagline)) return project.tagline;
    if (hasText(project.description)) return project.description;
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

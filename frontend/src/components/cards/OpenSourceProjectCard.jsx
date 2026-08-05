import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Code2,
  Edit2,
  GitFork,
  MessageCircle,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { formatNumber } from "../../utils/format";
import { EMPTY, displayTagline, formatRelativeDate, hasText, statusAccent } from "../../utils/projectHelpers";

const OpenSourceProjectCard = memo(function OpenSourceProjectCard({
  project,
  userName,
  isOwner,
  onEdit,
  onDelete,
  deleteBusy,
  onToggleSave,
  saveBusyId,
}) {
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
      {isOwner && onEdit && onDelete && (
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

        {onToggleSave && (
          <button
            onClick={(e) => onToggleSave(project, e)}
            disabled={saveBusyId === project.id}
            aria-label={project.is_saved ? `Remove ${project.repository_name} from saved` : `Save ${project.repository_name}`}
            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition disabled:opacity-60 ${
              project.is_saved
                ? "border-[#7C3AED] bg-[#7C3AED] text-white"
                : "border-white/60 bg-white/90 text-slate-600 hover:text-[#7C3AED]"
            }`}
          >
            <Bookmark size={16} fill={project.is_saved ? "currentColor" : "none"} />
          </button>
        )}
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

export default OpenSourceProjectCard;

import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    Bookmark,
    Building2,
    Calendar,
    Check,
    Clock,
    Heart,
    ImageOff,
    MapPin,
    Share2,
} from "lucide-react";

import { formatNumber } from "../../utils/format";
import { formatDateRange, getDaysLeftText, getEventMode, getEventStatus } from "../../utils/eventHelpers";

const EventCard = memo(function EventCard({
    event,
    userName,
    interestBusyId,
    saveBusyId,
    onShare,
    onToggleInterest,
    onToggleSave,
}) {
    const navigate = useNavigate();
    const status = getEventStatus(event);
    const mode = getEventMode(event);
    const daysLeftText = getDaysLeftText(event);
    const category = event.category?.toUpperCase() || "TECH";
    const organizationName = event.organization_name || event.organization_username || "Verified Organization";
    const openDetails = () => navigate(`/user/${userName}/event/${event.id}`);
    const openOrgProfile = () =>
        navigate(`/organization/${event.organization_username || event.organization_name || ""}/profile`);

    return (
        <article className="group mx-auto flex w-full max-w-[340px] flex-col overflow-hidden rounded-[24px] border border-[#E9E9EF] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,24,39,0.12)]">
            <div className="relative h-[140px] overflow-hidden rounded-t-[24px] bg-slate-100">
                {event.banner_image ? (
                    <img
                        src={event.banner_image}
                        alt={`${event.title} banner`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-slate-100 text-slate-400">
                        <div className="flex h-10 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
                            <ImageOff size={22} />
                        </div>
                        <p className="mt-2 text-xs font-semibold text-slate-400">Event cover</p>
                    </div>
                )}

                <div className="absolute inset-x-0 top-4 grid grid-cols-3 items-center gap-2 px-4">
                    <span className="justify-self-start rounded-full bg-[#7C3AED]/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-sm backdrop-blur-md">
                        {category}
                    </span>
                    <span className="justify-self-center rounded-full border border-white/50 bg-white/75 px-3 py-1.5 text-[11px] font-black text-[#111827] shadow-sm backdrop-blur-md">
                        {mode}
                    </span>
                    <span className="justify-self-end rounded-full border border-[#E5E7EB] bg-white/90 px-3 py-1.5 text-[11px] font-black text-[#111827] shadow-sm backdrop-blur-md">
                        {status}
                    </span>
                </div>

                {onToggleSave && (
                    <button
                        onClick={(e) => onToggleSave(event, e)}
                        disabled={saveBusyId === event.id}
                        aria-label={event.is_saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
                        className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border shadow-md backdrop-blur-md transition disabled:opacity-60 ${
                            event.is_saved
                                ? "border-[#7C3AED] bg-[#7C3AED] text-white"
                                : "border-white/60 bg-white/90 text-slate-600 hover:text-[#7C3AED]"
                        }`}
                    >
                        <Bookmark size={16} fill={event.is_saved ? "currentColor" : "none"} />
                    </button>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openOrgProfile}
                        className="group/org flex min-w-0 items-center gap-3 text-left"
                        aria-label={`View ${organizationName} profile`}
                    >
                        {event.organization_logo ? (
                            <img
                                src={event.organization_logo}
                                alt={`${organizationName} logo`}
                                loading="lazy"
                                className="h-11 w-11 rounded-full border border-[#E5E7EB] object-cover transition group-hover/org:ring-2 group-hover/org:ring-[#7C3AED]/40"
                            />
                        ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-slate-50 text-slate-500 transition group-hover/org:ring-2 group-hover/org:ring-[#7C3AED]/40">
                                <Building2 size={16} />
                            </div>
                        )}

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="truncate text-[13px] font-bold text-[#111827] transition group-hover/org:text-[#7C3AED]">{organizationName}</p>
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                                    <Check size={11} strokeWidth={3} />
                                </span>
                            </div>
                            <p className="mt-0.5 text-[13px] text-[#6B7280]">Verified organization</p>
                        </div>
                    </button>

                    <div className="ml-auto flex shrink-0 flex-col items-end gap-1.5 text-[12px] font-semibold text-[#6B7280]">
                        <span className="flex items-center gap-1.5">
                            <Heart size={13} />
                            {formatNumber(event.interested_count)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {daysLeftText}
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="line-clamp-2 text-[18px] font-bold leading-[1.15] text-[#111827]">
                        {event.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-[40px] text-[13px] leading-6 text-[#6B7280]">
                        {event.short_description || "No short description provided."}
                    </p>
                </div>

                <div className="mt-5 space-y-3.5">
                    <div className="flex items-start gap-3">
                        <Calendar size={19} className="mt-0.5 shrink-0 text-[#7C3AED]" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Date</p>
                            <p className="mt-1 text-[13px] font-semibold text-[#111827]">{formatDateRange(event)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin size={19} className="mt-0.5 shrink-0 text-[#7C3AED]" />
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Location</p>
                            <p className="mt-1 truncate text-[13px] font-semibold text-[#111827]">{event.location || mode}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-[minmax(0,1fr)_48px_minmax(130px,auto)] items-center gap-2">
                    <button
                        onClick={(e) => onToggleInterest?.(event, e)}
                        disabled={!onToggleInterest || interestBusyId === event.id}
                        aria-label={event.is_interested ? `Remove interest for ${event.title}` : `Mark interested in ${event.title}`}
                        className={`inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 text-[13px] font-bold transition focus:outline-none focus:ring-4 focus:ring-violet-100 ${
                            event.is_interested
                                ? "border-[#7C3AED] bg-violet-50 text-[#7C3AED]"
                                : "border-[#7C3AED] bg-white text-[#7C3AED] hover:bg-violet-50"
                        } disabled:opacity-60`}
                    >
                        <Heart size={15} fill={event.is_interested ? "currentColor" : "none"} />
                        <span className="truncate">Interested</span>
                    </button>
                    <button
                        onClick={(e) => onShare?.(event, e)}
                        disabled={!onShare}
                        aria-label={`Share ${event.title}`}
                        className="flex h-10 w-12 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#A78BFA] hover:text-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:opacity-60"
                    >
                        <Share2 size={16} />
                    </button>
                    <button
                        onClick={openDetails}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-[18px] bg-[#111827] px-4 text-[13px] font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200"
                    >
                        <span className="whitespace-nowrap">View Details</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </article>
    );
});

export default EventCard;

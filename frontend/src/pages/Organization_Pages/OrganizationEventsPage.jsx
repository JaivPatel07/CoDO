import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertCircle,
    BarChart3,
    Building2,
    Calendar,
    ChevronDown,
    Check,
    Copy,
    Edit,
    Eye,
    FilePlus2,
    Heart,
    ImageOff,
    MapPin,
    MoreHorizontal,
    Plus,
    Search,
    Share2,
    Sparkles,
    Trash2,
    UserPlus,
    Users,
} from "lucide-react";
import { delete_event, fetch_events, fetch_organization_dashboard_analytics } from "../../api/events_apis";
import { UserContext } from "../../contextAPI/userContext";

const FILTERS = ["All", "Upcoming", "Ongoing", "Completed"];
const SORTS = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Registered", value: "most_registered" },
    { label: "Most Viewed", value: "most_viewed" },
    { label: "Most Interested", value: "most_interested" },
];

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

function getEventMode(event) {
    if (event.event_mode) return event.event_mode;
    const location = (event.location || "").toLowerCase();
    if (location.includes("online") || location.includes("virtual") || location.includes("remote")) return "Online";
    if (location.includes("hybrid")) return "Hybrid";
    return "Offline";
}

function getEventStatus(event) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${event.event_date}T00:00:00`);
    const end = event.end_date ? new Date(`${event.end_date}T00:00:00`) : start;

    if (start > today) return "Upcoming";
    if (start <= today && end >= today) return "Ongoing";
    return "Completed";
}

function formatDate(value) {
    if (!value) return "Date not set";
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatDateRange(event) {
    if (!event.event_date) return "Date not set";
    const startText = formatDate(event.event_date);
    if (!event.end_date || event.end_date === event.event_date) return startText;
    return `${startText} - ${formatDate(event.end_date)}`;
}

function StatCard({ icon: Icon, label, value, hint }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-black text-slate-900">{formatNumber(value)}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon size={16} />
                </div>
            </div>
            {hint && <p className="mt-2 text-xs font-medium text-slate-500">{hint}</p>}
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[24px] border border-[#E9E9EF] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="relative h-[140px] animate-pulse bg-slate-100">
                <div className="absolute left-4 top-4 h-8 w-16 rounded-full bg-white/80" />
                <div className="absolute left-1/2 top-4 h-8 w-20 -translate-x-1/2 rounded-full bg-white/80" />
                <div className="absolute right-4 top-4 h-8 w-20 rounded-full bg-white/80" />
            </div>
            <div className="animate-pulse p-4">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-slate-100" />
                        <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 w-12 rounded bg-slate-100" />
                        <div className="h-3 w-12 rounded bg-slate-100" />
                    </div>
                </div>
                <div className="mt-6 space-y-3">
                    <div className="h-7 w-4/5 rounded bg-slate-100" />
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                </div>
                <div className="mt-5 space-y-4">
                    <div className="flex gap-3">
                        <div className="h-5 w-5 rounded bg-slate-100" />
                        <div className="space-y-2">
                            <div className="h-3 w-12 rounded bg-slate-100" />
                            <div className="h-4 w-44 rounded bg-slate-100" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-5 w-5 rounded bg-slate-100" />
                        <div className="space-y-2">
                            <div className="h-3 w-16 rounded bg-slate-100" />
                            <div className="h-4 w-28 rounded bg-slate-100" />
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-[minmax(0,1fr)_48px_48px] gap-2">
                    <div className="h-10 rounded-2xl bg-slate-100" />
                    <div className="h-10 rounded-2xl bg-slate-100" />
                    <div className="h-10 rounded-2xl bg-slate-100" />
                </div>
            </div>
        </div>
    );
}

function EmptyState({ onPublish }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-100 bg-violet-50 text-violet-500">
                <Sparkles size={34} />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-900">No events published yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-6 text-slate-500">
                Create your first event to start tracking registrations, interest, and event performance.
            </p>
            {onPublish && (
                <button
                    onClick={onPublish}
                    className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
                >
                    <Plus size={16} />
                    Publish Your First Event
                </button>
            )}
        </div>
    );
}

function EventCard({ event, username, isManagementView, openMenuId, setOpenMenuId, onDelete, onDuplicate, onCopy, onShare }) {
    const navigate = useNavigate();
    const status = getEventStatus(event);
    const mode = getEventMode(event);
    const menuRef = useRef(null);
    const organizationName = event.organization_name || event.organization_username || "Organization";

    useEffect(() => {
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuId(null);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [setOpenMenuId]);

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
                        {event.category?.toUpperCase() || "TECH"}
                    </span>
                    <span className="justify-self-center rounded-full border border-white/50 bg-white/75 px-3 py-1.5 text-[11px] font-black text-[#111827] shadow-sm backdrop-blur-md">
                        {mode}
                    </span>
                    <span className="justify-self-end rounded-full border border-[#E5E7EB] bg-white/90 px-3 py-1.5 text-[11px] font-black text-[#111827] shadow-sm backdrop-blur-md">
                        {status}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-3">
                    {event.organization_logo ? (
                        <img
                            src={event.organization_logo}
                            alt={`${organizationName} logo`}
                            loading="lazy"
                            className="h-11 w-11 rounded-full border border-[#E5E7EB] object-cover"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-slate-50 text-slate-500">
                            <Building2 size={16} />
                        </div>
                    )}

                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="truncate text-[13px] font-bold text-[#111827]">{organizationName}</p>
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white">
                                <Check size={11} strokeWidth={3} />
                            </span>
                        </div>
                        <p className="mt-0.5 text-[13px] text-[#6B7280]">Verified organization</p>
                    </div>

                    <div className="ml-auto flex shrink-0 flex-col items-end gap-1.5 text-[12px] font-semibold text-[#6B7280]">
                        <span className="flex items-center gap-1.5">
                            <Heart size={13} />
                            {formatNumber(event.interested_count)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye size={13} />
                            {formatNumber(event.profile_views)}
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

                <div className="mt-6 grid grid-cols-[minmax(0,1fr)_48px_48px] items-center gap-2">
                    {isManagementView && (
                        <button
                            onClick={() => navigate(`/organization/${username}/events/edit/${event.id}`)}
                            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-[#7C3AED] bg-white px-3 text-[13px] font-bold text-[#7C3AED] transition hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-100"
                        >
                            <Edit size={16} />
                            <span className="truncate">Edit Event</span>
                        </button>
                    )}
                    {!isManagementView && (
                        <button
                            onClick={() => navigate(`/organization/${username}/event/${event.id}`)}
                            className="inline-flex h-10 min-w-0 items-center justify-center gap-2 rounded-2xl border border-[#7C3AED] bg-white px-3 text-[13px] font-bold text-[#7C3AED] transition hover:bg-violet-50 focus:outline-none focus:ring-4 focus:ring-violet-100"
                        >
                            <Eye size={16} />
                            <span className="truncate">View Event</span>
                        </button>
                    )}
                    <button
                        onClick={(e) => onShare(event, e)}
                        aria-label={`Share ${event.title}`}
                        className="flex h-10 w-12 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#A78BFA] hover:text-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-violet-100"
                    >
                        <Share2 size={16} />
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                            aria-label={`More actions for ${event.title}`}
                            aria-expanded={openMenuId === event.id}
                            className="flex h-10 w-12 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#A78BFA] hover:text-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-violet-100"
                        >
                            <MoreHorizontal size={16} />
                        </button>
                        {openMenuId === event.id && (
                            <div className="absolute bottom-full right-0 z-20 mb-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                                {isManagementView && <MenuButton icon={BarChart3} label="Analytics" onClick={() => navigate(`/organization/${username}/event/${event.id}`)} />}
                                {isManagementView && <MenuButton icon={FilePlus2} label="Duplicate" onClick={(e) => onDuplicate(event, e)} />}
                                <MenuButton icon={Eye} label="View Details" onClick={() => navigate(`/organization/${username}/event/${event.id}`)} />
                                <MenuButton icon={Copy} label="Copy Link" onClick={(e) => onCopy(event.id, e)} />
                                {isManagementView && <MenuButton icon={Trash2} label="Delete" danger onClick={(e) => onDelete(event.id, e)} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function MenuButton({ icon: Icon, label, onClick, danger = false }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] font-bold transition ${
                danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50"
            }`}
        >
            <Icon size={14} />
            {label}
        </button>
    );
}

export default function OrganizationEventsPage({ organization = null }) {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [sort, setSort] = useState("newest");
const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const pageSize = 9;
    const orgUsername = organization?.username || userData?.username;
    const isManagementView = !organization || organization?.username === userData?.username;

    // Guard against duplicate "Load More" fetches (double clicks / StrictMode)
    const loadingMoreRef = useRef(false);

    const loadEvents = async ({ nextPage = 1, append = false } = {}) => {
        if (!orgUsername) return;
        // Prevent duplicate in-flight "load more" requests
        if (append && loadingMoreRef.current) return;
        if (append) loadingMoreRef.current = true;

        try {
            append ? setLoadingMore(true) : setLoading(true);
            setError(null);
            const [eventData, analyticsData] = await Promise.all([
                fetch_events({
                    org: orgUsername,
                    search,
                    status: activeFilter.toLowerCase(),
                    sort,
                    page: nextPage,
                    page_size: pageSize,
                }),
                append || !isManagementView ? Promise.resolve(analytics) : fetch_organization_dashboard_analytics(),
            ]);

            setEvents((current) => {
                if (!append) return eventData.results;
                // Deduplicate by event id to avoid repeats from overlapping pages
                const seen = new Set(current.map((e) => e.id));
                const fresh = (eventData.results || []).filter((e) => !seen.has(e.id));
                return [...current, ...fresh];
            });
            setHasNext(eventData.has_next);
            setPage(eventData.page);
            if (!append) setAnalytics(analyticsData);
        } catch (err) {
            setError(err.error || "Failed to load events.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
            loadingMoreRef.current = false;
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => loadEvents({ nextPage: 1 }), 250);
        return () => clearTimeout(timer);
    }, [orgUsername, search, activeFilter, sort]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this event? This action cannot be undone.")) return;
        try {
            await delete_event(id);
            setEvents((current) => current.filter((event) => event.id !== id));
            setOpenMenuId(null);
        } catch (err) {
            alert(err.error || "Failed to delete event.");
        }
    };

    const handleDuplicate = (event, e) => {
        e.stopPropagation();
        const { id, organization, organization_username, organization_name, organization_logo, created_at, updated_at, registration_link_clicks, ...duplicateData } = event;
        navigate(`/organization/${userData.username}/create/event`, { state: { duplicateEvent: duplicateData } });
        setOpenMenuId(null);
    };

    const handleCopyLink = (eventId, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${window.location.origin}/organization/${orgUsername}/event/${eventId}`);
        setOpenMenuId(null);
    };

    const handleShare = async (event, e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/organization/${orgUsername}/event/${event.id}`;
        if (navigator.share) {
            await navigator.share({ title: event.title, text: event.short_description, url }).catch(() => {});
        } else {
            await navigator.clipboard.writeText(url);
        }
    };

    const cards = analytics?.cards;

    return (
        <div>
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Organization Events</h1>
                        <p className="mt-1 text-[13px] font-medium text-slate-500">
                            Manage, monitor, and publish events from one focused workspace.
                        </p>
                    </div>
                    {isManagementView && (
                        <button
                            onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
                        >
                            <Plus size={16} />
                            Publish Event
                        </button>
                    )}
                </div>

                <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                    <label className="relative block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, category, tag, or description"
                            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-[13px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                        />
                    </label>

                    <div className="flex gap-2 overflow-x-auto">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`h-11 rounded-2xl border px-4 text-[13px] font-bold transition focus:outline-none focus:ring-4 focus:ring-violet-100 ${
                                    activeFilter === filter
                                        ? "border-violet-200 bg-violet-50 text-violet-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <label className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-11 w-full appearance-none rounded-2xl border border-slate-200 bg-white pl-4 pr-10 text-[13px] font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 lg:w-48"
                            aria-label="Sort events"
                        >
                            {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </label>
                </div>
            </section>

            <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Calendar} label="Total Events" value={cards?.events_hosted?.total || events.length} hint={isManagementView ? `${formatNumber(cards?.events_hosted?.current_month)} created this month` : "Published by this organization"} />
                <StatCard icon={Users} label="Total Followers" value={cards?.followers?.total} hint={isManagementView ? `${formatNumber(cards?.followers?.current_month)} new this month` : "Available to account owners"} />
                <StatCard icon={Eye} label="Profile Views" value={cards?.profile_views?.total} hint={isManagementView ? `${cards?.profile_views?.monthly_growth_percent || 0}% vs last month` : "Available to account owners"} />
                <StatCard icon={UserPlus} label="Registrations" value={cards?.registrations?.total} hint={isManagementView ? `${formatNumber(cards?.registrations?.current_month)} gained this month` : "Available to account owners"} />
            </section>

            {error && (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] font-bold text-red-700">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <section className="mt-6">
                {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>
                ) : events.length === 0 ? (
                    <EmptyState onPublish={isManagementView ? () => navigate(`/organization/${userData.username}/create/event`) : null} />
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {events.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    username={orgUsername}
                                    isManagementView={isManagementView}
                                    openMenuId={openMenuId}
                                    setOpenMenuId={setOpenMenuId}
                                    onDelete={handleDelete}
                                    onDuplicate={handleDuplicate}
                                    onCopy={handleCopyLink}
                                    onShare={handleShare}
                                />
                            ))}
                        </div>
                        {hasNext && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => loadEvents({ nextPage: page + 1, append: true })}
                                    disabled={loadingMore}
                                    className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-100"
                                >
                                    {loadingMore ? "Loading..." : "Load More"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

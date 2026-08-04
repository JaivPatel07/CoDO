import { memo, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Calendar,
    Check,
    ChevronDown,
    Clock,
    Filter,
    Heart,
    ImageOff,
    MapPin,
    Search,
    Share2,
    Sparkles,
    X,
} from "lucide-react";
import { fetch_events, mark_event_interested, unmark_event_interested } from "../../api/events_apis";
import { UserContext } from "../../contextAPI/userContext";

const CATEGORIES = ["All", "Tech", "Design", "Business", "Culture", "Sports", "Others"];
const STATUS_FILTERS = ["All", "Upcoming", "Ongoing", "Completed"];
const SORTS = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Registered", value: "most_registered" },
    { label: "Most Viewed", value: "most_viewed" },
    { label: "Most Interested", value: "most_interested" },
];

const categoryAccent = {
    Tech: "bg-violet-50 text-violet-700 border-violet-200",
    Design: "bg-pink-50 text-pink-700 border-pink-200",
    Business: "bg-sky-50 text-sky-700 border-sky-200",
    Culture: "bg-orange-50 text-orange-700 border-orange-200",
    Sports: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Others: "bg-slate-50 text-slate-700 border-slate-200",
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

function getEventMode(event) {
    if (event.event_mode) return event.event_mode;
    const location = (event.location || "").toLowerCase();
    if (location.includes("hybrid")) return "Hybrid";
    if (location.includes("online") || location.includes("virtual") || location.includes("remote")) return "Online";
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

function daysLeft(event) {
    if (!event.event_date) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(`${event.event_date}T00:00:00`);
    return Math.ceil((start - today) / 86400000);
}

function formatDateRange(event) {
    if (!event.event_date) return "Date not set";
    const start = new Date(`${event.event_date}T00:00:00`);
    const startText = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    if (!event.end_date || event.end_date === event.event_date) return startText;
    const end = new Date(`${event.end_date}T00:00:00`);
    return `${startText} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
}

function getDaysLeftText(event) {
    const remaining = daysLeft(event);
    if (remaining === null) return "Date pending";
    if (remaining > 1) return `${remaining} days left`;
    if (remaining === 1) return "1 day left";
    if (remaining === 0) return "Today";
    return getEventStatus(event);
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
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="mx-auto w-full max-w-[340px] overflow-hidden rounded-[24px] border border-[#E9E9EF] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
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
                                <div className="h-3 w-16 rounded bg-slate-100" />
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
                        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_48px_minmax(130px,auto)] gap-2">
                            <div className="h-10 rounded-2xl bg-slate-100" />
                            <div className="h-10 rounded-2xl bg-slate-100" />
                            <div className="h-10 rounded-[18px] bg-slate-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyState({ clearFilters, openCalendar }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[28px] border border-violet-100 bg-violet-50 text-violet-500">
                <Calendar size={36} />
            </div>
            <h3 className="mt-6 text-2xl font-black text-slate-950">No matching events</h3>
            <p className="mx-auto mt-2 max-w-sm text-[13px] font-medium leading-6 text-slate-500">
                Try broadening your search, browsing categories, or opening the calendar for date-based discovery.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={clearFilters} className="rounded-2xl bg-violet-600 px-5 py-3 text-[13px] font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200">
                    Clear filters
                </button>
                <button onClick={openCalendar} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100">
                    Open calendar
                </button>
            </div>
        </div>
    );
}

const EventCard = memo(function EventCard({ event, userName, interestBusyId, onShare, onToggleInterest }) {
    const navigate = useNavigate();
    const status = getEventStatus(event);
    const mode = getEventMode(event);
    const daysLeftText = getDaysLeftText(event);
    const category = event.category?.toUpperCase() || "TECH";
    const organizationName = event.organization_name || event.organization_username || "Verified Organization";

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
                        onClick={(e) => onToggleInterest(event, e)}
                        disabled={interestBusyId === event.id}
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
                        onClick={(e) => onShare(event, e)}
                        aria-label={`Share ${event.title}`}
                        className="flex h-10 w-12 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#A78BFA] hover:text-[#7C3AED] focus:outline-none focus:ring-4 focus:ring-violet-100"
                    >
                        <Share2 size={16} />
                    </button>
                    <button
                        onClick={() => navigate(`/user/${userName}/event/${event.id}`)}
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

function FilterDropdown({ label, options, value, onSelect, icon: Icon }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-violet-100">
                {Icon && <Icon size={15} className="text-slate-400" />}
                <span>{label}:</span>
                <span className="font-bold text-violet-700">{value}</span>
                <ChevronDown size={15} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full z-10 mt-2 w-48 origin-top-left rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                    {options.map(option => (
                        <button key={option} onClick={() => { onSelect(option); setIsOpen(false); }}
                            className={`w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold transition-colors ${value === option ? 'bg-violet-50 text-violet-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function EventsPage() {
    const { user_name } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(UserContext); 
    const [searchParams, setSearchParams] = useSearchParams();

    const [events, setEvents] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasNext, setHasNext] = useState(false);
    const [page, setPage] = useState(1);
    const [interestBusyId, setInterestBusyId] = useState(null);
    const [toast, setToast] = useState("");

    const [localSearch, setLocalSearch] = useState(searchParams.get("search") || "");
    // Filters are now managed via URL search params for shareability and persistence
    const searchTerm = searchParams.get("search") || "";
    const selectedCategory = searchParams.get("category") || "All";
    const selectedStatus = searchParams.get("status") || "All";
    const selectedDate = searchParams.get("date") || "";
    const sort = searchParams.get("sort") || "newest";

    const pageSize = 9;
    const displayUserName = user_name || userData?.username;

    const loadEvents = async ({ nextPage = 1, append = false } = {}) => {
        try {
            append ? setLoadingMore(true) : setLoading(true);
            setError(null); 
            const data = await fetch_events({
                search: searchTerm.trim(),
                category: selectedCategory === "All" ? "" : selectedCategory,
                status: selectedStatus.toLowerCase(),
                date: selectedDate,
                sort,
                page: nextPage,
                page_size: pageSize,
            });
            const nextEvents = data.results || [];
            setEvents((current) => (append ? [...current, ...nextEvents] : nextEvents));
            setTotalCount(data.count || 0);
            setPage(data.page || nextPage);
            setHasNext(Boolean(data.has_next));
        } catch (err) {
            setError(err.error || "Failed to load events.");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            updateQuery("search", localSearch);
        }, 300); // 300ms delay
        return () => clearTimeout(timer);
    }, [localSearch]);

    useEffect(() => {
        loadEvents({ nextPage: 1 });
    }, [searchParams.toString()]); // Use toString() to depend on the actual query string

    // Helper to update search params without losing existing ones
    const updateQuery = (key, value) => {
        setSearchParams(prev => {
            if (value === "" || value === "All") {
                prev.delete(key);
            } else {
                prev.set(key, value);
            }
            return prev;
        }, { replace: true });
    };

    const activeFilters = [
        searchTerm ? { label: searchTerm, clear: () => updateQuery("search", "") } : null,
        selectedCategory !== "All" ? { label: selectedCategory, clear: () => updateQuery("category", "All") } : null,
        selectedStatus !== "All" ? { label: selectedStatus, clear: () => updateQuery("status", "All") } : null,
        selectedDate ? { label: selectedDate, clear: () => updateQuery("date", "") } : null,
    ].filter(Boolean);

    const clearFilters = () => {
        setSearchParams({}, { replace: true });
    };

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2200);
    };

    const handleCopyLink = async (eventId, e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/user/${user_name}/event/${eventId}`);
            showToast("Event link copied");
        } catch (err) {
            alert("Failed to copy link.");
        }
    };

    const handleShare = async (event, e) => {
        e.stopPropagation();
        const shareData = { title: event.title, text: event.short_description, url: `${window.location.origin}/user/${user_name}/event/${event.id}` };
        if (navigator.share) await navigator.share(shareData).catch(() => {});
        else await handleCopyLink(event.id, e);
    };

    const handleToggleInterest = async (event, e) => {
        e.stopPropagation();
        if (interestBusyId === event.id) return;
        const nextInterested = !event.is_interested;
        setInterestBusyId(event.id);
        setEvents((current) => current.map((item) => item.id === event.id ? { ...item, is_interested: nextInterested, interested_count: Math.max((item.interested_count || 0) + (nextInterested ? 1 : -1), 0) } : item));
        try {
            const data = event.is_interested ? await unmark_event_interested(event.id) : await mark_event_interested(event.id);
            setEvents((current) => current.map((item) => item.id === event.id ? { ...item, is_interested: data.is_interested, interested_count: data.interested_count } : item));
            showToast(data.is_interested ? "Added to your interested events" : "Removed from interested events");
        } catch (err) {
            setEvents((current) => current.map((item) => item.id === event.id ? { ...item, is_interested: !nextInterested, interested_count: event.interested_count } : item));
            showToast("Error: Could not update interest.");
        } finally {
            setInterestBusyId(null);
        }
    };

    return (
        <div>
            {toast && (
                <div className="fixed right-4 top-20 z-50 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-[13px] font-bold text-slate-800 shadow-2xl shadow-violet-500/10">
                    {toast}
                </div>
            )}

            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="relative block flex-1 max-w-xl">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                            <input value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Search events, organizations, technologies..." className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-20 text-[13px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100" />
                            {localSearch && <button onClick={() => setLocalSearch("")} aria-label="Clear search" className="absolute right-14 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={14} /></button>}
                            <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 sm:inline">/</span>
                        </label>
                        <div className="flex items-center justify-end gap-2">
                            {activeFilters.length > 0 && (
                                <button onClick={clearFilters} className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100">
                                    <Filter size={12} /> Clear Filters ({activeFilters.length})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Bottom row: Filters */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <FilterDropdown label="Category" options={CATEGORIES} value={selectedCategory} onSelect={(val) => updateQuery("category", val)} />
                        <FilterDropdown label="Status" options={STATUS_FILTERS} value={selectedStatus} onSelect={(val) => updateQuery("status", val)} />
                        <input type="date" value={selectedDate} onChange={(e) => updateQuery("date", e.target.value)} aria-label="Filter by date" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100" />
                        <div className="relative ml-auto w-full sm:w-auto">
                            <select value={sort} onChange={(e) => updateQuery("sort", e.target.value)} aria-label="Sort events" className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[13px] font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100">
                                {SORTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                            </select>
                            <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {error && <div className="mb-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-[13px] font-bold text-red-700"><AlertCircle size={16} />{error}</div>}

                    {loading ? <SkeletonGrid /> : events.length === 0 ? (
                        <EmptyState clearFilters={clearFilters} openCalendar={() => navigate(`/user/${displayUserName}/calendar`)} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {events.map((event) => (
                                    <EventCard key={event.id} event={event} userName={displayUserName} interestBusyId={interestBusyId} onShare={handleShare} onToggleInterest={handleToggleInterest} />
                                ))}
                            </div>
                            {hasNext && (
                                <div className="mt-8 flex justify-center">
                                    <button onClick={() => loadEvents({ nextPage: page + 1, append: true })} disabled={loadingMore} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[13px] font-bold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-violet-100">
                                        {loadingMore ? "Loading..." : "Load More"}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

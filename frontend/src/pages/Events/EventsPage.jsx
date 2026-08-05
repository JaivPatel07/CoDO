import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
    AlertCircle,
    Calendar,
    ChevronDown,
    Filter,
    Search,
    X,
} from "lucide-react";
import { fetch_events, mark_event_interested, unmark_event_interested } from "../../api/events_apis";
import { save_item, unsave_item } from "../../api/saved_apis";
import EventCard from "../../components/cards/EventCard";
import { UserContext } from "../../contextAPI/userContext";
import { formatNumber } from "../../utils/format";

const CATEGORIES = ["All", "Tech", "Design", "Business", "Culture", "Sports", "Others"];
const STATUS_FILTERS = ["All", "Upcoming", "Ongoing", "Completed"];
const SORTS = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Most Registered", value: "most_registered" },
    { label: "Most Viewed", value: "most_viewed" },
    { label: "Most Interested", value: "most_interested" },
];

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
    const [saveBusyId, setSaveBusyId] = useState(null);
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

    const handleToggleSave = async (event, e) => {
        e.stopPropagation();
        if (saveBusyId === event.id) return;
        const nextSaved = !event.is_saved;
        setSaveBusyId(event.id);
        setEvents((current) => current.map((item) => item.id === event.id ? { ...item, is_saved: nextSaved } : item));
        try {
            if (nextSaved) await save_item("event", event.id);
            else await unsave_item("event", event.id);
            showToast(nextSaved ? "Saved to your items" : "Removed from saved items");
        } catch {
            setEvents((current) => current.map((item) => item.id === event.id ? { ...item, is_saved: !nextSaved } : item));
            showToast("Error: Could not update saved items.");
        } finally {
            setSaveBusyId(null);
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
                                    <EventCard key={event.id} event={event} userName={displayUserName} interestBusyId={interestBusyId} saveBusyId={saveBusyId} onShare={handleShare} onToggleInterest={handleToggleInterest} onToggleSave={handleToggleSave} />
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

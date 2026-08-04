import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Calendar as CalendarIcon, Clock, Users, Search, Bookmark, Building2, LayoutGrid, Zap, AlertCircle } from "lucide-react";
import { fetch_events } from "../../api/events_apis";

const CATEGORY_COLORS = {
    Tech: { bg: "bg-violet-100", text: "text-violet-700" },
    Design: { bg: "bg-pink-100", text: "text-pink-700" },
    Business: { bg: "bg-sky-100", text: "text-sky-700" },
    Culture: { bg: "bg-orange-100", text: "text-orange-700" },
    Sports: { bg: "bg-violet-100", text: "text-violet-700" },
    Others: { bg: "bg-slate-100", text: "text-slate-600" },
};

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; // Updated FILTERS to match categories more closely, and added 'All'
const FILTERS = ["All", "Tech", "Design", "Business", "Culture", "Sports", "Others"];

function formatTime(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Helper to format a date to YYYY-MM-DD string
const toYYYYMMDD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

export default function CalendarPage() {
    const { user_name, organization_name } = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    
    // Track clicked date separately. If null, we show all future/past agenda groups.
    const [clickedDate, setClickedDate] = useState(null); 

    const today = useMemo(() => { // Memoize today's date
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming fetch_events can take a category filter
                const params = {};
                if (activeFilter !== "All") {
                    params.category = activeFilter;
                }
                const fetchedEvents = await fetch_events(params);
                setEvents(fetchedEvents.results || fetchedEvents); // Adjust based on actual API response structure
            } catch (err) {
                console.error("Failed to fetch events:", err);
                setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, [activeFilter]); // Re-fetch when activeFilter changes

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate(); // Filter events by search query and active filter
    const displayEvents = useMemo(() => {
        let filtered = events;

        if (searchQuery) {
            filtered = filtered.filter(e => 
                e.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                e.organization_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.short_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // activeFilter is already applied in useEffect's fetch_events, so no need to filter here again.
        // If fetch_events doesn't support category filter, then this logic would be needed here.
        // For now, assuming API handles it.

        return filtered;
    }, [events, searchQuery]); // Removed activeFilter from here as it's a dependency for `events` now.

    const eventsOnDay = (y, m, d) => displayEvents.filter(e => e.event_date === toYYYYMMDD(new Date(y, m, d)));

    const isToday = (d) =>
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

    const isSelected = (d) =>
        clickedDate &&
        d.getDate() === clickedDate.getDate() &&
        d.getMonth() === clickedDate.getMonth() &&
        d.getFullYear() === clickedDate.getFullYear();

    // Build grid cells
    const cells = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const prevMonthDate = new Date(year, month - 1, prevMonthDays - i);
        cells.push({ day: prevMonthDays - i, outOfMonth: true, key: `prev-${i}`, fullDate: prevMonthDate });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const currentMonthDate = new Date(year, month, d);
        const dayEvents = eventsOnDay(year, month, d);
        cells.push({
            day: d,
            outOfMonth: false,
            key: `cur-${d}`,
            fullDate: currentMonthDate,
            eventCount: dayEvents.length,
        });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) { // Next month's days
        const nextMonthDate = new Date(year, month + 1, d);
        cells.push({ day: d, outOfMonth: true, key: `next-${d}`, fullDate: nextMonthDate });
    }

    // Grouping events for Agenda
    const groupedEvents = useMemo(() => {
        const groups = {};
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (7 - today.getDay())); // End of current week (Sunday)

        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of current month

        const sortEvents = (arr) => arr.sort((a, b) => {
            const dateA = new Date(`${a.event_date}T${a.start_time}`);
            const dateB = new Date(`${b.event_date}T${b.start_time}`);
            return dateA.getTime() - dateB.getTime();
        });

        if (clickedDate) {
            const clickedDateKey = toYYYYMMDD(clickedDate);
            const eventsForClickedDate = displayEvents.filter(e => e.event_date === clickedDateKey);
            if (eventsForClickedDate.length > 0) {
                groups[clickedDate.toDateString() === today.toDateString() ? "Today" : clickedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })] = sortEvents(eventsForClickedDate);
            }
        } else {
            const pastEvents = [];
            const todayEvents = [];
            const tomorrowEvents = [];
            const thisWeekEvents = [];
            const thisMonthEvents = [];
            const laterEvents = [];

            displayEvents.forEach(e => {
                const eDate = new Date(e.event_date);
                eDate.setHours(0,0,0,0); // Normalize to start of day for comparison

                if (eDate < today) {
                    pastEvents.push(e);
                } else if (eDate.getTime() === today.getTime()) {
                    todayEvents.push(e);
                } else if (eDate.getTime() === tomorrow.getTime()) {
                    tomorrowEvents.push(e);
                } else if (eDate <= weekEnd) {
                    thisWeekEvents.push(e);
                } else if (eDate <= monthEnd) {
                    thisMonthEvents.push(e);
                } else {
                    laterEvents.push(e);
                }
            });

            if (todayEvents.length > 0) groups["Today"] = sortEvents(todayEvents);
            if (tomorrowEvents.length > 0) groups["Tomorrow"] = sortEvents(tomorrowEvents);
            if (thisWeekEvents.length > 0) groups["This Week"] = sortEvents(thisWeekEvents);
            if (thisMonthEvents.length > 0) groups["This Month"] = sortEvents(thisMonthEvents);
            if (laterEvents.length > 0) groups["Later"] = sortEvents(laterEvents);
            if (pastEvents.length > 0) groups["Past"] = sortEvents(pastEvents).reverse(); // Past events in reverse chronological order
        }

        return groups;
    }, [displayEvents, clickedDate, today]);

    // Stats
    const stats = useMemo(() => {
        const upcoming = events.filter(e => new Date(e.event_date) >= today).length;
        const todayCount = events.filter(e => new Date(e.event_date).getTime() === today.getTime()).length;
        
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + (7 - today.getDay()));
        const weekCount = events.filter(e => {
            const d = new Date(e.event_date); // Normalize to start of day for comparison
            d.setHours(0,0,0,0);
            return d >= today && d <= weekEnd;
        }).length;

        const uniqueOrgs = new Set(events.filter(e => e.organization_name).map(e => e.organization_name)).size;
        return { upcoming, todayCount, weekCount, uniqueOrgs };
    }, [events, today]);


    return (
        <div className=" bg-[#F8FAFC] min-h-screen pb-24">
            
            {/* Hero Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-500">
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
                                <CalendarIcon size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none">{stats.upcoming}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Upcoming Events</p>
                            </div>
                        </div>
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                                <Zap size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none">{stats.todayCount}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Events Today</p>
                            </div>
                        </div>
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none">{stats.uniqueOrgs}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Organizations</p>
                            </div>
                        </div>
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 leading-none">{stats.weekCount}</p>
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">This Week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                    
                    {/* Search & Filters */}
                    <div className="mb-8 space-y-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-[15px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm"
                            />
                            <span className="sr-only">Search events</span>
                        </div>
                        
                        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
                            {FILTERS.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${activeFilter === f ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
    
                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
    
                        {/* ── Left: Calendar ── */}
                        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-[24px] border border-slate-200 shadow-sm p-5 md:p-6 lg:sticky lg:top-8">
    
                            {/* Month Nav */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                    {MONTH_NAMES[month]} {year}
                                </h2>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-all cursor-pointer active:scale-95"
                                    >
                                        <span className="sr-only">Previous month</span>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
                                            setClickedDate(null);
                                        }} 
                                        className="px-3 h-9 flex items-center justify-center text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer active:scale-95 mx-1"
                                    >
                                        <span className="sr-only">Go to today's month</span>
                                        Today
                                    </button>
                                    <button
                                        onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 transition-all cursor-pointer active:scale-95"
                                    >
                                        <span className="sr-only">Next month</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
    
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 mb-2">
                                {DAY_NAMES.map(d => (
                                    <div key={d} className="text-center text-[11px] font-bold text-slate-400 py-2">
                                        {d}
                                    </div>
                                ))}
                            </div>
    
                            {/* Grid */}
                            <div className="grid grid-cols-7 gap-y-2">
                                {loading
                                    ? Array.from({ length: 42 }).map((_, i) => (
                                        <div key={i} className="aspect-square m-1 rounded-xl animate-pulse bg-slate-100" />
                                    ))
                                    : cells.map((cell) => {
                                        if (cell.outOfMonth) {
                                            return (
                                                <div
                                                    key={cell.key}
                                                    className="aspect-square flex flex-col items-center justify-center opacity-30 pointer-events-none"
                                                >
                                                    <span className="text-sm font-semibold">{cell.day}</span>
                                                </div>
                                            );
                                        }
    
                                        const today_ = isToday(cell.fullDate);
                                        const selected_ = isSelected(cell.fullDate);
                                        
                                        // if clickedDate is null, we show a generic highlight if hovering, 
                                        // but if it's selected, it gets a strong highlight.
    
                                        return (
                                            <button
                                                key={cell.key}
                                                onClick={() => setClickedDate(selected_ ? null : cell.fullDate)} 
                                                className="relative aspect-square flex flex-col items-center justify-center transition-all duration-200 cursor-pointer group rounded-[16px] hover:bg-slate-50 p-1"
                                                aria-label={`View events on ${cell.fullDate.toLocaleDateString()}`}
                                            >
                                                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold z-10 transition-colors
                                                    ${selected_ ? "bg-violet-600 text-white shadow-md shadow-violet-500/30" 
                                                        : today_ ? "bg-slate-900 text-white shadow-md"
                                                        : "text-slate-700 group-hover:text-slate-900"}
                                                `}>
                                                    {cell.day}
                                                </div>
    
                                                {/* Event Badge */}
                                                {cell.eventCount > 0 && !selected_ && (
                                                    <div className="absolute bottom-1 w-[20px] h-[4px] rounded-full bg-violet-200 group-hover:bg-violet-400 transition-colors"></div>
                                                )}
                                            </button>
                                        );
                                    })
                                }
                            </div>
                            
                            <div className="mt-6 flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="text-[12px] font-bold text-slate-500">Legend</div>
                                 <div className="flex items-center gap-3">
                                     <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
                                         <div className="w-3 h-3 rounded-full bg-slate-900"></div> Today
                                     </div>
                                     <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
                                         <div className="w-3 h-3 rounded-full bg-violet-600"></div> Selected
                                     </div>
                                     <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700">
                                         <div className="w-[12px] h-[4px] rounded-full bg-violet-300"></div> Has Events
                                     </div>
                                 </div>
                            </div>
    
                        </div>
    
                        {/* ── Right: Agenda Panel ── */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-12">
    
                            {loading ? (
                                <div className="space-y-6">
                                    <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse"></div>
                                    {[1, 2, 3].map(n => (
                                        <div key={n} className="bg-white rounded-[20px] p-5 border border-slate-200 shadow-sm animate-pulse flex gap-4">
                                             <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0"></div>
                                             <div className="flex-1 space-y-3">
                                                 <div className="h-4 bg-slate-200 w-1/4 rounded"></div>
                                                 <div className="h-5 bg-slate-200 w-3/4 rounded"></div>
                                                 <div className="h-4 bg-slate-100 w-1/3 rounded"></div>
                                             </div>
                                        </div>
                                    ))}
                                </div>
                            ) : Object.values(groupedEvents).every(arr => arr.length === 0) ? (
                                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <LayoutGrid size={48} className="text-slate-300" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">No Events Scheduled</h2>
                                    <p className="text-slate-500 max-w-sm mb-8 text-[15px] font-medium leading-relaxed">
                                        There are no upcoming events for this period. Try clearing your search or browsing other dates.
                                    </p>
                                    <button 
                                        onClick={() => { setClickedDate(null); setSearchQuery(""); }}
                                        className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                    >
                                        Browse All Dates
                                    </button>
                                </div>
                            ) : (
                                Object.entries(groupedEvents).map(([groupName, groupEvents]) => {
                                    if (groupEvents.length === 0) return null;
                                    return (
                                        <div key={groupName} className="relative">
                                            <div className="flex items-center gap-3 mb-5">
                                                <h3 className="text-xl font-black text-slate-900 capitalize flex items-center gap-2">
                                                    {groupName === "Today" && <Zap className="text-amber-500 fill-amber-500" size={20} />}
                                                    {groupName}
                                                </h3>
                                                <div className="h-px bg-slate-200 flex-1"></div>
                                                <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">{groupEvents.length} Event{groupEvents.length !== 1 ? 's' : ''}</span>
                                            </div>
    
                                            <div className="space-y-4">
                                                {groupEvents.map(event => {
                                                    const cat = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Others;
                                                    return (
                                                        <div 
                                                            key={event.id}
                                                            onClick={() => {
                                                                const username = user_name || organization_name || localStorage.getItem("username");
                                                                const accountType = organization_name ? "organization" : (user_name ? "student" : localStorage.getItem("accountType"));
                                                                if (accountType === "organization") {
                                                                    navigate(`/organization/${username}/event/${event.id}`);
                                                                } else {
                                                                    navigate(`/user/${username}/event/${event.id}`);
                                                                }
                                                            }}
                                                            className="group bg-white p-5 rounded-[20px] border border-slate-200 hover:border-violet-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col sm:flex-row gap-5 relative overflow-hidden"
                                                            aria-label={`View details for ${event.title}`}
                                                        >
                                                            {/* Avatar / Logo (Placeholder icon) */}
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${cat.bg} text-opacity-80`}>
                                                                {event.organization_logo ? (
                                                                    <img src={event.organization_logo} alt={`${event.organization_name || event.organization_username} logo`} className="w-full h-full object-cover rounded-2xl" />
                                                                ) : (
                                                                    <CalendarIcon size={24} className={cat.text} />
                                                                )}
                                                            </div>
    
                                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-current ${cat.text} bg-white bg-opacity-50`}>
                                                                        {event.category}
                                                                    </span>
                                                                    <span className="text-[12px] font-bold text-slate-500 flex items-center gap-1">
                                                                        <Clock size={12} /> {formatTime(event.start_time)}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-[16px] font-black text-slate-900 group-hover:text-violet-700 transition-colors truncate mb-1">
                                                                    {event.title}
                                                                </h4>
                                                                <p className="text-[13px] font-medium text-slate-500 truncate flex items-center gap-1.5 mb-3">
                                                                    <Building2 size={14} className="text-slate-400" />
                                                                    {event.organization_name || `@${event.organization_username}`}
                                                                </p>
                                                                
                                                                <div className="flex items-center gap-4 mt-auto text-[12px] font-semibold text-slate-600">
                                                                    {event.location && !(event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual")) ? (
                                                                        <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400"/> {event.location}</span>
                                                                    ) : (
                                                                        <span className="flex items-center gap-1"><MapPin size={14} className="text-emerald-500"/> Online</span>
                                                                    )}
                                                                    
                                                                    <span className="flex items-center gap-1 ml-auto group-hover:text-violet-600 transition-colors">
                                                                        View Details <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
    
                        </div>
                    </div>
                </div>
        </div>
    );
}

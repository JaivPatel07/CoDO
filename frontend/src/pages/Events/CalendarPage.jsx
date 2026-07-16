import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Info } from "lucide-react";
import { fetch_events } from "../../api/events_apis";

const CATEGORY_COLORS = {
    Tech:     { bg: "bg-violet-100",  text: "text-violet-700" },
    Design:   { bg: "bg-pink-100",    text: "text-pink-700" },
    Business: { bg: "bg-sky-100",     text: "text-sky-700" },
    Culture:  { bg: "bg-orange-100",  text: "text-orange-700" },
    Sports:   { bg: "bg-emerald-100", text: "text-emerald-700" },
    Others:   { bg: "bg-slate-100",   text: "text-slate-600" },
};

const CATEGORY_ACCENT = {
    Tech:     "from-violet-500 to-purple-600",
    Design:   "from-pink-500 to-rose-500",
    Business: "from-sky-500 to-blue-600",
    Culture:  "from-orange-400 to-red-500",
    Sports:   "from-emerald-400 to-green-600",
    Others:   "from-slate-400 to-slate-600",
};

const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
];
const DAY_NAMES = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

function formatTime(timeStr) {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2,"0")} ${ampm}`;
}

function formatSelectedDate(date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Returns true if event registration is still open as of today
function isRegistrationOpen(event) {
    if (!event.registration_deadline) return false;
    const todayStr = new Date().toISOString().split("T")[0];
    return event.registration_deadline >= todayStr;
}

export default function CalendarPage() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDate, setSelectedDate] = useState(today);

    useEffect(() => {
        fetch_events().then(setEvents).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const formatKey = (y, m, d) =>
        `${y}-${String(m + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

    // Events happening on this day
    const eventsOnDay = (y, m, d) => events.filter(e => e.event_date === formatKey(y, m, d));
    // Events whose registration deadline is this day
    const regDeadlineOnDay = (y, m, d) => events.filter(e => e.registration_deadline === formatKey(y, m, d));

    const selectedKey = formatKey(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const selectedEvents = events.filter(e => e.event_date === selectedKey);
    const selectedRegOpen = selectedEvents.filter(isRegistrationOpen);

    const isToday = (d) =>
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

    const isSelected = (d) =>
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getFullYear() === selectedDate.getFullYear();

    // Build grid cells
    const cells = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        cells.push({ day: prevMonthDays - i, outOfMonth: true, key: `prev-${i}` });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEvents = eventsOnDay(year, month, d);
        const deadlineEvents = regDeadlineOnDay(year, month, d);
        cells.push({
            day: d,
            outOfMonth: false,
            key: `cur-${d}`,
            fullDate: new Date(year, month, d),
            hasEvent: dayEvents.length > 0,
            hasDeadline: deadlineEvents.length > 0,
            eventCount: dayEvents.length,
            deadlineCount: deadlineEvents.length,
        });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
        cells.push({ day: d, outOfMonth: true, key: `next-${d}` });
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* ── Left: Calendar ── */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

                    {/* Month Nav */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-extrabold text-slate-900">
                            {MONTH_NAMES[month]} {year}
                        </h2>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
                                    setSelectedDate(today);
                                }}
                                className="px-3 py-1.5 text-[11px] font-bold text-violet-600 hover:bg-violet-50 rounded-xl transition cursor-pointer"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAY_NAMES.map(d => (
                            <div key={d} className="text-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 py-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 border-t border-l border-slate-100">
                        {loading
                            ? Array.from({ length: 42 }).map((_, i) => (
                                <div key={i} className="border-b border-r border-slate-100 h-16 animate-pulse bg-slate-50/60" />
                            ))
                            : cells.map((cell) => {
                                if (cell.outOfMonth) {
                                    return (
                                        <div
                                            key={cell.key}
                                            className="border-b border-r border-slate-100 h-16 sm:h-20 flex items-start justify-center pt-2"
                                        >
                                            <span className="text-sm text-slate-300 font-medium">{cell.day}</span>
                                        </div>
                                    );
                                }

                                const today_ = isToday(cell.fullDate);
                                const selected_ = isSelected(cell.fullDate);

                                return (
                                    <button
                                        key={cell.key}
                                        onClick={() => setSelectedDate(cell.fullDate)}
                                        className="border-b border-r border-slate-100 h-16 sm:h-20 flex flex-col items-center pt-2 pb-2 gap-0.5 relative transition-all cursor-pointer group"
                                    >
                                        {/* Day Number */}
                                        <span
                                            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all
                                                ${selected_
                                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                                                    : today_
                                                    ? "border-2 border-violet-500 text-violet-700 font-extrabold"
                                                    : "text-slate-700 group-hover:bg-slate-100"
                                                }`}
                                        >
                                            {cell.day}
                                        </span>

                                        {/* Sub-label */}
                                        {selected_ && (
                                            <span className="text-[8px] font-black uppercase tracking-widest text-violet-500 leading-none">
                                                Selected
                                            </span>
                                        )}
                                        {today_ && !selected_ && (
                                            <span className="text-[8px] font-black uppercase tracking-widest text-violet-400 leading-none">
                                                Today
                                            </span>
                                        )}

                                        {/* Dots row: event dot (violet) + deadline dot (amber) */}
                                        {(cell.hasEvent || cell.hasDeadline) && (
                                            <div className="flex items-center gap-1 mt-auto mb-0.5">
                                                {cell.hasEvent && (
                                                    <span
                                                        title={`${cell.eventCount} event${cell.eventCount > 1 ? "s" : ""}`}
                                                        className={`w-2 h-2 rounded-full flex-shrink-0 transition-opacity
                                                            ${selected_ ? "bg-white/80" : "bg-violet-600 shadow-sm shadow-violet-300"}`}
                                                    />
                                                )}
                                                {cell.hasDeadline && (
                                                    <span
                                                        title={`${cell.deadlineCount} registration deadline${cell.deadlineCount > 1 ? "s" : ""}`}
                                                        className={`w-2 h-2 rounded-full flex-shrink-0 transition-opacity
                                                            ${selected_ ? "bg-amber-200" : "bg-amber-400 shadow-sm shadow-amber-200"}`}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        }
                    </div>
                </div>

                {/* ── Right: Events Panel ── */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

                    {/* Panel header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                            Events for{" "}
                            <span className="text-violet-700">{formatSelectedDate(selectedDate)}</span>
                        </h3>
                    </div>

                    {/* Stats row */}
                    {selectedEvents.length > 0 && (
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {/* Total events badge */}
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-700 px-3 py-1.5 rounded-xl">
                                <span className="w-2 h-2 rounded-full bg-violet-600" />
                                {selectedEvents.length} Event{selectedEvents.length > 1 ? "s" : ""}
                            </span>

                            {/* Registration open badge */}
                            {selectedRegOpen.length > 0 && (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-xl">
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                    {selectedRegOpen.length} Reg. Open
                                </span>
                            )}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-slate-100 mb-4" />

                    {loading ? (
                        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1 -mr-1 animate-pulse">
                            {[1, 2].map((n) => (
                                <div key={n} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white">
                                    <div className="w-1 bg-slate-200 rounded-full" />
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="flex justify-between items-center">
                                            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                            <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                                        </div>
                                        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : selectedEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                                <Info size={24} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-600">No events this day</p>
                            <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                                No official events are scheduled for this date.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1 -mr-1">
                            {selectedEvents.map((event) => {
                                const cat = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Others;
                                const accent = CATEGORY_ACCENT[event.category] || CATEGORY_ACCENT.Others;
                                const regOpen = isRegistrationOpen(event);
                                return (
                                    <div
                                        key={event.id}
                                        onClick={() => navigate(`/events/${event.id}`)}
                                        className="relative flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group bg-white overflow-hidden"
                                    >
                                        {/* Left gradient accent bar */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${accent}`} />

                                        <div className="flex-1 min-w-0 pl-2">
                                            {/* Category + Time */}
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${cat.bg} ${cat.text}`}>
                                                        {event.category}
                                                    </span>
                                                    {/* Registration open pill */}
                                                    {regOpen && (
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                                            Reg. Open
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-400 tabular-nums flex-shrink-0">
                                                    {formatTime(event.start_time)}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-violet-700 transition-colors leading-snug line-clamp-1 mb-1">
                                                {event.title}
                                            </h4>

                                            {/* Organizer */}
                                            <p className="text-xs text-slate-500 font-medium mb-2 line-clamp-1">
                                                {event.organization_name
                                                    ? `Organized by ${event.organization_name}`
                                                    : `@${event.organization_username}`}
                                            </p>

                                            {/* Location */}
                                            {event.location && (
                                                <p className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-3">
                                                    <MapPin size={11} className="flex-shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </p>
                                            )}

                                            {/* Registration deadline */}
                                            {event.registration_deadline && (
                                                <p className="text-[10px] text-amber-600 font-semibold mb-3">
                                                    🗓 Reg. deadline: {event.registration_deadline}
                                                </p>
                                            )}

                                            {/* Details link */}
                                            <div className="flex items-center justify-end">
                                                <span className="text-[11px] font-extrabold text-violet-600 group-hover:text-violet-800 flex items-center gap-1 transition-colors">
                                                    Details <ArrowRight size={11} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

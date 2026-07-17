import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Calendar, MapPin, Building2, Tag, ArrowRight, Filter, AlertCircle } from "lucide-react";
import { fetch_events } from "../../api/events_apis";
import calculate_post_time from "../../reusable_methods/time_calculator";

const CATEGORIES = ["All", "Tech", "Design", "Business", "Culture", "Sports", "Others"];

const CATEGORY_BANNER = {
    Tech: { from: "#6366f1", to: "#8b5cf6", icon: "⚡" },
    Design: { from: "#ec4899", to: "#f43f5e", icon: "🎨" },
    Business: { from: "#0ea5e9", to: "#2563eb", icon: "📊" },
    Culture: { from: "#f97316", to: "#ef4444", icon: "🎭" },
    Sports: { from: "#10b981", to: "#059669", icon: "🏆" },
    Others: { from: "#64748b", to: "#334155", icon: "📌" },
};

const CATEGORY_ACCENT = {
    Tech:     "from-violet-500 to-purple-600",
    Design:   "from-pink-500 to-rose-500",
    Business: "from-sky-500 to-blue-600",
    Culture:  "from-orange-400 to-red-500",
    Sports:   "from-emerald-400 to-green-600",
    Others:   "from-slate-400 to-slate-600",
};

function EventBannerPlaceholder({ category, title }) {
    const theme = CATEGORY_BANNER[category] || CATEGORY_BANNER.Others;
    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-8 -left-4 w-36 h-36 rounded-full bg-white/10"></div>
            <div className="absolute top-1/2 left-0 w-16 h-16 rounded-full bg-white/5"></div>
            {/* Content */}
            <span className="text-4xl mb-2 drop-shadow-lg">{theme.icon}</span>
            <p className="text-white/80 text-xs font-black uppercase tracking-widest">{category}</p>
            <p className="text-white font-bold text-sm mt-1 px-6 text-center line-clamp-2 max-w-[85%] drop-shadow-sm">{title}</p>
        </div>
    );
}

export default function EventsPage() {


    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDate, setSelectedDate] = useState(""); // YYYY-MM-DD
    
    const loadEvents = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm.trim()) params.search = searchTerm;
            if (selectedCategory !== "All") params.category = selectedCategory;
            if (selectedDate) params.date = selectedDate;

            const data = await fetch_events(params);
            setEvents(data);
            setError(null);
        } catch (err) {
            setError(err.error || "Failed to load events.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            loadEvents();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedCategory, selectedDate]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter and Search Panel */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 transition-all hover:shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Search Input */}
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, tags, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 outline-none text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 bg-slate-50/50 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Date Picker */}
                    <div className="md:col-span-3 relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 outline-none text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 bg-slate-50/50 focus:bg-white transition-all text-slate-700"
                        />
                    </div>

                    {/* Clear Filters */}
                    <div className="md:col-span-3 flex justify-end">
                        {(searchTerm || selectedCategory !== "All" || selectedDate) && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("All");
                                    setSelectedDate("");
                                }}
                                className="w-full md:w-auto text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-5 py-3 rounded-2xl transition-all cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Badges + Registration Open Toggle */}
                <div className="mt-6 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                        <Filter size={12} /> Categories:
                    </span>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                selectedCategory === cat
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/10"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-700 flex items-center gap-3 mb-8">
                    <AlertCircle className="flex-shrink-0" />
                    <div>
                        <p className="font-bold">Error loading events</p>
                        <p className="text-xs">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading Grid */}
            {/* skeleton rendered */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse">
                            <div className="h-44 bg-slate-100 rounded-2xl"></div>
                            <div className="h-6 bg-slate-100 rounded-lg w-3/4"></div>
                            <div className="h-4 bg-slate-100 rounded-lg w-1/2"></div>
                            <div className="h-10 bg-slate-100 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <Calendar className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No events found</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                        We couldn't find any events matching your current search criteria. Try removing some filters.
                    </p>
                </div>
            ) : (
                /* Events Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        (() => {
                            const accent = CATEGORY_ACCENT[event.category] || CATEGORY_ACCENT.Others;
                            return (
                                <div
                                    key={event.id}
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1"
                                >
                                    {/* Banner Image */}
                                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                                        {event.banner_image ? (
                                            <img
                                                src={event.banner_image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <EventBannerPlaceholder category={event.category} title={event.title} />
                                        )}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`} />
                                    </div>

                                    {/* Event Details */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-3">
                                            {event.organization_logo ? (
                                                <img
                                                    src={event.organization_logo}
                                                    alt={event.organization_name}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                />
                                            ) : (
                                                <Building2 size={14} className="text-slate-400" />
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <span className="font-bold text-slate-600 group-hover:text-slate-800">
                                                    {event.organization_username}
                                                </span>
                                                <span className="text-slate-400 font-medium">·</span>
                                                <span className="text-slate-400 font-medium">{calculate_post_time(event.created_at)}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 mb-2 leading-snug">
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                            {event.short_description}
                                        </p>

                                        <div className="space-y-2 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                                                <Calendar size={14} className="text-slate-400" />
                                                <span>
                                                    {event.event_date}{event.end_date && event.end_date !== event.event_date ? ` to ${event.end_date}` : ""} • {event.start_time.substring(0, 5)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                                                <MapPin size={14} className="text-slate-400" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Row */}
                                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                        <div className="flex flex-wrap gap-1">
                                            {event.tags && event.tags.split(",").slice(0, 2).map((tag) => (
                                                <span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-[10px] font-semibold text-slate-600 px-2 py-1 rounded">
                                                    <Tag size={9} /> {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <ArrowRight size={16} className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                    </div>
                                </div>
                            );
                        })()
                    ))}
                </div>
            )}
        </div>
    );
}

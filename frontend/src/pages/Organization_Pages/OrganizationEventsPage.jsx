import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, MapPin, Edit, Trash2, Tag, AlertCircle } from "lucide-react";
import { fetch_events, delete_event } from "../../api/events_apis";
import { UserContext } from "../../contextAPI/userContext";

const CATEGORY_BANNER = {
    Tech: { from: "#6366f1", to: "#8b5cf6", icon: "⚡" },
    Design: { from: "#ec4899", to: "#f43f5e", icon: "🎨" },
    Business: { from: "#0ea5e9", to: "#2563eb", icon: "📊" },
    Culture: { from: "#f97316", to: "#ef4444", icon: "🎭" },
    Sports: { from: "#10b981", to: "#059669", icon: "🏆" },
    Others: { from: "#64748b", to: "#334155", icon: "📌" },
};


export default function OrganizationEventsPage() {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMyEvents = async () => {
        if (!userData?.username) return;
        try {
            setLoading(true);
            const data = await fetch_events({ org: userData.username });
            setEvents(data);
            setError(null);
        } catch (err) {
            setError(err.error || "Failed to load events.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMyEvents();
    }, [userData]);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
        try {
            await delete_event(id);
            alert("Event deleted successfully.");
            setEvents(events.filter(event => event.id !== id));
        } catch (err) {
            alert(err.error || "Failed to delete event.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Review, update, publish, or remove official events created by your organization.
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/organization/${userData.username}/events`)}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md cursor-pointer self-start sm:self-auto"
                >
                    <Plus size={16} /> Create Event
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-5 text-red-700 flex items-center gap-3 mb-6">
                    <AlertCircle className="flex-shrink-0" />
                    <div>
                        <p className="font-bold">Error loading events</p>
                        <p className="text-xs">{error}</p>
                    </div>
                </div>
            )}

            {/* Content List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((n) => (
                        <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse h-48"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <Calendar className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No events published yet</h3>
                    <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto mb-6">
                        You have not published any official events yet. Get started by creating your first event.
                    </p>
                    <Link to="/create/event">
                    <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition">
                        <Plus size={14} /> Create Your First Event
                    </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => navigate(`/organization/${userData.username}/events/${event.id}`)}
                            className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
                        >
                            {/* Mini banner strip */}
                            {(() => {
                                const theme = CATEGORY_BANNER[event.category] || CATEGORY_BANNER.Others;
                                return (
                                    <div
                                        className="h-12 w-full flex items-center px-5 gap-3 relative overflow-hidden"
                                        style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
                                    >
                                        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/10"></div>
                                        {event.banner_image ? (
                                            <img src={event.banner_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                                        ) : null}
                                        <span className="text-lg z-10">{theme.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 z-10">{event.category}</span>
                                    </div>
                                );
                            })()}
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div>
                                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                            {event.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mt-2 line-clamp-1">
                                            {event.title}
                                        </h3>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/organization/events/edit/${event.id}`);
                                            }}
                                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition cursor-pointer"
                                            title="Edit Event"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(event.id, e)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-red-650 hover:bg-slate-50 transition cursor-pointer"
                                            title="Delete Event"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                                    {event.short_description}
                                </p>

                                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        <span>{event.event_date} • {event.start_time.substring(0, 5)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-slate-400" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

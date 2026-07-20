import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, MapPin, Edit, Trash2, Tag, AlertCircle, Compass } from "lucide-react";
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-5 border-b border-slate-200/60">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Review, update, publish, or remove official events created by your organization.
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm hover:shadow-md cursor-pointer self-start sm:self-auto active:scale-95"
                >
                    <Plus size={15} /> Create Event
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 flex items-center gap-3 mb-6">
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
                        <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse h-48"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-2xl mx-auto">
                    <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">No events published yet</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto mb-6 leading-relaxed">
                        You have not published any official events yet. Get started by creating your first event to reach students.
                    </p>
                    <button
                        onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                        <Plus size={14} /> Create Your First Event
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => navigate(`/organization/${userData.username}/event/${event.id}`)}
                            className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-350 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
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
                                            <img src={event.banner_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                                        ) : null}
                                        <span className="text-base z-10">{theme.icon}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/90 z-10">{event.category}</span>
                                    </div>
                                );
                            })()}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-violet-650 transition-colors leading-snug line-clamp-1">
                                            {event.title}
                                        </h3>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/organization/${userData.username}/events/edit/${event.id}`);
                                                }}
                                                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                                                title="Edit Event"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(event.id, e)}
                                                className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition cursor-pointer"
                                                title="Delete Event"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                                        {event.short_description}
                                    </p>
                                </div>

                                <div className="space-y-1.5 border-t border-slate-100 pt-3.5 text-xs text-slate-500 font-semibold">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={13} className="text-slate-400" />
                                        <span>
                                            {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={13} className="text-slate-400" />
                                        <span className="truncate">
                                            {event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual") ? "Online Meeting" : event.location}
                                        </span>
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

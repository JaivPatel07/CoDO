import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Calendar, MapPin, Edit, Trash2, Tag, AlertCircle, Compass, ExternalLink, ChevronLeft, ChevronRight, MoreVertical, Eye, Copy, Share2, FilePlus2 } from "lucide-react";
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
    const [openMenuId, setOpenMenuId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenuId && !event.target.closest('.actions-menu-container')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

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

    const handleDuplicate = (event, e) => {
        e.stopPropagation();
        const { id, organization, organization_username, organization_name, organization_logo, created_at, updated_at, registration_link_clicks, ...duplicateData } = event;
        navigate(`/organization/${userData.username}/create/event`, { state: { duplicateEvent: duplicateData } });
        setOpenMenuId(null);
    };

    const handleCopyLink = (eventId, e) => {
        e.stopPropagation();
        const link = `${window.location.origin}/organization/${userData.username}/event/${eventId}`;
        navigator.clipboard.writeText(link).then(() => {
            alert("Event link copied to clipboard!");
            setOpenMenuId(null);
        }).catch(() => {
            alert("Failed to copy link.");
        });
    };

    const handleShare = async (event, e) => {
        e.stopPropagation();
        const shareData = {
            title: event.title,
            text: event.short_description,
            url: `${window.location.origin}/organization/${userData.username}/event/${event.id}`,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                handleCopyLink(event.id, e); // Fallback to copy link
            }
        } catch (err) { console.error("Error sharing:", err); }
        setOpenMenuId(null);
    };
    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / eventsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
            {/* Header section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold mb-3">
                        <Compass size={13} /> Event Management
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Organization Events</h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl font-medium">
                        Create, manage, update or publish events hosted by your organization for student talent.
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-sm cursor-pointer self-start sm:self-auto active:scale-95"
                >
                    <Plus size={16} /> Create Event
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 animate-pulse h-56"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm max-w-xl mx-auto">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-100">
                        <Calendar size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No events published yet</h3>
                    <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto mb-6 leading-relaxed font-medium">
                        You haven't published any official events yet. Create your first event to reach students.
                    </p>
                    <button
                        onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all cursor-pointer active:scale-95 shadow-md"
                    >
                        <Plus size={15} /> Create Your First Event
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentEvents.map((event) => (
                        <div
                            key={event.id}
                            onClick={() => navigate(`/organization/${userData.username}/event/${event.id}`)}
                            className="bg-white rounded-3xl border border-slate-200/70 hover:border-violet-300 shadow-sm hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
                        >
                            {/* Header Banner */}
                            {(() => {
                                const theme = CATEGORY_BANNER[event.category] || CATEGORY_BANNER.Others;
                                return (
                                    <div
                                        className="h-14 w-full flex items-center justify-between px-5 bg-slate-900 relative overflow-hidden"
                                        style={{ background: `linear-gradient(110deg, ${theme.from} 30%, ${theme.to} 100%)` }}
                                    >
                                        {event.banner_image ? (
                                            <img src={event.banner_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                                        ) : null}
                                        <div className="flex items-center gap-2 z-10">
                                            <span className="text-base">{theme.icon}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{event.category}</span>
                                        </div>

                                    </div>
                                );
                            })()}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-violet-700 transition-colors leading-snug line-clamp-2 mb-2">
                                        {event.title}
                                    </h3>

                                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-5 font-medium">
                                        {event.short_description}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    {/* Stats & Actions */}
                                    <div className="flex justify-between items-center gap-2 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 rounded-lg px-2 py-1">
                                                <ExternalLink size={12} />
                                                <span>{event.registration_link_clicks || 0}</span>
                                            </div>
                                        </div>
                                        <div className="relative actions-menu-container">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === event.id ? null : event.id); }}
                                                className="w-8 h-8 rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition cursor-pointer"
                                                title="More Actions"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {openMenuId === event.id && (
                                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-lg border border-slate-100 z-20 p-2 animate-in fade-in zoom-in-95 duration-150">
                                                    <div className="flex flex-col gap-1">
                                                        {[
                                                            { label: "View", icon: Eye, action: (e) => { e.stopPropagation(); navigate(`/organization/${userData.username}/event/${event.id}`); } },
                                                            { label: "Edit", icon: Edit, action: (e) => { e.stopPropagation(); navigate(`/organization/${userData.username}/events/edit/${event.id}`); } },
                                                            { label: "Duplicate", icon: FilePlus2, action: (e) => handleDuplicate(event, e) },
                                                            { label: "Share", icon: Share2, action: (e) => handleShare(event, e) },
                                                            { label: "Copy Link", icon: Copy, action: (e) => handleCopyLink(event.id, e) },
                                                        ].map(item => (
                                                            <button key={item.label} onClick={item.action} className="flex items-center gap-3 w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                                                <item.icon size={14} className="text-slate-500" />
                                                                <span>{item.label}</span>
                                                            </button>
                                                        ))}
                                                        <div className="h-px bg-slate-100 my-1"></div>
                                                        <button onClick={(e) => handleDelete(event.id, e)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                                            <Trash2 size={14} />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2 text-xs text-slate-600 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-violet-500 shrink-0" />
                                            <span className="truncate">
                                                {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-indigo-500 shrink-0" />
                                            <span className="truncate">
                                                {event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual") ? "Virtual Meeting" : event.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-10 flex justify-center items-center gap-4">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                                Previous
                            </button>

                            <span className="text-sm font-bold text-slate-500">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

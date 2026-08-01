import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const CATEGORY_ACCENT = {
    Tech:     "from-violet-500 to-purple-600",
    Design:   "from-pink-500 to-rose-500",
    Business: "from-sky-500 to-blue-600",
    Culture:  "from-orange-400 to-red-500",
    Sports:   "from-violet-400 to-indigo-600",
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

export default function OrganizationEventsPage() {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

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
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const { id, organization, organization_username, organization_name, organization_logo, created_at, updated_at, registration_link_clicks, ...duplicateData } = event;
        navigate(`/organization/${userData.username}/create/event`, { state: { duplicateEvent: duplicateData } });
        setOpenMenuId(null);
    };

    const handleCopyLink = (eventId, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const link = `${window.location.origin}/organization/${userData.username}/event/${eventId}`;
        navigator.clipboard.writeText(link).then(() => {
            alert("Event link copied to clipboard!");
            setOpenMenuId(null);
        }).catch((err) => {
            console.error("Failed to copy link:", err);
            alert("Failed to copy link.");
        });
    };

    const handleShare = async (event, e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const shareData = {
            title: event.title,
            text: event.short_description,
            url: `${window.location.origin}/organization/${userData.username}/event/${event.id}`,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
                handleCopyLink(event.id, e); // Fallback to copy link
            }
        } else {
            handleCopyLink(event.id, e); // Fallback to copy link
        }
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold mb-3">
                        <Compass size={13} /> Event Management
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Organization Events</h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl leading-relaxed">
                        Share upcoming events, announce opportunities, and help students discover what's happening across your organization.
                    </p>
                </div>
                <button
                    onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                    className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto active:scale-95"
                >
                    <Plus size={16} /> Publish Event
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
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200/70 h-[380px] animate-pulse"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-6 border border-slate-100 shadow-sm">
                        <Calendar size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Events Published Yet</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto mb-8 leading-relaxed">
                        You haven't shared any events yet. Publish your first event to reach students.
                    </p>
                    <button
                        onClick={() => navigate(`/organization/${userData.username}/create/event`)}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all cursor-pointer active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus size={15} /> Publish Your First Event
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => navigate(`/organization/${userData.username}/event/${event.id}`)} 
                                className="bg-white rounded-3xl border border-slate-200/70 hover:border-violet-300 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group hover:scale-[1.02]"
                            >
                                {/* Header Banner */}
                                {(() => {
                                    const accent = CATEGORY_ACCENT[event.category] || CATEGORY_ACCENT.Others;
                                    return (
                                        <div className="relative h-40 bg-slate-100 overflow-hidden">
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
                                            {/* Glassmorphism Category Tag */}
                                            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                                                {event.category}
                                            </div>
                                            {/* Online/Offline badge */}
                                            <div className={`absolute top-3 right-3 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                                (event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual"))
                                                    ? "bg-indigo-600/95"
                                                    : "bg-indigo-650/95"
                                            }`}>
                                                {(event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual")) ? "Online" : "In-Person"}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-violet-700 transition-colors leading-snug line-clamp-2 mb-2">
                                            {event.title}
                                        </h3>

                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
                                            {event.short_description}
                                        </p>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="space-y-2 border-t border-slate-100 pt-4 pb-4 text-xs text-slate-600 font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={13} className="text-violet-500 shrink-0" />
                                                <span className="truncate">
                                                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            {!(event.location?.toLowerCase().includes("online") || event.location?.toLowerCase().includes("virtual")) && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={13} className="text-indigo-500 shrink-0" />
                                                    <span className="truncate">
                                                        {event.location}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats & Actions */}
                                        <div className="flex justify-between items-center gap-2 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex items-center gap-1 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1" title="Registration Link Clicks">
                                                    <ExternalLink size={10} />
                                                    <span>{event.registration_link_clicks || 0} Clicks</span>
                                                </div>
                                            </div>
                                            <div className="relative" ref={menuRef}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === event.id ? null : event.id); }}
                                                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                                                    title="More Actions"
                                                >
                                                    <MoreVertical size={14} />
                                                </button>
                                                {openMenuId === event.id && (
                                                    <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                                                        <div className="flex flex-col gap-0.5">
                                                            {[
                                                                { label: "View", icon: Eye, action: (e) => { e.stopPropagation(); navigate(`/organization/${userData.username}/event/${event.id}`); } },
                                                                { label: "Edit", icon: Edit, action: (e) => { e.stopPropagation(); navigate(`/organization/${userData.username}/events/edit/${event.id}`); } },
                                                                { label: "Duplicate", icon: FilePlus2, action: (e) => handleDuplicate(event, e) },
                                                                { label: "Copy Link", icon: Copy, action: (e) => handleCopyLink(event.id, e) },
                                                                { label: "Share", icon: Share2, action: (e) => handleShare(event, e) },
                                                            ].map(item => (
                                                                <button key={item.label} onClick={item.action} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all hover:translate-x-1">
                                                                    <item.icon size={14} className="text-slate-400" />
                                                                    <span>{item.label}</span>
                                                                </button>
                                                            ))}
                                                            <div className="h-px bg-slate-100 my-1"></div>
                                                            <button onClick={(e) => handleDelete(event.id, e)} className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all hover:translate-x-1">
                                                                <Trash2 size={14} className="text-red-500" />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
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
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:scale-95"
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
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:scale-95"
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

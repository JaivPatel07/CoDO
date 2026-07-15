import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Calendar, MapPin, Building2, Tag, ArrowLeft, ExternalLink,
    Clock, AlertCircle, Edit, Trash2, Globe
} from "lucide-react";
import { fetch_event_details, delete_event } from "../../api/events_apis";
import { UserContext } from "../../contextAPI/userContext";

const CATEGORY_BANNER = {
    Tech: { from: "#6366f1", to: "#8b5cf6", icon: "⚡" },
    Design: { from: "#ec4899", to: "#f43f5e", icon: "🎨" },
    Business: { from: "#0ea5e9", to: "#2563eb", icon: "📊" },
    Culture: { from: "#f97316", to: "#ef4444", icon: "🎭" },
    Sports: { from: "#10b981", to: "#059669", icon: "🏆" },
    Others: { from: "#64748b", to: "#334155", icon: "📌" },
};

function EventBannerPlaceholder({ category, title }) {
    const theme = CATEGORY_BANNER[category] || CATEGORY_BANNER.Others;
    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none"
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-12 -left-8 w-56 h-56 rounded-full bg-white/10"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white/5"></div>
            <span className="text-6xl mb-4 drop-shadow-xl">{theme.icon}</span>
            <p className="text-white/80 text-xs font-black uppercase tracking-widest mb-2">{category} Event</p>
            <p className="text-white font-bold text-xl sm:text-2xl px-8 text-center max-w-2xl drop-shadow-md leading-snug">{title}</p>
        </div>
    );
}

export default function EventDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const loadEventDetails = async () => {
            try {
                setLoading(true);
                const data = await fetch_event_details(id);
                setEvent(data);
                setError(null);
            } catch (err) {
                setError(err.error || "Event not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        loadEventDetails();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            setDeleting(true);
            await delete_event(id);
            alert("Event deleted successfully.");
            navigate("/events");
        } catch (err) {
            alert(err.error || "Failed to delete event.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-red-700 flex items-center gap-3">
                    <AlertCircle className="flex-shrink-0" />
                    <div>
                        <p className="font-bold">Error loading event details</p>
                        <p className="text-sm">{error || "Event details are unavailable."}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/events")}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back to Events
                </button>
            </div>
        );
    }

    const isOwner = userData?.username === event.organization_username;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
                <ArrowLeft size={14} /> Back
            </button>

            {/* Banner Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                <div className="relative h-64 sm:h-96 bg-slate-100">
                    {event.banner_image ? (
                        <img
                            src={event.banner_image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <EventBannerPlaceholder category={event.category} title={event.title} />
                    )}
                    <span className="absolute top-6 right-6 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl text-xs font-black text-violet-700 shadow-md uppercase tracking-wider">
                        {event.category}
                    </span>
                </div>

                {/* Event Core Meta */}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{event.title}</h1>
                            <p className="text-slate-500 text-sm">{event.short_description}</p>
                        </div>

                        {/* Owner Control Actions */}
                        {isOwner && (
                            <div className="flex items-center gap-2 sm:self-start">
                                <button
                                    onClick={() => navigate(`/organization/events/edit/${event.id}`)}
                                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    disabled={deleting}
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                                >
                                    <Trash2 size={14} /> {deleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Detailed Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        {/* Event Date and Times */}
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Date & Timing</h3>
                            <div className="flex items-start gap-3">
                                <Calendar className="text-violet-600 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-slate-800">{event.end_date && event.end_date !== event.event_date ? "Duration" : "Date"}</p>
                                    <p className="text-slate-600 mt-0.5">
                                        {event.event_date} {event.end_date && event.end_date !== event.event_date ? ` to ${event.end_date}` : ""}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="text-violet-600 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-slate-800">Time</p>
                                    <p className="text-slate-600 mt-0.5">
                                        {event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}
                                    </p>
                                </div>
                            </div>
                            {event.registration_deadline && (
                                <div className="flex items-start gap-3 border-t border-slate-150 pt-3">
                                    <Calendar className="text-red-500 mt-0.5" size={18} />
                                    <div>
                                        <p className="font-bold text-slate-800">Registration Deadline</p>
                                        <p className="text-red-600 text-xs mt-0.5 font-bold">{event.registration_deadline}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location Details */}
                        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</h3>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-violet-600 mt-0.5" size={18} />
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-slate-800">Venue</p>
                                    <p className="text-slate-600 mt-0.5 break-words">{event.location}</p>
                                </div>
                            </div>

                            {event.online_meeting_link && (
                                <div className="flex items-start gap-3">
                                    <Globe className="text-violet-600 mt-0.5" size={18} />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-800">Online Link</p>
                                        <a
                                            href={event.online_meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-violet-600 hover:text-violet-700 font-semibold mt-0.5 inline-flex items-center gap-1 text-xs break-all"
                                        >
                                            Join Meeting <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Organizer Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Detailed Description */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Event Details</h2>
                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{event.detailed_description}</p>
                    </div>

                    {/* Custom Timeline Dates */}
                    {event.custom_dates && Object.keys(event.custom_dates).length > 0 && (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Timeline & Milestones</h2>
                            <div className="space-y-3">
                                {Object.entries(event.custom_dates).map(([label, date]) => (
                                    <div key={label} className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60">
                                        <span className="text-sm font-bold text-slate-700">{label}</span>
                                        <span className="text-xs font-semibold text-violet-650 bg-violet-50 px-3.5 py-1.5 rounded-xl border border-violet-100/80">
                                            {date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {event.tags && (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tags & Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                                {event.tags.split(",").map((tag) => (
                                    <span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-xl">
                                        <Tag size={10} /> {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Organizer Info Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-left">Organized By</h3>
                        <div className="flex flex-col items-center">
                            {event.organization_logo ? (
                                <img
                                    src={event.organization_logo}
                                    alt={event.organization_username}
                                    className="w-16 h-16 rounded-2xl object-cover shadow-sm mb-3 border border-slate-100"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center text-2xl font-black mb-3">
                                    {event.organization_username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <h4 className="font-bold text-slate-950">{event.organization_username}</h4>
                            <p className="text-slate-500 text-xs mt-1">Official Host</p>

                            <Link
                                to={`/org/${event.organization_username}`}
                                className="mt-4 w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all inline-block"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

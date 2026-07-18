import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Calendar, MapPin, Tag, ArrowLeft, ExternalLink,
    Clock, AlertCircle, Edit, Trash2, Globe, Users, Share2
} from "lucide-react"; 
import { fetch_event_details, delete_event, track_registration_click } from "../../api/events_apis";
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
    const { event_id } = useParams();
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
                const data = await fetch_event_details(event_id);
                setEvent(data);
                setError(null);
            } catch (err) {
                setError(err.error || "Event not found or failed to load.");
            } finally {
                setLoading(false);
            }
        };
        loadEventDetails();
    }, [event_id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            setDeleting(true);
            await delete_event(event_id);
            alert("Event deleted successfully.");
            const username = localStorage.getItem("username");
            const accountType = localStorage.getItem("accountType");
            if (accountType === "organization") {
                navigate(`/organization/${username}/events`);
            } else {
                navigate(`/user/${username}/events`);
            }
        } catch (err) {
            alert(err.error || "Failed to delete event.");
        } finally {
            setDeleting(false);
        }
    };

    const handleRegistrationClick = async (e) => {
        e.preventDefault(); // Prevent immediate navigation
        if (!event?.registration_link) return;

        // Track the click in the background
        track_registration_click(event.id).catch(console.error);

        // Open the link in a new tab
        window.open(event.registration_link, '_blank', 'noopener,noreferrer');
    };

    const handleShare = async () => {
        const shareData = {
            title: event.title,
            text: event.short_description,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert("Event link copied to clipboard!");
            } catch (err) {
                alert("Failed to copy link.");
            }
        }
    };

    if (loading) {
        return (
            <main className="pb-16 px-4 md:px-8 max-w-7xl mx-auto animate-pulse">
                {/* Back Button Skeleton */}
                <div className="mb-6 h-10 w-36 bg-slate-200 rounded-full"></div>

                {/* Hero Section Skeleton */}
                <div className="w-full h-[350px] md:h-[400px] rounded-3xl mb-12 bg-slate-200"></div>

                {/* Two Column Grid Skeleton */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Header Skeleton */}
                        <div className="space-y-3">
                            <div className="h-8 bg-slate-200 rounded-lg w-3/4"></div>
                            <div className="h-5 bg-slate-200 rounded-lg w-full"></div>
                            <div className="h-5 bg-slate-200 rounded-lg w-1/2"></div>
                        </div>

                        {/* Meta Grid Skeleton */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-24 bg-slate-200 rounded-2xl"></div>
                            <div className="h-24 bg-slate-200 rounded-2xl"></div>
                        </div>

                        {/* Details Skeleton */}
                        <div className="space-y-4">
                            <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
                            <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                            <div className="h-4 bg-slate-200 rounded-lg w-full"></div>
                            <div className="h-4 bg-slate-200 rounded-lg w-5/6"></div>
                        </div>
                    </div>

                    {/* Right Column Skeleton (Organizer Card) */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <div className="h-36 bg-slate-200 rounded-2xl"></div>
                        </div>
                    </aside>
                </div>
            </main>
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
                    onClick={() => {
                        const username = localStorage.getItem("username");
                        const accountType = localStorage.getItem("accountType");
                        if (accountType === "organization") {
                            navigate(`/organization/${username}/events`);
                        } else {
                            navigate(`/user/${username}/events`);
                        }
                    }}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back to Events
                </button>
            </div>
        );
    }

    const isOwner = userData?.username === event.organization_username;

    return (
        <main className="pb-16 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
            {/* Back Button */}
            <div className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-violet-600 font-semibold text-sm py-2 px-4 hover:bg-violet-50 rounded-full transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative w-full h-[350px] md:h-[400px] rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-slate-900/10">
                {event.banner_image ? (
                    <img src={event.banner_image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <EventBannerPlaceholder category={event.category} title={event.title} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white font-semibold text-xs mb-3 tracking-widest">
                            {event.category.toUpperCase()} EVENT
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 -tracking-wider drop-shadow-lg">{event.title}</h1>
                        <p className="text-white/80 text-base md:text-lg font-medium">{event.location} • {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
            </section>

            {/* Two Column Grid */}
            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">{event.title}</h2>
                            <p className="text-lg text-slate-600">{event.short_description}</p>
                        </div>
                        {!isOwner && event.registration_link && (
                            <div className="shrink-0">
                                <a href={event.registration_link} onClick={handleRegistrationClick} className="w-full h-12 bg-violet-600 text-white font-semibold text-sm rounded-full hover:bg-violet-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 px-8">
                                    <Users size={18} /> Register Now
                                </a>
                            </div>
                        )}
                        {isOwner && (
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => navigate(`/organization/${userData.username}/events/edit/${event.id}`)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full transition-all">
                                    <Edit size={20} />
                                </button>
                                <button disabled={deleting} onClick={handleDelete} className="p-3 bg-red-100/60 hover:bg-red-100 text-red-600 rounded-full transition-all">
                                    {deleting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div> : <Trash2 size={20} />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Meta Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
                            <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 shrink-0">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-slate-800 mb-1">Date & Timing</h4>
                                <p className="font-medium text-base text-slate-900">{event.event_date}{event.end_date && event.end_date !== event.event_date ? ` to ${event.end_date}` : ""}</p>
                                <p className="text-sm text-slate-500">{event.start_time.substring(0, 5)} - {event.end_time.substring(0, 5)}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800 mb-1">Location</h4>
                                <p className="font-medium text-base text-slate-900">{event.location}</p>
                                {event.map_link && (
                                    <a className="inline-flex items-center gap-1 mt-1 text-violet-600 font-semibold text-sm hover:underline" href={event.map_link} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink size={16} />
                                        View on Map
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Event Details */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">About the Event</h3>
                        <div className="space-y-4 text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {event.detailed_description}
                        </div>
                    </div>

                    {/* Timeline */}
                    {event.custom_dates && Object.keys(event.custom_dates).length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Event Schedule</h3>
                            <div className="space-y-6 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {Object.entries(event.custom_dates).map(([label, date], index) => (
                                    <div key={label} className="relative flex gap-8 items-start group">
                                        <div className={`w-10 h-10 bg-white border-4 ${index === 0 ? 'border-violet-600' : 'border-slate-300 group-hover:border-violet-600'} rounded-full z-10 shrink-0 transition-colors`}></div>
                                        <div>
                                            <span className={`font-semibold text-sm ${index === 0 ? 'text-violet-600' : 'text-slate-500'}`}>{date}</span>
                                            <h4 className="text-xl font-bold text-slate-900 mt-1">{label}</h4>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {event.tags && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {event.tags.split(",").map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-violet-50 text-violet-700 border border-violet-200/80 rounded-full font-semibold text-sm">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        {/* Organizer Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between gap-4">
                                {event.organization_logo ? (
                                    <img src={event.organization_logo} alt={event.organization_username} className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0" style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)' }}>
                                        {event.organization_username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 font-semibold mb-1">Organized by</p>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{event.organization_name || event.organization_username}</h3>
                                </div>
                                <button onClick={handleShare} className="h-11 w-11 flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-all" title="Share Event">
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {isOwner && (
                                <div className="mt-6 bg-violet-50 border border-violet-200 rounded-xl p-4 text-center">
                                    <p className="text-3xl font-black text-violet-700">{event.registration_link_clicks}</p>
                                    <p className="text-xs font-bold text-violet-600 uppercase tracking-wider">Registration Clicks</p>
                                </div>
                            )}

                            <div className="mt-6">
                                {!isOwner && (
                                    <Link to={`/organization/${event.organization_username}/profile`} className="w-full h-11 border border-slate-300 text-slate-800 font-semibold text-sm rounded-full hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                        View Profile
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Map Section */}
                        {event.map_link && event.map_link.includes("embed") && (
                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                                <iframe
                                    src={event.map_link}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="rounded-xl"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}

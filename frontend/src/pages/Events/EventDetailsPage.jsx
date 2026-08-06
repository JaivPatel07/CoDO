import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Calendar, MapPin, Tag, ArrowLeft, ExternalLink,
    Clock, AlertCircle, Edit, Trash2, Globe, Users, Share2,
    Copy, Check, Maximize2, Compass, Navigation, X
} from "lucide-react";
import { fetch_event_details, delete_event, track_registration_click } from "../../api/events_apis";
import ErrorBanner from "../../components/ErrorBanner";
import { UserContext } from "../../contextAPI/userContext";

const CATEGORY_BANNER = {
    Tech: { from: "#6366f1", to: "#8b5cf6", icon: "⚡" },
    Design: { from: "#ec4899", to: "#f43f5e", icon: "🎨" },
    Business: { from: "#0ea5e9", to: "#2563eb", icon: "📊" },
    Culture: { from: "#f97316", to: "#ef4444", icon: "🎭" },
    Sports: { from: "#10b981", to: "#059669", icon: "🏆" },
    Others: { from: "#64748b", to: "#334155", icon: "📌" },
};

function EventBannerPlaceholder({ category }) {
    const theme = CATEGORY_BANNER[category] || CATEGORY_BANNER.Others;
    return (
        <div
            className="w-full h-full relative overflow-hidden select-none"
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
        >
            <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 pointer-events-none"></div>
            <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="absolute -bottom-24 right-1/4 w-56 h-56 rounded-full bg-white/10 pointer-events-none"></div>
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
    const [copied, setCopied] = useState(false);
    const [isMapExpanded, setIsMapExpanded] = useState(false);

    const getEmbedUrl = (mapLink, location) => {
        if (mapLink && mapLink.includes("embed")) {
            return mapLink;
        }
        // Prioritize the human-readable location address to get precise results from Google Maps search
        let query = location;
        if (!query && mapLink) {
            if (mapLink.includes("google.com/maps/place/")) {
                const parts = mapLink.split("/place/");
                if (parts[1]) {
                    query = decodeURIComponent(parts[1].split("/")[0].replace(/\+/g, " "));
                }
            } else {
                query = mapLink;
            }
        }
        return `https://maps.google.com/maps?q=${encodeURIComponent(query || "")}&t=&z=16&ie=UTF8&iwloc=B&output=embed`;
    };

    const getDirectionsUrl = (mapLink, location) => {
        if (mapLink && !mapLink.includes("embed") && mapLink.startsWith("http")) {
            return mapLink;
        }
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    };

    const handleCopyLocation = async () => {
        if (!event?.location) return;
        try {
            await navigator.clipboard.writeText(event.location);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy address:", err);
        }
    };

    const handleAddToCalendar = () => {
        if (!event) return;

        // Format dates into YYYYMMDDTHHmmSSZ
        const dateStr = event.event_date.replace(/-/g, ""); // e.g. 2026-07-20 -> 20260720
        const start = `${dateStr}T${event.start_time.replace(/:/g, "")}`;
        const end = `${dateStr}T${event.end_time.replace(/:/g, "")}`;

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//CoDO//Event Scheduler//EN",
            "BEGIN:VEVENT",
            `UID:${event.id}@codo.com`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.short_description || ""}`,
            `LOCATION:${event.location || ""}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

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
                <div className="mb-6 h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded-full"></div>

                {/* Hero Section Skeleton */}
                <div className="w-full h-[350px] md:h-[400px] rounded-3xl mb-12 bg-slate-200 dark:bg-slate-700"></div>

                {/* Two Column Grid Skeleton */}
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Header Skeleton */}
                        <div className="space-y-3">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
                        </div>

                        {/* Meta Grid Skeleton */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                        </div>

                        {/* Details Skeleton */}
                        <div className="space-y-4">
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mb-4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-5/6"></div>
                        </div>
                    </div>

                    {/* Right Column Skeleton (Organizer Card & Map Card) */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
                                <div className="h-44 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        );
    }

if (error || !event) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-12">
                <ErrorBanner message={error || "Event details are unavailable."} />
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
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back to Events
                </button>
            </div>
        );
    }
    const isOwner = userData?.username === event.organization_username;
    const isOnline = event.location?.toLowerCase().includes("online") ||
        event.location?.toLowerCase().includes("virtual") ||
        event.location?.toLowerCase().startsWith("http");

    const locationParts = event.location ? event.location.split(",") : ["", ""];
    const primaryLocation = locationParts[0]?.trim();
    const secondaryLocation = locationParts.slice(1).join(",").trim();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 pb-8">
            <main className="px-4 md:px-6 max-w-7xl mx-auto animate-in fade-in duration-300">
                {/* Back Button */}
                <div className="py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-slate-100 font-bold text-xs uppercase tracking-wider transition-all duration-200 group cursor-pointer"
                    >
                        <span className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700/80 bg-white flex items-center justify-center text-slate-600 dark:text-slate-400 dark:text-slate-500 group-hover:text-slate-950 group-hover:border-slate-350 shadow-sm transition-all duration-200 group-hover:-translate-x-0.5">
                            <ArrowLeft size={12} />
                        </span>
                        Back to Events
                    </button>
                </div>

                {/* Hero Section */}
                <section className="relative w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden mb-5 shadow-md shadow-slate-100 border border-slate-100 dark:border-slate-800">
                    {event.banner_image ? (
                        <>
                            <img src={event.banner_image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
                        </>
                    ) : (
                        <EventBannerPlaceholder category={event.category} />
                    )}
                    {!event.banner_image && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>}

                    {/* Overlay Title details */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 z-10">
                        <div className="max-w-4xl">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white font-bold text-[9px] sm:text-[10px] mb-2 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                                {event.category} Event
                            </span>
                            <h1 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight leading-tight drop-shadow-sm">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-white/80 text-xs font-semibold">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-violet-400" />
                                    {event.location}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-violet-400" />
                                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Two Column Grid */}
                <div className="grid lg:grid-cols-12 gap-5">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-5">
                        {/* Owner Action Bar (icon-only) OR Secure Your Spot Card */}
                        {isOwner ? (
                            <div className="flex items-center justify-between gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Managing Event</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">{event.title}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => navigate(`/organization/${userData.username}/events/edit/${event.id}`)}
                                        title="Edit Event"
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:text-slate-100 transition-all cursor-pointer shadow-sm"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        disabled={deleting}
                                        onClick={handleDelete}
                                        title="Delete Event"
                                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/20 hover:bg-red-100 border border-red-100 text-red-500 hover:text-red-700 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                                    >
                                        {deleting
                                            ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600" />
                                            : <Trash2 size={14} />}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Secure Your Spot</h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed max-w-xl">
                                        {event.short_description || "Early bird registration is available for this event."}
                                    </p>
                                </div>
                                {event.registration_link && (
                                    <div className="shrink-0 w-full sm:w-auto">
                                        <a
                                            href={event.registration_link}
                                            onClick={handleRegistrationClick}
                                            className="w-full h-12 bg-violet-600 dark:bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-violet-600/20 hover:shadow-xl hover:shadow-violet-600/30 active:scale-95 flex items-center justify-center gap-2 px-6 cursor-pointer animate-pulse-slow"
                                        >
                                            <ExternalLink size={16} />
                                            Register Now
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Meta Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Date & Timing Card */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 transition-all duration-300 hover:shadow-md hover:border-slate-300/80 relative group">
                                <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-600 shrink-0 border border-violet-100/70 group-hover:scale-105 transition-transform duration-200">
                                    <Clock size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 font-sans">Date & Timing</h4>
                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                                        {event.end_date && event.end_date !== event.event_date ? (
                                            <>
                                                {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                {' '}–{' '}
                                                {new Date(event.end_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </>
                                        ) : (
                                            new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 flex items-start gap-3 transition-all duration-300 hover:shadow-md hover:border-slate-300/80 relative group">
                                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/20 rounded-xl flex items-center justify-center text-rose-600 shrink-0 border border-rose-100/70 group-hover:scale-105 transition-transform duration-200">
                                    <MapPin size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 font-sans">Location</h4>
                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight leading-snug truncate">
                                        {isOnline ? "Online Virtual Meeting" : (primaryLocation || event.location)}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5 truncate font-semibold">
                                        {isOnline ? "Hosted Electronically" : (secondaryLocation || "Physical Address")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-all duration-300 hover:shadow-md">
                            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mb-4 tracking-tight border-b border-slate-100 dark:border-slate-800 pb-2.5">About the Event</h3>
                            <div className="space-y-3 text-slate-650 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                {event.detailed_description}
                            </div>
                        </div>

                        {/* Timeline / Schedule */}
                        {event.custom_dates && typeof event.custom_dates === 'object' && Object.keys(event.custom_dates).length > 0 && (
                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/60 transition-all duration-300 hover:shadow-md">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/200 rounded-2xl flex items-center justify-center text-white shadow-md shadow-violet-100 shrink-0">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Event Schedule</h3>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">Event milestones and dates</p>
                                    </div>
                                </div>

                                <div className="relative space-y-6">
                                    {/* Connecting Line */}
                                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:bg-slate-700 transition-colors" />

                                    {Object.entries(event.custom_dates).map(([label, date], index, arr) => {
                                        const isLast = index === arr.length - 1;

                                        // Parse dates into elegant calendar items
                                        let monthStr = "MM";
                                        let dayStr = "DD";
                                        let yearStr = "";
                                        try {
                                            const d = new Date(date + 'T00:00:00');
                                            monthStr = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                                            dayStr = d.toLocaleDateString('en-US', { day: '2-digit' });
                                            yearStr = d.toLocaleDateString('en-US', { year: 'numeric' });
                                        } catch (e) { }

                                        return (
                                            <div key={label} className="relative flex gap-6 items-start group">
                                                {/* Left Column: Mini Calendar Block (Replaces Dot) */}
                                                <div className="relative z-10 w-12 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white overflow-hidden shadow-sm flex flex-col items-center justify-center shrink-0 group-hover:border-violet-500 group-hover:shadow-md group-hover:shadow-violet-100 transition-all duration-300">
                                                    <div className="bg-slate-50 dark:bg-slate-800 group-hover:bg-violet-600 dark:bg-violet-600 text-slate-400 dark:text-slate-500 group-hover:text-white text-[9px] font-black w-full text-center py-1 tracking-wider uppercase transition-colors duration-300 border-b border-slate-100 dark:border-slate-800 group-hover:border-violet-700">
                                                        {monthStr}
                                                    </div>
                                                    <div className="text-base font-black text-slate-800 dark:text-slate-200 group-hover:text-violet-650 w-full text-center flex-1 flex items-center justify-center font-mono leading-none">
                                                        {dayStr}
                                                    </div>
                                                </div>

                                                {/* Right Column: Content Card */}
                                                <div className="min-w-0 flex-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-white rounded-2xl px-4 py-3.5 transition-all duration-300 border border-slate-100 dark:border-slate-800 group-hover:border-violet-100 group-hover:shadow-sm flex items-center">
                                                    <h4 className="text-sm font-extrabold text-slate-850 tracking-tight leading-tight group-hover:text-slate-900 dark:text-slate-100 transition-colors">
                                                        {label}
                                                    </h4>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {event.tags && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {event.tags.split(",").map((tag) => (
                                    <span key={tag} className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-650 hover:text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 rounded-full font-bold text-xs transition-all duration-205 cursor-default hover:bg-slate-200 dark:bg-slate-700/60">
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="space-y-6">
                            {/* Organizer Card */}
                            {isOwner ? (
                                <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {event.organization_logo ? (
                                                <img
                                                    src={event.organization_logo}
                                                    alt={event.organization_username}
                                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                                                    {event.organization_username.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="leading-tight">
                                                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1">
                                                    Organized By
                                                </p>

                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                    {event.organization_name || event.organization_username}
                                                </h3>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleShare}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-500/20 dark:bg-violet-500/20 hover:text-violet-600 transition"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50 dark:bg-violet-500/20 p-4 text-center">
                                        <p className="text-2xl font-black text-violet-700">
                                            {event.registration_link_clicks}
                                        </p>
                                        <p className="mt-1 text-[10px] uppercase tracking-widest font-bold text-violet-500">
                                            Registration Link Clicks
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={`/organization/${event.organization_username}/profile`}
                                    className="group block bg-white dark:bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-violet-300 transition p-5"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {event.organization_logo ? (
                                                <img
                                                    src={event.organization_logo}
                                                    alt={event.organization_username}
                                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                                                    {event.organization_username.charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="leading-tight">
                                                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1">
                                                    Organized By
                                                </p>

                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition">
                                                    {event.organization_name || event.organization_username}
                                                </h3>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleShare();
                                            }}
                                            className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-violet-500/20 dark:bg-violet-500/20 hover:text-violet-600 transition"
                                        >
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </Link>
                            )}

                            {/* Map & Mini-Map or Online Event Section */}
                            {(() => {
                                if (isOnline) {
                                    return (
                                        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative transition-all hover:shadow-md">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Globe className="text-violet-600 animate-pulse" size={16} />
                                                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">Online Event</h3>
                                            </div>

                                            <div className="bg-gradient-to-br from-violet-50 to-indigo-50/50 p-4 rounded-xl border border-violet-100 flex flex-col items-center text-center">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-violet-600 shadow-sm border border-violet-50 mb-2">
                                                    <Globe size={20} />
                                                </div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs mb-0.5">This Event is Virtual</h4>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-xs leading-relaxed">
                                                    Join this event from anywhere.
                                                </p>
                                            </div>

                                            {event.registration_link && (
                                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                                    <a
                                                        href={event.registration_link}
                                                        onClick={handleRegistrationClick}
                                                        className="w-full h-9 bg-violet-600 dark:bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-violet-600/10"
                                                    >
                                                        <ExternalLink size={12} />
                                                        <span>Join / Register Link</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                if (event.map_link || event.location) {
                                    return (
                                        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden relative group/map transition-all hover:shadow-md">
                                            <div className="flex justify-between items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <Compass className="text-violet-600 animate-[spin_8s_linear_infinite] shrink-0" size={14} />
                                                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide">Location</h3>
                                                </div>
                                                <button
                                                    onClick={() => setIsMapExpanded(true)}
                                                    className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:text-slate-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 cursor-pointer"
                                                    title="Expand Map"
                                                >
                                                    <Maximize2 size={14} />
                                                </button>
                                            </div>

                                            {/* Interactive Mini-map Container */}
                                            <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner group/iframe mb-3">
                                                <iframe
                                                    src={getEmbedUrl(event.map_link, event.location)}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    className="w-full h-full object-cover transition-all duration-300"
                                                ></iframe>
                                            </div>

                                            {/* Address details & action buttons */}
                                            <div className="pt-2">
                                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 leading-relaxed">{event.location}</p>

                                                <div className="grid grid-cols-2 gap-2 mt-4">
                                                    <button
                                                        onClick={handleCopyLocation}
                                                        className="h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                    >
                                                        {copied ? <Check size={14} className="text-violet-600" /> : <Copy size={14} />}
                                                        <span>{copied ? "Copied!" : "Copy"}</span>
                                                    </button>
                                                    <a
                                                        href={getDirectionsUrl(event.map_link, event.location)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="h-10 bg-violet-600 dark:bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-violet-600/10"
                                                    >
                                                        <Navigation size={14} />
                                                        <span>Directions</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return null;
                            })()}
                        </div>
                    </aside>
                </div>

                {/* Fullscreen Map Modal */}
                {isMapExpanded && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 dark:bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[80vh] sm:h-[85vh] animate-in zoom-in-95 duration-200">
                            {/* Modal Header */}
                            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50 dark:bg-slate-800">
                                <div className="pr-4 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{event.title}</h3>
                                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                                        <MapPin size={12} className="shrink-0" /> {event.location}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsMapExpanded(false)}
                                    className="h-9 w-9 bg-white hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:text-slate-200 rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer shrink-0"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            {/* Modal Map Body */}
                            <div className="flex-1 bg-slate-100 dark:bg-slate-800 relative">
                                <iframe
                                    src={getEmbedUrl(event.map_link, event.location)}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                            {/* Modal Footer */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
                                <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">Interactive navigation powered by Google Maps</span>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleCopyLocation}
                                        className="flex-1 sm:flex-initial h-9 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        {copied ? <Check size={13} className="text-violet-600" /> : <Copy size={13} />}
                                        <span>{copied ? "Copied!" : "Copy Address"}</span>
                                    </button>
                                    <a
                                        href={getDirectionsUrl(event.map_link, event.location)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 sm:flex-initial h-9 px-5 bg-violet-600 dark:bg-violet-600 text-white font-semibold text-xs rounded-xl hover:bg-violet-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                    >
                                        <Navigation size={13} />
                                        <span>Get Directions</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

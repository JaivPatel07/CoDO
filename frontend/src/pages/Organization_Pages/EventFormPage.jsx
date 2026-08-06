import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Info, Rocket, Plus, Trash2, X, Wifi, Building2, Globe, Tag, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { create_event, fetch_event_details, update_event } from "../../api/events_apis";

const CATEGORIES = ["Tech", "Design", "Business", "Culture", "Sports", "Others"];

const EVENT_TAGS = [
    "Hackathon", "Workshop", "Seminar", "Webinar", "Competition", "Bootcamp",
    "Networking", "Conference", "Internship", "Job Fair", "Open Source",
    "AI/ML", "Web Dev", "Mobile", "Cybersecurity", "Data Science", "Blockchain",
    "Design", "Cloud", "DevOps", "Robotics", "IoT", "Gaming",
    "React", "Python", "JavaScript", "Java", "Node.js",
    "Free", "Certificate", "Team Event", "Solo", "National", "International",
];

const LOCATION_TYPES = ["Online", "Offline", "Hybrid"];

const MILESTONE_LABELS = [
    "Registration Opens", "Registration Closes", "Round 1 Starts", "Round 1 Ends",
    "Round 2 Starts", "Round 2 Ends", "Final Round", "Results Announced",
    "Orientation", "Shortlist Announced", "Certificate Distribution", "Other",
];

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

// Convert HH:MM (24h) to { hour, minute, period }
function parse24hTime(timeStr) {
    if (!timeStr) return { hour: "09", minute: "00", period: "AM" };
    const [h, m] = timeStr.split(":");
    const hNum = parseInt(h, 10);
    const period = hNum >= 12 ? "PM" : "AM";
    const hour12 = hNum % 12 || 12;
    return { hour: String(hour12).padStart(2, "0"), minute: m || "00", period };
}

// Convert { hour, minute, period } to HH:MM (24h)
function to24h(hour, minute, period) {
    let h = parseInt(hour, 10);
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${minute}`;
}

// ── Shared input class ───────────────────────────────────────────────────────
const inp = "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 py-2.5 px-4 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:text-slate-500";
const sel =
"w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 py-2.5 pl-4 pr-10 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 transition-all text-sm text-slate-800 dark:text-slate-200 appearance-none cursor-pointer";
// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ icon: Icon, title, subtitle, children }) {
    return (
        <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/20 flex items-center justify-center text-violet-600">
                    <Icon size={16} />
                </div>
                <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-slate-100">{title}</h2>
                    {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
            </div>
            <div className="p-6 space-y-5">{children}</div>
        </div>
    );
}

// ── Label ────────────────────────────────────────────────────────────────────
function Label({ children, required }) {
    return (
        <label className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            {children} {required && <span className="text-red-500">*</span>}
        </label>
    );
}

// ── SelectWrapper (adds chevron icon) ────────────────────────────────────────
function SelectWrap({ children }) {
    return (
        <div className="relative">
            {children}
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
        </div>
    );
}

// ── AM/PM Time Picker ────────────────────────────────────────────────────────
function TimePicker({ label, value, onChange, required }) {
    const parsed = parse24hTime(value);
    const [hour, setHour] = useState(parsed.hour);
    const [minute, setMinute] = useState(parsed.minute);
    const [period, setPeriod] = useState(parsed.period);

    useEffect(() => {
        const p = parse24hTime(value);
        setHour(p.hour); setMinute(p.minute); setPeriod(p.period);
    }, [value]);

    const update = (h, m, p) => {
        onChange(to24h(h, m, p));
    };

    return (
        <div>
            <Label required={required}>{label}</Label>
            <div className="flex gap-2">
                {/* Hour */}
                <SelectWrap>
                    <select value={hour} className={sel}
                        onChange={e => { setHour(e.target.value); update(e.target.value, minute, period); }}>
                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </SelectWrap>
                {/* Minute */}
                <SelectWrap>
                    <select value={minute} className={sel}
                        onChange={e => { setMinute(e.target.value); update(hour, e.target.value, period); }}>
                        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </SelectWrap>
                {/* AM/PM */}
                <SelectWrap>
                    <select value={period} className={`${sel} font-bold text-violet-700`}
                        onChange={e => { setPeriod(e.target.value); update(hour, minute, e.target.value); }}>
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </SelectWrap>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EventFormPage() {
    const { id, organization_name } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const locationHook = useLocation();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Form states
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [detailedDescription, setDetailedDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [registrationDeadline, setRegistrationDeadline] = useState("");
    const [registrationLink, setRegistrationLink] = useState("");
    const [mapLink, setMapLink] = useState("");
    const [category, setCategory] = useState("Tech");
    const [selectedTags, setSelectedTags] = useState([]);
    const [customDates, setCustomDates] = useState([{ label: "", date: "" }]);
    const [locationMode, setLocationMode] = useState("Online");
    const [venueText, setVenueText] = useState("");
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");

    useEffect(() => {
        const dup = locationHook.state?.duplicateEvent;
        if (dup && !isEditMode) {
            setTitle(`${dup.title} (Copy)`);
            setShortDescription(dup.short_description);
            setDetailedDescription(dup.detailed_description);
            setEventDate(dup.event_date);
            setEndDate(dup.end_date || "");
            setStartTime(dup.start_time);
            setEndTime(dup.end_time);
            setRegistrationDeadline(dup.registration_deadline || "");
            parseLoc(dup.location || "");
            setRegistrationLink(dup.registration_link || "");
            setMapLink(dup.map_link || "");
            setCategory(dup.category);
            setSelectedTags(dup.tags ? dup.tags.split(",").map(t => t.trim()).filter(Boolean) : []);
            setBannerPreviewUrl(dup.banner_image || "");
            if (dup.custom_dates && Object.keys(dup.custom_dates).length > 0) {
                setCustomDates(Object.entries(dup.custom_dates).map(([label, date]) => ({ label, date })));
            }
            window.scrollTo(0, 0);
        }

        if (isEditMode) {
            const loadEvent = async () => {
                try {
                    setFetching(true);
                    const ev = await fetch_event_details(id);
                    setTitle(ev.title);
                    setShortDescription(ev.short_description);
                    setDetailedDescription(ev.detailed_description);
                    setEventDate(ev.event_date);
                    setEndDate(ev.end_date || "");
                    setStartTime(ev.start_time);
                    setEndTime(ev.end_time);
                    setRegistrationDeadline(ev.registration_deadline || "");
                    parseLoc(ev.location || "");
                    setRegistrationLink(ev.registration_link || "");
                    setMapLink(ev.map_link || "");
                    setCategory(ev.category);
                    setSelectedTags(ev.tags ? ev.tags.split(",").map(t => t.trim()).filter(Boolean) : []);
                    setBannerPreviewUrl(ev.banner_image || "");
                    if (ev.custom_dates && Object.keys(ev.custom_dates).length > 0) {
                        setCustomDates(Object.entries(ev.custom_dates).map(([label, date]) => ({ label, date })));
                    } else {
                        setCustomDates([{ label: "", date: "" }]);
                    }
                } catch (err) {
                    setError("Failed to load event details for editing.");
                } finally {
                    setFetching(false);
                }
            };
            loadEvent();
        }
    }, [id, isEditMode, locationHook.state]);

    const parseLoc = (loc) => {
        if (!loc || loc.toLowerCase() === "online") { setLocationMode("Online"); setVenueText(""); }
        else if (loc.startsWith("Hybrid:")) { setLocationMode("Hybrid"); setVenueText(loc.replace("Hybrid: ", "")); }
        else { setLocationMode("Offline"); setVenueText(loc); }
    };

    const buildLocation = () => {
        if (locationMode === "Online") return "Online";
        if (locationMode === "Hybrid") return venueText.trim() ? `Hybrid: ${venueText.trim()}` : "Hybrid";
        return venueText.trim();
    };

    const addTag = (tag) => { if (tag && !selectedTags.includes(tag)) setSelectedTags(p => [...p, tag]); };
    const removeTag = (tag) => setSelectedTags(p => p.filter(t => t !== tag));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setBannerImageFile(file); setBannerPreviewUrl(URL.createObjectURL(file)); }
    };

    const handleAddCustomDate = () => setCustomDates([...customDates, { label: "", date: "" }]);
    const handleRemoveCustomDate = (i) => {
        const list = [...customDates];
        list.splice(i, 1);
        setCustomDates(list.length > 0 ? list : [{ label: "", date: "" }]);
    };
    const handleCustomDateChange = (i, field, val) => {
        const list = [...customDates];
        list[i][field] = val;
        setCustomDates(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous banner error
        setErrorMessage(''); // Clear previous toast message

        const finalLocation = buildLocation();
        const finalTags = selectedTags.join(", ");

        if (!title.trim() || !shortDescription.trim() || !detailedDescription.trim() || !eventDate || !startTime || !endTime || !finalLocation.trim()) {
            setErrorMessage("Please fill out all required fields.");
            return;
        }
        if (locationMode !== "Online" && !venueText.trim()) {
            setErrorMessage("Please enter the venue address for Offline / Hybrid events.");
            return;
        }
        if (!endDate || eventDate === endDate) {
            if (startTime >= endTime) {
                setErrorMessage("End time must be later than start time for single-day events.");
                return;
            }
        } else if (eventDate > endDate) {
            setErrorMessage("Event End Date cannot be earlier than Event Start Date.");
            return;
        }

        if (registrationDeadline && eventDate && registrationDeadline > eventDate) {
            setErrorMessage("Registration deadline cannot be after the event start date.");
            return;
        }

        // Validate custom milestone dates against the event start date
        for (const milestone of customDates) {
            if (milestone.label && milestone.date && milestone.date < eventDate) {
                setErrorMessage(`The milestone date for "${milestone.label}" cannot be before the event start date.`);
                return;
            }
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("short_description", shortDescription);
        formData.append("detailed_description", detailedDescription);
        formData.append("event_date", eventDate);
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        formData.append("location", finalLocation);
        formData.append("category", category);
        formData.append("tags", finalTags);
        if (endDate) formData.append("end_date", endDate);
        if (registrationDeadline) formData.append("registration_deadline", registrationDeadline);
        if (registrationLink) formData.append("registration_link", registrationLink);
        if (mapLink) formData.append("map_link", mapLink);

        const customDatesObj = {};
        customDates.forEach(item => { if (item.label.trim() && item.date) customDatesObj[item.label.trim()] = item.date; });
        formData.append("custom_dates", JSON.stringify(customDatesObj));
        if (bannerImageFile) formData.append("banner_image", bannerImageFile);

        try {
            setLoading(true);
            if (isEditMode) {
                await update_event(id, formData);
                setSuccessMessage("Event updated successfully!");
            } else {
                await create_event(formData);
                setSuccessMessage("Event created successfully!");
            }
            setTimeout(() => {
                navigate(`/organization/${organization_name || localStorage.getItem("username")}/events`);
            }, 1500); // Navigate after a short delay to show toast
        } catch (err) {
            const msg = err.error || err.detail || "An error occurred while saving the event.";
            setError(msg); // Keep the banner error for form-level issues
            setErrorMessage(msg); // Show toast for immediate feedback
        } finally {
            setLoading(false);
        }
    };

    // Clear success/error messages after a few seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(''), 5000);
            // Clear the banner error as well if it's the same as the toast error
            if (error === errorMessage) setError(null);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, error]);

    if (fetching) {
        return (
            <div className="flex flex-col justify-center items-center py-24 gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin"></div>
                <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">Loading event details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-6 animate-in fade-in duration-300">

            {/* --- TOAST NOTIFICATIONS --- */}
            <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
                <AnimatePresence>
                    {successMessage && (
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[250px]">
                            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                            <span className="text-sm font-medium">{successMessage}</span>
                        </motion.div>
                    )}
                    {errorMessage && (
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[250px]">
                            <AlertCircle size={20} className="text-red-500 shrink-0" />
                            <span className="text-sm font-medium">{errorMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* ------------------------- */}
            {/* ── Header ── */}
            <div className="flex items-start gap-4 mb-8">
                <button onClick={() => navigate(-1)}
                    className="mt-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 transition cursor-pointer">
                    <ArrowLeft size={16} />
                </button>
                <div className="flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-500/20 border border-violet-100 text-violet-700 text-[10px] font-bold mb-2">
                        <Rocket size={10} /> {isEditMode ? "Editing Event" : "New Event"}
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                        {isEditMode ? "Edit Official Event" : "Create Official Event"}
                    </h1>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Fill in the details below to publish your event to the platform.</p>
                </div>
            </div>

            {/* ── Error Banner ── */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 flex items-start gap-3 mb-6">
                    <Info size={18} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">Please fix the following</p>
                        <p className="text-xs mt-0.5">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* ── Section 1: Identity ── */}
                <Section icon={Tag} title="Event Identity" subtitle="Category, title and banner">

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                            <Label required>Category</Label>
                            <SelectWrap>
                                <select value={category} onChange={e => setCategory(e.target.value)} className={sel}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </SelectWrap>
                        </div>
                        <div className="md:col-span-8">
                            <Label required>Event Title</Label>
                            <input type="text" required placeholder="e.g. GTU Tech Hackathon 2025"
                                value={title} onChange={e => setTitle(e.target.value)} className={inp} />
                        </div>
                    </div>

                    {/* Banner */}
                    <div>
                        <Label>Banner Image</Label>
                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:border-violet-300 transition-colors">
                            {bannerPreviewUrl ? (
                                <div className="relative h-48">
                                    <img src={bannerPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <label htmlFor="banner-upload"
                                        className="absolute bottom-3 right-3 bg-white dark:bg-slate-900 dark:bg-slate-950/90 backdrop-blur text-xs font-bold text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl cursor-pointer hover:bg-white dark:bg-slate-900 dark:bg-slate-950 shadow-md transition">
                                        Replace Image
                                    </label>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 gap-3 bg-slate-50 dark:bg-slate-800/50">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                        <ImageIcon size={24} className="text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Upload Banner Image</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">PNG, JPG up to 5MB</p>
                                    </div>
                                    <label htmlFor="banner-upload"
                                        className="bg-slate-900 dark:bg-slate-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 transition">
                                        Select File
                                    </label>
                                </div>
                            )}
                            <input id="banner-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>
                    </div>
                </Section>

                {/* ── Section 2: Descriptions ── */}
                <Section icon={Info} title="Descriptions" subtitle="Short summary and full details">
                    <div>
                        <Label required>Short Description</Label>
                        <input type="text" required maxLength={500}
                            placeholder="Concise 1-2 sentence overview of the event."
                            value={shortDescription} onChange={e => setShortDescription(e.target.value)} className={inp} />
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{shortDescription.length}/500 characters</p>
                    </div>
                    <div>
                        <Label required>Detailed Description</Label>
                        <textarea required rows={6}
                            placeholder="Timelines, speakers, prerequisites, rules, prizes, and what to expect..."
                            value={detailedDescription} onChange={e => setDetailedDescription(e.target.value)}
                            className={inp + " resize-none"}>
                        </textarea>
                    </div>
                </Section>

                {/* ── Section 3: Scheduling ── */}
                <Section icon={Calendar} title="Dates & Times" subtitle="Event schedule and registration deadline">

                    {/* Dates row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label required>Start Date</Label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)}
                                    className={inp + " pl-9"} />
                            </div>
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                                    className={inp + " pl-9"} />
                            </div>
                        </div>
                        <div>
                            <Label>Registration Deadline</Label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                <input type="date" value={registrationDeadline} onChange={e => setRegistrationDeadline(e.target.value)}
                                    className={inp + " pl-9"} />
                            </div>
                        </div>
                    </div>

                    {/* Times row — AM/PM pickers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TimePicker label="Start Time" value={startTime} onChange={setStartTime} required className='flex-1' />
                        <TimePicker label="End Time" value={endTime} onChange={setEndTime} required />
                    </div>
                </Section>

                {/* ── Section 4: Location ── */}
                <Section icon={MapPin} title="Location & Links" subtitle="Venue type, address and registration links">

                    {/* Mode toggle */}
                    <div>
                        <Label required>Location Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {LOCATION_TYPES.map(mode => (
                                <button key={mode} type="button" onClick={() => setLocationMode(mode)}
                                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold text-xs transition cursor-pointer ${
                                        locationMode === mode
                                            ? "bg-violet-600 border-violet-600 text-white shadow-sm"
                                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:border-violet-300 hover:text-violet-700"
                                    }`}>
                                    {mode === "Online" && <Wifi size={13} />}
                                    {mode === "Offline" && <Building2 size={13} />}
                                    {mode === "Hybrid" && <Globe size={13} />}
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Venue input (only for Offline / Hybrid) */}
                    {locationMode !== "Online" && (
                        <div>
                            <Label required>Venue / Address</Label>
                            <div className="relative">
                                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                <input type="text" required
                                    placeholder={locationMode === "Hybrid" ? "e.g. Seminar Hall A — also streamed online" : "e.g. Seminar Hall A, GTU, Ahmedabad"}
                                    value={venueText} onChange={e => setVenueText(e.target.value)}
                                    className={inp + " pl-9"} />
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>External Registration Link</Label>
                            <div className="relative">
                                <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                <input type="url" placeholder="https://unstop.com/..."
                                    value={registrationLink} onChange={e => setRegistrationLink(e.target.value)}
                                    className={inp + " pl-9"} />
                            </div>
                        </div>
                        <div>
                            <Label>Google Maps Embed Link</Label>
                            <div className="relative">
                                <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                <input type="url" placeholder="Embed URL from Google Maps"
                                    value={mapLink} onChange={e => setMapLink(e.target.value)}
                                    className={inp + " pl-9"} />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── Section 5: Tags & Milestones ── */}
                <Section icon={Tag} title="Tags & Milestones" subtitle="Discoverability tags and custom timeline dates">

                    {/* Tags chip picker */}
                    <div>
                        <Label>Tags</Label>
                        <SelectWrap>
                            <select className={sel} onChange={e => { addTag(e.target.value); e.target.value = ""; }}>
                                <option value="">+ Select a tag to add</option>
                                {EVENT_TAGS.filter(t => !selectedTags.includes(t)).map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </SelectWrap>
                        <div className="flex flex-wrap gap-2 mt-3 min-h-[28px]">
                            {selectedTags.length === 0 && (
                                <span className="text-xs text-slate-400 dark:text-slate-500 italic">No tags selected yet. Pick from the dropdown above.</span>
                            )}
                            {selectedTags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-500/20 text-violet-700 border border-violet-100 hover:bg-violet-100 dark:bg-violet-500/20 transition">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)} className="text-violet-400 hover:text-violet-700 transition cursor-pointer">
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Custom Milestones */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500">Custom Milestone Dates</p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Optional timeline events like Round 1, Orientation, Results.</p>
                            </div>
                            <button type="button" onClick={handleAddCustomDate}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 dark:bg-violet-500/20 hover:bg-violet-100 dark:bg-violet-500/20 px-3 py-1.5 rounded-xl transition cursor-pointer border border-violet-100">
                                <Plus size={12} /> Add Milestone
                            </button>
                        </div>
                        <div className="space-y-2.5">
                            {customDates.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                                    <div className="flex-1 w-full">
                                        <SelectWrap>
                                            <select value={item.label}
                                                onChange={e => handleCustomDateChange(index, "label", e.target.value)}
                                                className={`${sel} text-xs`}>
                                                <option value="">Select milestone...</option>
                                                {MILESTONE_LABELS.map(ml => <option key={ml} value={ml}>{ml}</option>)}
                                            </select>
                                        </SelectWrap>
                                    </div>
                                    <div className="w-full sm:w-auto">
                                        <div className="relative">
                                            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                            <input type="date" value={item.date}
                                                onChange={e => handleCustomDateChange(index, "date", e.target.value)}
                                                className={`${inp} pl-8 text-xs`} />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveCustomDate(index)}
                                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer flex-shrink-0">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* ── Submit Actions ── */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={() => navigate(-1)}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800 font-bold text-sm transition cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-8 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-md shadow-violet-600/20 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading
                            ? <><div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div><span>Saving...</span></>
                            : <><Rocket size={15} /><span>{isEditMode ? "Save Changes" : "Publish Event"}</span></>
                        }
                    </button>
                </div>

            </form>
        </div>
    );
}

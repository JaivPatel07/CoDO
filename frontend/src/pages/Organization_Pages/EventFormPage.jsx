import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, MapPin, Tag, Clock, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Info, Rocket, Plus, Trash2 } from "lucide-react";
import { create_event, fetch_event_details, update_event } from "../../api/events_apis";

const CATEGORIES = ["Tech", "Design", "Business", "Culture", "Sports", "Others"];

export default function EventFormPage() {
    const { id, organization_name } = useParams(); // populated in edit mode
    const isEditMode = !!id;
    const navigate = useNavigate();
    const locationHook = useLocation();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);

    // Form states
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [detailedDescription, setDetailedDescription] = useState("");
    const [eventDate, setEventDate] = useState(""); // Start Date
    const [endDate, setEndDate] = useState(""); // End Date (optional)
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [registrationDeadline, setRegistrationDeadline] = useState(""); // Registration deadline
    const [location, setLocation] = useState("");
    const [registrationLink, setRegistrationLink] = useState("");
    const [mapLink, setMapLink] = useState("");
    const [category, setCategory] = useState("Tech");
    const [tags, setTags] = useState("");
    
    // Custom timeline milestone dates (list of { label, date })
    const [customDates, setCustomDates] = useState([{ label: "", date: "" }]);
    
    // File upload state
    const [bannerImageFile, setBannerImageFile] = useState(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");

    useEffect(() => {
        const duplicateEventData = locationHook.state?.duplicateEvent;
        if (duplicateEventData && !isEditMode) {
            // Pre-fill form for duplication
            setTitle(`${duplicateEventData.title} (Copy)`);
            setShortDescription(duplicateEventData.short_description);
            setDetailedDescription(duplicateEventData.detailed_description);
            setEventDate(duplicateEventData.event_date);
            setEndDate(duplicateEventData.end_date || "");
            setStartTime(duplicateEventData.start_time);
            setEndTime(duplicateEventData.end_time);
            setRegistrationDeadline(duplicateEventData.registration_deadline || "");
            setLocation(duplicateEventData.location);
            setRegistrationLink(duplicateEventData.registration_link || "");
            setMapLink(duplicateEventData.map_link || "");
            setCategory(duplicateEventData.category);
            setTags(duplicateEventData.tags);
            setBannerPreviewUrl(duplicateEventData.banner_image || "");

            if (duplicateEventData.custom_dates && Object.keys(duplicateEventData.custom_dates).length > 0) {
                const list = Object.entries(duplicateEventData.custom_dates).map(([label, date]) => ({ label, date }));
                setCustomDates(list);
            }
            // Note: We don't duplicate the banner image file itself, just the preview URL.
            // The user must re-upload if they want the same banner.
            window.scrollTo(0, 0);
        }

        if (isEditMode) {
            const loadEvent = async () => {
                try {
                    setFetching(true);
                    const event = await fetch_event_details(id);
                    setTitle(event.title);
                    setShortDescription(event.short_description);
                    setDetailedDescription(event.detailed_description);
                    setEventDate(event.event_date);
                    setEndDate(event.end_date || "");
                    setStartTime(event.start_time);
                    setEndTime(event.end_time);
                    setRegistrationDeadline(event.registration_deadline || "");
                    setLocation(event.location);
                    setRegistrationLink(event.registration_link || "");
                    setMapLink(event.map_link || "");
                    setCategory(event.category);
                    setTags(event.tags);
                    setBannerPreviewUrl(event.banner_image || "");
                    
                    if (event.custom_dates && Object.keys(event.custom_dates).length > 0) {
                        const list = Object.entries(event.custom_dates).map(([label, date]) => ({
                            label,
                            date
                        }));
                        setCustomDates(list);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImageFile(file);
            setBannerPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleAddCustomDate = () => {
        setCustomDates([...customDates, { label: "", date: "" }]);
    };

    const handleRemoveCustomDate = (index) => {
        const list = [...customDates];
        list.splice(index, 1);
        setCustomDates(list.length > 0 ? list : [{ label: "", date: "" }]);
    };

    const handleCustomDateChange = (index, field, value) => {
        const list = [...customDates];
        list[index][field] = value;
        setCustomDates(list);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (!title.trim() || !shortDescription.trim() || !detailedDescription.trim() || !eventDate || !startTime || !endTime || !location.trim()) {
            setError("Please fill out all required fields.");
            return;
        }

        // Validate event timing
        if (!endDate || eventDate === endDate) {
            if (startTime >= endTime) {
                setError("End time must be later than start time for single-day events.");
                return;
            }
        } else if (eventDate > endDate) {
            setError("Event End Date cannot be earlier than Event Start Date.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("short_description", shortDescription);
        formData.append("detailed_description", detailedDescription);
        formData.append("event_date", eventDate);
        formData.append("start_time", startTime);
        formData.append("end_time", endTime);
        formData.append("location", location);
        formData.append("category", category);
        formData.append("tags", tags);

        if (endDate) {
            formData.append("end_date", endDate);
        }
        if (registrationDeadline) {
            formData.append("registration_deadline", registrationDeadline);
        }
        if (registrationLink) {
            formData.append("registration_link", registrationLink);
        }
        if (mapLink) {
            formData.append("map_link", mapLink);
        }

        // Build custom dates payload
        const customDatesObj = {};
        customDates.forEach(item => {
            if (item.label.trim() && item.date) {
                customDatesObj[item.label.trim()] = item.date;
            }
        });
        formData.append("custom_dates", JSON.stringify(customDatesObj));

        if (bannerImageFile) {
            formData.append("banner_image", bannerImageFile);
        }

        try {
            setLoading(true);
            if (isEditMode) {
                await update_event(id, formData);
                alert("Event updated successfully!");
            } else {
                await create_event(formData);
                alert("Event created successfully!");
            }
            navigate(`/organization/${organization_name || localStorage.getItem("username")}/events`);
        } catch (err) {
            setError(err.error || err.detail || "An error occurred while saving the event.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">

            {/* Page Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition cursor-pointer"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-bold mb-3 ml-2">
                        <Rocket size={13} /> {isEditMode ? "Edit Event" : "New Event"}
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {isEditMode ? "Edit Official Event" : "Create Official Event"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Configure event dates, registration deadlines, and custom timeline milestones.
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 flex items-center gap-3 mb-6">
                    <Info className="flex-shrink-0" />
                    <div>
                        <p className="font-bold">Check Form Fields</p>
                        <p className="text-xs">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Section 1 — Identity */}
                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Event Identity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-8">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Event Title *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Ahmedabad Tech Hackathon"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Banner Image Upload */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Banner Image</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center bg-slate-50/40 relative hover:bg-slate-50/80 transition-colors">
                            {bannerPreviewUrl ? (
                                <div className="w-full relative h-52 bg-slate-100 rounded-2xl overflow-hidden">
                                    <img src={bannerPreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    <label
                                        htmlFor="banner-upload"
                                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-700 px-4 py-2 rounded-xl cursor-pointer hover:bg-white shadow-md transition"
                                    >
                                        Replace Image
                                    </label>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                                    <p className="text-sm font-semibold text-slate-700">Upload Banner Image</p>
                                    <p className="text-xs text-slate-400 mt-1 mb-4">PNG, JPG up to 5MB</p>
                                    <label
                                        htmlFor="banner-upload"
                                        className="inline-block bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-slate-800 transition"
                                    >
                                        Select File
                                    </label>
                                </div>
                            )}
                            <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2 — Descriptions */}
                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Descriptions</h2>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Short Description *</label>
                        <input
                            type="text"
                            required
                            maxLength={500}
                            placeholder="Provide a concise 1-2 sentence overview of the event."
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Detailed Description *</label>
                        <textarea
                            required
                            rows={7}
                            placeholder="Provide details such as timelines, speakers, prerequisites, rules, and expectations."
                            value={detailedDescription}
                            onChange={(e) => setDetailedDescription(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Section 3 — Scheduling */}
                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Scheduling &amp; Duration</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Start Date *</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="date"
                                    required
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">End Date (Optional)</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Registration Deadline (Optional)</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="date"
                                    value={registrationDeadline}
                                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Start Time *</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="time"
                                    required
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">End Time *</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="time"
                                    required
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4 — Location & Links */}
                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Location &amp; Links</h2>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Location / Venue *</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                required
                                placeholder="e.g. Online, Seminar Hall A, Ahmedabad"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">External Registration Link (Optional)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="url"
                                    placeholder="e.g. https://unstop.com/..."
                                    value={registrationLink}
                                    onChange={(e) => setRegistrationLink(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Google Maps Embed Link (Optional)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="url"
                                    placeholder="Use the 'Embed a map' URL from Google Maps"
                                    value={mapLink}
                                    onChange={(e) => setMapLink(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5 — Tags & Milestones */}
                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 sm:p-8 space-y-6">
                    <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Tags &amp; Milestones</h2>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Tags (Comma-separated)</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="e.g. React, Coding, Competition"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Custom Milestones */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Custom Milestone Dates (Optional)</p>
                                <p className="text-xs text-slate-400 mt-0.5">Add dates like Round 1, Orientation, or results release.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddCustomDate}
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                            >
                                <Plus size={12} /> Add Date
                            </button>
                        </div>
                        <div className="space-y-3">
                            {customDates.map((item, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="e.g. Round 1 Ends"
                                            value={item.label}
                                            onChange={(e) => handleCustomDateChange(index, "label", e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-xs text-slate-700"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            value={item.date}
                                            onChange={(e) => handleCustomDateChange(index, "date", e.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-xs text-slate-700"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCustomDate(index)}
                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Submission Actions */}
                <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer shadow-md disabled:bg-slate-300"
                    >
                        <Rocket size={16} />
                        {loading ? "Saving..." : isEditMode ? "Save Changes" : "Publish Event"}
                    </button>
                </div>

            </form>
        </div>
    );
}

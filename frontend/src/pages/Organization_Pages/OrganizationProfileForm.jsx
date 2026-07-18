import { useState, useEffect } from "react";
import {
    submit_organization_profile,
} from "../../api/organization_apis";
import {
    FaBuilding, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaInstagram, FaTwitter,
    FaUser, FaPhone, FaArrowRight, FaArrowLeft, FaCheck, FaRocket, FaTimes, FaCamera, FaExclamationCircle
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { fetch_organization_profile } from "../../api/public_apis";


const STEPS = [
    { id: 1, title: "Organization", description: "Basic details" },
    { id: 2, title: "Location & Contact", description: "Where to find you" },
    { id: 3, title: "Social Links", description: "Connect your channels" },
];

// ── Validators ───────────────────────────────────────────────────────────────
function validateStep1(formData) {
    const errs = {};
    if (!formData.industry.trim()) errs.industry = "Industry is required.";
    if (!formData.description.trim()) errs.description = "Description is required.";
    else if (formData.description.trim().length < 20) errs.description = "Description must be at least 20 characters.";
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website))
        errs.website = "Enter a valid URL (e.g. https://example.com).";
    return errs;
}

function validateStep2(formData) {
    const errs = {};
    if (!formData.city.trim()) errs.city = "City is required.";
    if (!formData.state.trim()) errs.state = "State is required.";
    if (!formData.country.trim()) errs.country = "Country is required.";
    if (!formData.contact_person.trim()) errs.contact_person = "Contact person name is required.";
    if (!formData.phone_number.trim()) errs.phone_number = "Phone number is required.";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone_number.trim()))
        errs.phone_number = "Enter a valid phone number.";
    return errs;
}

function validateStep3(formData) {
    const errs = {};
    const urlRe = /^https?:\/\/.+\..+/;
    if (formData.linkedin && !urlRe.test(formData.linkedin)) errs.linkedin = "Enter a valid LinkedIn URL.";
    if (formData.instagram && !urlRe.test(formData.instagram)) errs.instagram = "Enter a valid Instagram URL.";
    if (formData.twitter && !urlRe.test(formData.twitter)) errs.twitter = "Enter a valid Twitter/X URL.";
    return errs;
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
function ProgressBar({ currentStep }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0 mx-10"></div>
                <div
                    className="absolute top-5 left-0 h-0.5 bg-indigo-500 z-0 mx-10 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, maxWidth: 'calc(100% - 5rem)' }}
                ></div>

                {STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center z-10 relative">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-2 ${
                                currentStep > step.id
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : currentStep === step.id
                                    ? "bg-white border-indigo-500 text-indigo-600 scale-110 shadow-lg shadow-indigo-500/20"
                                    : "bg-white border-slate-200 text-slate-400"
                            }`}
                        >
                            {currentStep > step.id ? <FaCheck className="text-[10px]" /> : step.id}
                        </div>
                        <p className={`mt-1.5 text-[10px] font-bold transition-colors duration-300 ${
                            currentStep >= step.id ? "text-indigo-700" : "text-slate-400"
                        }`}>
                            {step.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── FieldError ────────────────────────────────────────────────────────────────
function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium animate-[fadeIn_0.2s_ease-out]">
            <FaExclamationCircle className="flex-shrink-0" />
            {msg}
        </p>
    );
}

// ── Shared input style helpers ─────────────────────────────────────────────────
function inputCls(hasError) {
    return `w-full rounded-xl border ${hasError ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-indigo-500/20"} py-2.5 px-4 outline-none focus:bg-white focus:ring-2 transition-all text-sm`;
}
function inputIconCls(hasError) {
    return `w-full rounded-xl border ${hasError ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-indigo-500/20"} py-2.5 pl-11 pr-4 outline-none focus:bg-white focus:ring-2 transition-all text-sm`;
}

// ── InputField wrapper ─────────────────────────────────────────────────────────
function InputField({ label, icon: Icon, error, children }) {
    return (
        <div className="flex flex-col gap-0">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{label}</label>
            {Icon ? (
                <div className="relative group">
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-500"}`} />
                    {children}
                </div>
            ) : children}
            <FieldError msg={error} />
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function OrganizationProfileForm({ isOpen, isCompulsory, onClose, onSuccess, initialData }) {
    const { organization_name } = useParams();
    if (!isOpen) return null;

    const isEditMode = !!initialData;

    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        industry: "",
        description: "",
        contact_person: "",
        phone_number: "",
        website: "",
        country: "",
        state: "",
        city: "",
        linkedin: "",
        instagram: "",
        twitter: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                industry: initialData.industry || "",
                description: initialData.description || "",
                contact_person: initialData.contact_person || "",
                phone_number: initialData.phone_number || "",
                website: initialData.website || "",
                country: initialData.country || "",
                state: initialData.state || "",
                city: initialData.city || "",
                linkedin: initialData.linkedin || "",
                instagram: initialData.instagram || "",
                twitter: initialData.twitter || "",
            });
            setPreview(initialData.profile_pic || null);
        } else {
            setFormData({
                industry: "", description: "", contact_person: "",
                phone_number: "", website: "", country: "",
                state: "", city: "", linkedin: "", instagram: "", twitter: "",
            });
            setPreview(null);
            setImage(null);
        }
        setCurrentStep(1);
        setFieldErrors({});
        setServerError({});
        setTouched({});
        setSuccess(null);
    }, [initialData, isOpen]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field error as user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        // Re-validate the individual field on blur
        const all = currentStep === 1 ? validateStep1(formData)
            : currentStep === 2 ? validateStep2(formData)
            : validateStep3(formData);
        setFieldErrors(prev => ({ ...prev, [name]: all[name] }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const nextStep = () => {
        const errs = currentStep === 1 ? validateStep1(formData)
            : validateStep2(formData);
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            // Mark all fields on this step as touched so errors show immediately
            setTouched(prev => {
                const t = { ...prev };
                Object.keys(errs).forEach(k => (t[k] = true));
                return t;
            });
            return;
        }
        setFieldErrors({});
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setFieldErrors({});
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        const errs = validateStep3(formData);
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            setTouched(prev => {
                const t = { ...prev };
                Object.keys(errs).forEach(k => (t[k] = true));
                return t;
            });
            return;
        }

        setSubmitting(true);
        setServerError({});
        setSuccess(null);

        const submitData = new FormData();
        if (image) submitData.append("profile_pic", image);
        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        try {
            const response = await submit_organization_profile(submitData, organization_name);
            setSuccess(response.message || "Profile saved successfully!");
            const profile = await fetch_organization_profile(organization_name);
            setTimeout(() => {
                onSuccess(profile);
                onClose();
            }, 800);
        } catch (err) {
            console.log("Submit error:", err);
            const errorData = err?.response?.data || err;
            if (typeof errorData === "object" && errorData !== null) {
                setServerError(errorData);
            } else {
                setServerError({ server: typeof errorData === "string" ? errorData : "Something went wrong." });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const fe = fieldErrors; // alias

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative animate-[slideIn_0.3s_ease-out]">

                {/* Close Button */}
                {!isCompulsory && (
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 hover:bg-slate-50 rounded-lg"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold mb-2">
                        <FaRocket className="text-[8px]" />
                        {isCompulsory ? "Action Required" : isEditMode ? "Edit Profile" : `Step ${currentStep} of ${STEPS.length}`}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {isEditMode ? "Edit Organization Profile" : "Complete Organization Profile"}
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium text-xs">
                        {isCompulsory
                            ? "Please complete your profile details to proceed to the platform."
                            : "Provide details about your organization to connect with student talent."}
                    </p>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} />

                {/* Server Error Banner */}
                {Object.keys(serverError).length > 0 && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2 animate-[fadeIn_0.3s_ease-out]">
                        <FaExclamationCircle className="mt-0.5 flex-shrink-0 text-sm" />
                        <span>{serverError.server || serverError.detail || serverError.error || "Please correct the errors below."}</span>
                    </div>
                )}

                {/* Success Banner */}
                {success && (
                    <div className="mb-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                        <FaCheck /> {success}
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()}>

                    {/* ── Step 1: Organization Details ── */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">
                                    <FaBuilding />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Organization Details</h3>
                                    <p className="text-[10px] text-slate-400">Basic information about your organization</p>
                                </div>
                            </div>

                            {/* Avatar upload */}
                            <div className="flex flex-col items-center gap-3">
                                <label className="relative group cursor-pointer">
                                    <div className={`w-28 h-28 rounded-full overflow-hidden border-4 ${preview ? "border-indigo-400" : "border-indigo-100"} bg-slate-100 shadow-md transition-all`}>
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                                <FaBuilding className="text-4xl text-indigo-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-700 transition-all group-hover:scale-110">
                                        <FaCamera className="text-sm" />
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                <p className="text-[11px] text-slate-400 font-medium">Click the avatar to upload your logo / profile picture</p>
                                <FieldError msg={serverError.profile_pic} />
                            </div>

                            {/* Industry */}
                            <InputField label="Industry *" error={touched.industry ? fe.industry : undefined}>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. Software, Finance, Healthcare"
                                    className={inputCls(touched.industry && fe.industry)}
                                />
                            </InputField>

                            {/* Description */}
                            <InputField label="Organization Description *" error={touched.description ? fe.description : undefined}>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Tell us about your organization's mission, goals, and what you offer..."
                                    className={inputCls(touched.description && fe.description) + " resize-none"}
                                ></textarea>
                            </InputField>

                            {/* Website */}
                            <InputField label="Website URL" icon={FaGlobe} error={touched.website ? fe.website : undefined}>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="https://your-company.com"
                                    className={inputIconCls(touched.website && fe.website)}
                                />
                            </InputField>
                        </div>
                    )}

                    {/* ── Step 2: Location & Contact ── */}
                    {currentStep === 2 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Location & Contact</h3>
                                    <p className="text-[10px] text-slate-400">Where your headquarters is and who to reach</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <InputField label="City *" error={touched.city ? fe.city : undefined}>
                                    <input type="text" name="city" value={formData.city}
                                        onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., Mumbai"
                                        className={inputCls(touched.city && fe.city)} />
                                </InputField>
                                <InputField label="State *" error={touched.state ? fe.state : undefined}>
                                    <input type="text" name="state" value={formData.state}
                                        onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., MH"
                                        className={inputCls(touched.state && fe.state)} />
                                </InputField>
                                <InputField label="Country *" error={touched.country ? fe.country : undefined}>
                                    <input type="text" name="country" value={formData.country}
                                        onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., India"
                                        className={inputCls(touched.country && fe.country)} />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Contact Person *" icon={FaUser} error={touched.contact_person ? fe.contact_person : undefined}>
                                    <input type="text" name="contact_person" value={formData.contact_person}
                                        onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., Jane Doe"
                                        className={inputIconCls(touched.contact_person && fe.contact_person)} />
                                </InputField>
                                <InputField label="Phone Number *" icon={FaPhone} error={touched.phone_number ? fe.phone_number : undefined}>
                                    <input type="tel" name="phone_number" value={formData.phone_number}
                                        onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., +91 9876543210"
                                        className={inputIconCls(touched.phone_number && fe.phone_number)} />
                                </InputField>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Social Links ── */}
                    {currentStep === 3 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">
                                    <FaLinkedin />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Social Channels</h3>
                                    <p className="text-[10px] text-slate-400">Optional — connect with students online</p>
                                </div>
                            </div>

                            <InputField label="LinkedIn URL" icon={FaLinkedin} error={touched.linkedin ? fe.linkedin : undefined}>
                                <input type="text" name="linkedin" value={formData.linkedin}
                                    onChange={handleChange} onBlur={handleBlur}
                                    placeholder="https://linkedin.com/company/acme"
                                    className={inputIconCls(touched.linkedin && fe.linkedin)} />
                            </InputField>

                            <InputField label="Instagram URL" icon={FaInstagram} error={touched.instagram ? fe.instagram : undefined}>
                                <input type="text" name="instagram" value={formData.instagram}
                                    onChange={handleChange} onBlur={handleBlur}
                                    placeholder="https://instagram.com/acme"
                                    className={inputIconCls(touched.instagram && fe.instagram)} />
                            </InputField>

                            <InputField label="Twitter (X) URL" icon={FaTwitter} error={touched.twitter ? fe.twitter : undefined}>
                                <input type="text" name="twitter" value={formData.twitter}
                                    onChange={handleChange} onBlur={handleBlur}
                                    placeholder="https://x.com/acme"
                                    className={inputIconCls(touched.twitter && fe.twitter)} />
                            </InputField>

                            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                                <p className="text-[11px] text-indigo-700 font-medium text-center">
                                    🎉 Almost done! Click <strong>Save Profile</strong> to publish your organization profile.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Navigation Buttons ── */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <FaArrowLeft className="text-[10px]" /> Back
                            </button>
                        ) : <div />}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                            >
                                Next <FaArrowRight className="text-[10px]" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {submitting ? "Saving..." : "Save Profile"}
                                {!submitting && <FaCheck className="text-[10px]" />}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
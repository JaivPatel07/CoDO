import { useState, useEffect } from "react";
import {
    fetch_organization_profile,
    submit_organization_profile,
} from "../../api/organization_apis";
import {
    FaBuilding, FaMapMarkerAlt, FaGlobe, FaLinkedin, FaInstagram, FaTwitter,
    FaUser, FaPhone, FaLink, FaArrowRight, FaArrowLeft, FaCheck, FaRocket, FaTimes
} from "react-icons/fa";

// function submit_organization_profile(formData) {
//     const token = localStorage.getItem('access');
//     return fetch('http://127.0.0.1:8000/api/organization/profile/', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//         body: formData,
//     }).then(res => {
//         if (!res.ok) {
//             return res.json().then(err => { throw err });
//         }
//         return res.json();
//     });
// }

const STEPS = [
    { id: 1, title: "Organization", description: "Basic details" },
    { id: 2, title: "Location & Contact", description: "Where to find you" },
    { id: 3, title: "Social Links", description: "Connect your channels" },
];

function ProgressBar({ currentStep }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                {/* Background Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0 mx-10"></div>
                {/* Progress Line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-emerald-500 z-0 mx-10 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, maxWidth: 'calc(100% - 5rem)' }}
                ></div>

                {STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center z-10 relative">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-2 ${
                                currentStep > step.id
                                    ? "bg-emerald-500 border-emerald-500 text-white scale-100"
                                    : currentStep === step.id
                                    ? "bg-white border-emerald-500 text-emerald-600 scale-110 shadow-lg shadow-emerald-500/20"
                                    : "bg-white border-slate-200 text-slate-400"
                            }`}
                        >
                            {currentStep > step.id ? <FaCheck className="text-[10px]" /> : step.id}
                        </div>
                        <p className={`mt-1.5 text-[10px] font-bold transition-colors duration-300 ${
                            currentStep >= step.id ? "text-emerald-700" : "text-slate-400"
                        }`}>
                            {step.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function InputField({ label, icon: Icon, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
            {Icon ? (
                <div className="relative group">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    {children}
                </div>
            ) : children}
        </div>
    );
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm";
const inputWithIconClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm";

export default function OrganizationProfileForm({ isOpen, isCompulsory, onClose, onSuccess, initialData }) {
    if (!isOpen) return null;

    const isEditMode = !!initialData;

    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        industry: "",
        profile_pic: "", // This was 'logo' before
        description: "", // This was 'organization_type' before
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
                profile_pic: initialData.profile_pic || "",
                description: initialData.description || "",
                contact_person: initialData.contact_person || "",
                phone_number: initialData.phone_number || "",
                website: initialData.website || "",
                country: initialData.country || "",
                state: initialData.state || "",
                city: initialData.city || "",
                linkedin: initialData.linkedin || "",
                instagram: initialData.instagram || "",
                twitter: initialData.twitter || ""
            });
            
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setError(null);
        if (currentStep < 3) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError(null);
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const submitData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        for (const [key, value] of submitData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await submit_organization_profile(submitData);

            setSuccess(response.message);

            const profile = await fetch_organization_profile();

            setTimeout(() => {
                onSuccess(profile);
                onClose();
            }, 800);

        } catch (err) {
            setError(
                err.error ||
                err.detail ||
                "Something went wrong."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
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
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold mb-2">
                        <FaRocket className="text-[8px]" />
                        {isCompulsory ? "Action Required" : isEditMode ? "Edit Profile" : `Step ${currentStep} of ${STEPS.length}`}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                         Complete Organization Profile
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium text-xs">
                        {isCompulsory 
                            ? "Please complete your profile details to proceed to the platform."
                            : "Provide details about your organization to connect with student talent."}
                    </p>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} />

                {/* Alerts */}
                {error && (
                    <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-center font-semibold text-xs animate-[fadeIn_0.3s_ease-out]">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-center font-semibold text-xs flex items-center justify-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                        <FaCheck /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Organization Details */}
                    {currentStep === 1 && (
                        <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">
                                    <FaBuilding />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Organization Details</h3>
                                    <p className="text-[10px] text-slate-400">Basic information about your organization</p>
                                </div>
                            </div>

                            <InputField label="Industry">
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    placeholder="e.g. Software, Finance, Healthcare"
                                    required
                                    className={inputClass}
                                />
                            </InputField>

                            <InputField label="Profile Image URL" icon={FaLink}>
                                <input
                                    type="url" name="profile_pic"
                                    value={formData.profile_pic} onChange={handleChange}
                                    placeholder="https://example.com/logo.png"
                                    className={inputWithIconClass}
                                />
                            </InputField>

                            <InputField label="Description">
                                <textarea
                                    name="description" rows="3"
                                    value={formData.description} onChange={handleChange}
                                    placeholder="Tell us about your organization's mission, goals, and what you offer..."
                                    required
                                    className={inputClass + " resize-none"}
                                ></textarea>
                            </InputField>

                            <InputField label="Website URL" icon={FaGlobe}>
                                <input
                                    type="url" name="website"
                                    value={formData.website} onChange={handleChange}
                                    placeholder="https://your-company.com"
                                    className={inputWithIconClass}
                                />
                            </InputField>
                        </div>
                    )}

                    {/* Step 2: Location & Contact */}
                    {currentStep === 2 && (
                        <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Location & Contact</h3>
                                    <p className="text-[10px] text-slate-400">Where your headquarters is and who to reach</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <InputField label="City">
                                    <input
                                        type="text" name="city"
                                        value={formData.city} onChange={handleChange}
                                        placeholder="e.g., Mumbai" required
                                        className={inputClass}
                                    />
                                </InputField>
                                <InputField label="State">
                                    <input
                                        type="text" name="state"
                                        value={formData.state} onChange={handleChange}
                                        placeholder="e.g., MH" required
                                        className={inputClass}
                                    />
                                </InputField>
                                <InputField label="Country">
                                    <input
                                        type="text" name="country"
                                        value={formData.country} onChange={handleChange}
                                        placeholder="e.g., India" required
                                        className={inputClass}
                                    />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <InputField label="Contact Person" icon={FaUser}>
                                    <input
                                        type="text" name="contact_person"
                                        value={formData.contact_person} onChange={handleChange}
                                        placeholder="e.g., Jane Doe" required
                                        className={inputWithIconClass}
                                    />
                                </InputField>
                                <InputField label="Phone Number" icon={FaPhone}>
                                    <input
                                        type="tel" name="phone_number"
                                        value={formData.phone_number} onChange={handleChange}
                                        placeholder="e.g., +91 9876543210" required
                                        className={inputWithIconClass}
                                    />
                                </InputField>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Social Links */}
                    {currentStep === 3 && (
                        <div className="space-y-4 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-sm">
                                    <FaLinkedin />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Social Channels</h3>
                                    <p className="text-[10px] text-slate-400">Optional — connect with students online</p>
                                </div>
                            </div>

                            <InputField label="LinkedIn URL" icon={FaLinkedin}>
                                <input
                                    type="url" name="linkedin"
                                    value={formData.linkedin} onChange={handleChange}
                                    placeholder="https://linkedin.com/company/acme"
                                    className={inputWithIconClass}
                                />
                            </InputField>

                            <InputField label="Instagram URL" icon={FaInstagram}>
                                <input
                                    type="url" name="instagram"
                                    value={formData.instagram} onChange={handleChange}
                                    placeholder="https://instagram.com/acme"
                                    className={inputWithIconClass}
                                />
                            </InputField>

                            <InputField label="Twitter (X) URL" icon={FaTwitter}>
                                <input
                                    type="url" name="twitter"
                                    value={formData.twitter} onChange={handleChange}
                                    placeholder="https://x.com/acme"
                                    className={inputWithIconClass}
                                />
                            </InputField>

                            <div className="pt-1.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                <p className="text-[10px] text-emerald-700 font-medium text-center">
                                    🎉 All details look good! Click <strong>Save Profile</strong> to apply.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <FaArrowLeft className="text-[10px]" /> Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                            >
                                Next <FaArrowRight className="text-[10px]" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
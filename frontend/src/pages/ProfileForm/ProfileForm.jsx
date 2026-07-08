import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submit_profile } from "../../api/user_apis";
import { UserContext } from "../../contextAPI/userContext";
import {
    FaUser, FaMapMarkerAlt, FaGraduationCap, FaCode, FaLink,
    FaLinkedin, FaGithub, FaArrowRight, FaArrowLeft, FaCheck,
    FaRocket, FaTimes, FaCamera, FaPhone, FaBriefcase
} from "react-icons/fa";

// ── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: "Basic Info",     description: "Personal details" },
    { id: 2, title: "Education",      description: "Your academic background" },
    { id: 3, title: "Skills & Role",  description: "What you're good at" },
    { id: 4, title: "Links",          description: "Your online presence" },
];

const ALL_SKILLS = [
    "React", "Next.js", "Vue", "Angular", "JavaScript", "TypeScript",
    "Node.js", "Express", "Python", "Django", "Flask", "Java",
    "Spring Boot", "C", "C++", "C#", "PHP", "Laravel", "MySQL",
    "PostgreSQL", "MongoDB", "Firebase", "Docker", "Kubernetes",
    "AWS", "Git", "Tailwind CSS", "Bootstrap",
];

const EXPERIENCE_LEVELS = ["Student", "Beginner", "Intermediate", "Professional"];
const PREFERRED_ROLES = [
    "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "UI/UX Designer", "Mobile Developer", "AI / ML Engineer",
];

// ── Shared input styles ───────────────────────────────────────────────────────
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm";
const inputWithIconClass = "w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm";

function InputField({ label, icon: Icon, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
            {Icon ? (
                <div className="relative group">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-sm" />
                    {children}
                </div>
            ) : children}
        </div>
    );
}

function ProgressBar({ currentStep }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                {/* bg line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0 mx-6"></div>
                {/* progress line */}
                <div
                    className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 mx-6 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, maxWidth: "calc(100% - 3rem)" }}
                ></div>

                {STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center z-10 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-2 ${
                            currentStep > step.id
                                ? "bg-indigo-500 border-indigo-500 text-white"
                                : currentStep === step.id
                                ? "bg-white border-indigo-500 text-indigo-600 scale-110 shadow-lg shadow-indigo-500/20"
                                : "bg-white border-slate-200 text-slate-400"
                        }`}>
                            {currentStep > step.id ? <FaCheck className="text-[9px]" /> : step.id}
                        </div>
                        <p className={`mt-1.5 text-[10px] font-bold hidden sm:block transition-colors ${
                            currentStep >= step.id ? "text-indigo-700" : "text-slate-400"
                        }`}>{step.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfileForm({ isOpen, isCompulsory, onClose, onSuccess, initialData }) {
    if (!isOpen) return null;

    const { userData } = useContext(UserContext);
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [image, setImage]             = useState(null);
    const [preview, setPreview]         = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const [form, setForm] = useState({
        firstname: "", lastname: "", phone: "",
        country: "", state: "", city: "",
        college: "", degree: "", school: "", graduation_year: "",
        bio: "", experience: "Student", preferred_role: "Frontend Developer",
        git_link: "", linkedin_link: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                firstname: initialData.firstname || "",
                lastname: initialData.lastname || "",
                phone: initialData.phone || "",
                country: initialData.country || "",
                state: initialData.state || "",
                city: initialData.city || "",
                college: initialData.college || "",
                degree: initialData.degree || "",
                school: initialData.school || "",
                graduation_year: initialData.graduation_year || "",
                bio: initialData.bio || "",
                experience: initialData.experience || "Student",
                preferred_role: initialData.preferred_role || "Frontend Developer",
                git_link: initialData.git_link || "",
                linkedin_link: initialData.linkedin_link || "",
            });
            setSelectedSkills(initialData.selectedSkills || []);
            setPreview(initialData.profile_pic || null);
        } else {
            setForm({
                firstname: "", lastname: "", phone: "",
                country: "", state: "", city: "",
                college: "", degree: "", school: "", graduation_year: "",
                bio: "", experience: "Student", preferred_role: "Frontend Developer",
                git_link: "", linkedin_link: "",
            });
            setSelectedSkills([]);
            setPreview(null);
        }
        setCurrentStep(1);
        setError(null);
        setSuccess(null);
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const addSkill = (skill) => {
        if (skill && !selectedSkills.includes(skill)) setSelectedSkills(prev => [...prev, skill]);
    };
    const removeSkill = (skill) => setSelectedSkills(prev => prev.filter(s => s !== skill));

    const nextStep = () => { setError(null); if (currentStep < 4) setCurrentStep(p => p + 1); };
    const prevStep = () => { setError(null); if (currentStep > 1) setCurrentStep(p => p - 1); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedSkills.length === 0) { setError("Please select at least one skill."); return; }
        setError(null); setSuccess(null); setSubmitting(true);

        const formData = new FormData();
        if (image) formData.append("profile_pic", image);
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        formData.append("selectedSkills", JSON.stringify(selectedSkills));

        try {
            const response = await submit_profile(formData);
            setSuccess(response.data.message || "Profile saved successfully!");
            setTimeout(() => {
                if (onSuccess) onSuccess(response.data.profile || response.data);
                if (onClose) onClose();
            }, 1200);
        } catch (err) {
            const errData = err?.response?.data;
            let msg = "An error occurred.";
            if (errData) {
                if (typeof errData === "string") {
                    if (errData.trim().startsWith("<")) {
                        msg = `Server error (${err.response.status}): Please check backend console.`;
                    } else {
                        msg = errData;
                    }
                } else if (typeof errData === "object") {
                    const firstErr = Object.values(errData)[0];
                    msg = Array.isArray(firstErr) ? firstErr[0] : JSON.stringify(firstErr);
                }
            }
            setError(msg.replace(/['"[\]]/g, ""));
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
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 hover:bg-slate-50 rounded-lg"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                )}

                {/* Page header */}
                <div className="text-center mb-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold mb-3">
                        <FaRocket className="text-[8px]" /> {isCompulsory ? "Action Required" : initialData ? "Edit Profile" : `Step ${currentStep} of ${STEPS.length}`}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {initialData ? "Update Your Profile" : "Complete Your Profile"}
                    </h2>
                    <p className="text-slate-500 mt-1.5 text-xs font-medium">
                        {isCompulsory 
                            ? "Please complete your student profile details to proceed to the platform."
                            : "A complete profile helps you connect with organizations and find amazing opportunities."}
                    </p>
                </div>

                <div className="mt-6">
                    <ProgressBar currentStep={currentStep} />
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-center font-semibold text-xs animate-[fadeIn_0.3s_ease-out]">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-center font-semibold text-xs flex items-center justify-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                        <FaCheck /> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* ── STEP 1: Basic Info ── */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FaUser /></div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Basic Information</h3>
                                    <p className="text-[10px] text-slate-400">Your personal contact details</p>
                                </div>
                            </div>

                            {/* Avatar upload */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-2xl bg-indigo-50 border-2 border-dashed border-indigo-200 overflow-hidden flex items-center justify-center">
                                        {preview
                                            ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                            : <FaCamera className="text-2xl text-indigo-300" />
                                        }
                                    </div>
                                </div>
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                                    <FaCamera className="text-slate-400" /> Upload Photo
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="First Name" icon={FaUser}>
                                    <input name="firstname" value={form.firstname} onChange={handleChange}
                                        placeholder="e.g., Jaiv" required className={inputWithIconClass} />
                                </InputField>
                                <InputField label="Last Name" icon={FaUser}>
                                    <input name="lastname" value={form.lastname} onChange={handleChange}
                                        placeholder="e.g., Patel" required className={inputWithIconClass} />
                                </InputField>
                            </div>

                            <InputField label="Email">
                                <input type="email" value={userData?.email ?? ""} disabled
                                    className={inputClass + " opacity-60 cursor-not-allowed bg-slate-100"} />
                            </InputField>

                            <InputField label="Phone Number" icon={FaPhone}>
                                <input name="phone" value={form.phone} onChange={handleChange}
                                    placeholder="10-digit number" required className={inputWithIconClass} />
                            </InputField>
                        </div>
                    )}

                    {/* ── STEP 2: Education & Location ── */}
                    {currentStep === 2 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FaGraduationCap /></div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Education & Location</h3>
                                    <p className="text-[10px] text-slate-400">Where you studied and where you are</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <InputField label="Country">
                                    <input name="country" value={form.country} onChange={handleChange}
                                        placeholder="India" required className={inputClass} />
                                </InputField>
                                <InputField label="State">
                                    <input name="state" value={form.state} onChange={handleChange}
                                        placeholder="Gujarat" required className={inputClass} />
                                </InputField>
                                <InputField label="City">
                                    <input name="city" value={form.city} onChange={handleChange}
                                        placeholder="Ahmedabad" required className={inputClass} />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <InputField label="College / University">
                                    <input name="college" value={form.college} onChange={handleChange}
                                        placeholder="ABC Engineering College" required className={inputClass} />
                                </InputField>
                                <InputField label="Degree">
                                    <input name="degree" value={form.degree} onChange={handleChange}
                                        placeholder="B.Tech Computer Engineering" className={inputClass} />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="School">
                                    <input name="school" value={form.school} onChange={handleChange}
                                        placeholder="XYZ High School" required className={inputClass} />
                                </InputField>
                                <InputField label="Graduation Year">
                                    <input type="number" name="graduation_year" value={form.graduation_year} onChange={handleChange}
                                        placeholder="2026" required className={inputClass} />
                                </InputField>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Skills & Role ── */}
                    {currentStep === 3 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FaCode /></div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Skills & Developer Role</h3>
                                    <p className="text-[10px] text-slate-400">What you know and what you want to do</p>
                                </div>
                            </div>

                            <InputField label="Bio">
                                <textarea name="bio" rows="3" value={form.bio} onChange={handleChange}
                                    placeholder="Tell us about yourself, your goals, what excites you..."
                                    required className={inputClass + " resize-none"}></textarea>
                            </InputField>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Experience Level">
                                    <select name="experience" value={form.experience} onChange={handleChange} className={inputClass}>
                                        {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                                    </select>
                                </InputField>
                                <InputField label="Preferred Role">
                                    <select name="preferred_role" value={form.preferred_role} onChange={handleChange} className={inputClass}>
                                        {PREFERRED_ROLES.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </InputField>
                            </div>

                            {/* Skills picker */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Skills</label>
                                <select
                                    className={inputClass}
                                    onChange={(e) => { addSkill(e.target.value); e.target.value = ""; }}
                                >
                                    <option value="">+ Add a skill</option>
                                    {ALL_SKILLS.filter(s => !selectedSkills.includes(s)).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>

                                <div className="flex flex-wrap gap-2 mt-1 min-h-[36px]">
                                    {selectedSkills.length === 0 && (
                                        <span className="text-xs text-slate-400 italic">No skills selected yet.</span>
                                    )}
                                    {selectedSkills.map(skill => (
                                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)}
                                                className="text-indigo-400 hover:text-indigo-700 transition cursor-pointer">
                                                <FaTimes className="text-[9px]" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Links ── */}
                    {currentStep === 4 && (
                        <div className="space-y-5 animate-[slideIn_0.35s_ease-out]">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600"><FaLink /></div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">Professional Links</h3>
                                    <p className="text-[10px] text-slate-400">Let organizations find your work</p>
                                </div>
                            </div>

                            <InputField label="GitHub URL" icon={FaGithub}>
                                <input type="url" name="git_link" value={form.git_link} onChange={handleChange}
                                    placeholder="https://github.com/username" className={inputWithIconClass} />
                            </InputField>

                            <InputField label="LinkedIn URL" icon={FaLinkedin}>
                                <input type="url" name="linkedin_link" value={form.linkedin_link} onChange={handleChange}
                                    placeholder="https://linkedin.com/in/username" className={inputWithIconClass} />
                            </InputField>

                            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                <p className="text-[10px] text-indigo-700 font-medium text-center">
                                    🎉 Almost done! Click <strong>Save Profile</strong> to publish your profile.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Navigation ── */}
                    <div className="flex items-center justify-between mt-6">
                        {currentStep > 1 ? (
                            <button type="button" onClick={prevStep}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer">
                                <FaArrowLeft className="text-[10px]" /> Back
                            </button>
                        ) : <div />}

                        {currentStep < 4 ? (
                            <button type="button" onClick={nextStep}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-[0.98] cursor-pointer">
                                Next <FaArrowRight className="text-[10px]" />
                            </button>
                        ) : (
                            <button type="submit" disabled={submitting}
                                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer">
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
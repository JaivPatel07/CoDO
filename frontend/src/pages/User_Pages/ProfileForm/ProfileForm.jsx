import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submit_profile } from "../../../api/user_apis";
import { UserContext } from "../../../contextAPI/userContext";
import {
    FaUser, FaMapMarkerAlt, FaGraduationCap, FaCode, FaLink,
    FaLinkedin, FaGithub, FaArrowRight, FaArrowLeft, FaCheck,
    FaRocket, FaTimes, FaCamera, FaPhone, FaExclamationCircle
} from "react-icons/fa";

// ── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: "Basic Info", description: "Personal details" },
    { id: 2, title: "Education", description: "Your academic background" },
    { id: 3, title: "Skills & Role", description: "What you're good at" },
    { id: 4, title: "Links", description: "Your online presence" },
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

// ── Validators ───────────────────────────────────────────────────────────────
function validateStep1(form) {
    const errs = {};
    if (!form.firstname.trim()) errs.firstname = "First Name is required.";
    if (!form.lastname.trim()) errs.lastname = "Last Name is required.";
    if (!form.phone.trim()) errs.phone = "Phone Number is required.";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim()))
        errs.phone = "Enter a valid phone number.";
    return errs;
}

function validateStep2(form) {
    const errs = {};
    if (!form.country.trim()) errs.country = "Country is required.";
    if (!form.state.trim()) errs.state = "State is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.college.trim()) errs.college = "College/University is required.";
    if (!form.school.trim()) errs.school = "School is required.";
    if (!form.degree.trim()) errs.degree = "Degree is required.";
    if (!form.graduation_year) errs.graduation_year = "Graduation Year is required.";
    return errs;
}

function validateStep3(form) {
    const errs = {};
    if (!form.bio.trim()) errs.bio = "Bio is required.";
    else if (form.bio.trim().length < 10) errs.bio = "Bio must be at least 10 characters.";
    return errs;
}

function validateStep4(form) {
    const errs = {};
    const urlRe = /^https?:\/\/.+\..+/;
    if (form.git_link && !urlRe.test(form.git_link)) errs.git_link = "Enter a valid GitHub URL.";
    if (form.linkedin_link && !urlRe.test(form.linkedin_link)) errs.linkedin_link = "Enter a valid LinkedIn URL.";
    if (form.portfolio_link && !urlRe.test(form.portfolio_link)) errs.portfolio_link = "Enter a valid Portfolio URL.";
    return errs;
}

// ── Shared UI Components ───────────────────────────────────────────────────────
function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5 font-medium animate-[fadeIn_0.2s_ease-out]">
            <FaExclamationCircle className="flex-shrink-0" />
            {msg}
        </p>
    );
}

function InputField({ label, icon: Icon, error, isRequired, children }) {
    return (
        <div className="flex flex-col gap-0.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex gap-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            {Icon ? (
                <div className="relative group">
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-sm ${error ? "text-red-400" : "text-slate-400 group-focus-within:text-indigo-500"}`} />
                    {children}
                </div>
            ) : children}
            <FieldError msg={error} />
        </div>
    );
}

const getInputClass = (hasError, hasIcon = false) => {
    const base = "w-full rounded-xl border py-2.5 outline-none focus:bg-white focus:ring-2 transition-all text-sm";
    const padding = hasIcon ? "pl-11 pr-4" : "px-4";
    const colors = hasError 
        ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20" 
        : "border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:ring-indigo-500/20";
    return `${base} ${padding} ${colors}`;
};

function ProgressBar({ currentStep }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0 mx-6"></div>
                <div
                    className="absolute top-4 left-0 h-0.5 bg-indigo-500 z-0 mx-6 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`, maxWidth: "calc(100% - 3rem)" }}
                ></div>

                {STEPS.map((step) => (
                    <div key={step.id} className="flex flex-col items-center z-10 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border-2 ${currentStep > step.id
                            ? "bg-indigo-500 border-indigo-500 text-white"
                            : currentStep === step.id
                                ? "bg-white border-indigo-500 text-indigo-600 scale-110 shadow-lg shadow-indigo-500/20"
                                : "bg-white border-slate-200 text-slate-400"
                            }`}>
                            {currentStep > step.id ? <FaCheck className="text-[9px]" /> : step.id}
                        </div>
                        <p className={`mt-1.5 text-[10px] font-bold hidden sm:block transition-colors ${currentStep >= step.id ? "text-indigo-700" : "text-slate-400"
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
    const [serverError, setServerError] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [success, setSuccess] = useState(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const [form, setForm] = useState({
        firstname: "", lastname: "", phone: "",
        country: "", state: "", city: "",
        college: "", degree: "", school: "", graduation_year: "",
        bio: "", experience: "Student", preferred_role: "Frontend Developer", // prettier-ignore
        git_link: "", linkedin_link: "", portfolio_link: "",
    });

    const [formData, setFormData] = useState({
        firstname: "", lastname: "", phone: "",
        country: "", state: "", city: "",
        college: "", degree: "", school: "", graduation_year: "",
        bio: "", experience: "Student", preferred_role: "Frontend Developer",
        git_link: initialData?.git_link || "",
        portfolio_link: initialData?.portfolio_link || "",
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
                preferred_role: initialData.preferred_role || "",
                git_link: initialData.git_link || "",
                linkedin_link: initialData.linkedin_link || "",
                portfolio_link: initialData.portfolio_link || "",
            });
            setSelectedSkills(initialData.selectedSkills || []);
            setPreview(initialData.profile_pic || null);
        } else {
            setForm({
                firstname: "", lastname: "", phone: "",
                country: "", state: "", city: "",
                college: "", degree: "", school: "", graduation_year: "",
                bio: "", experience: "Student", preferred_role: "Frontend Developer", // prettier-ignore
                git_link: "", linkedin_link: "", portfolio_link: "",
            });
            setSelectedSkills([]);
            setPreview(null);
        }
        setCurrentStep(1);
        setFieldErrors({});
        setServerError({});
        setTouched({});
        setSuccess(null);
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const all = currentStep === 1 ? validateStep1(form)
            : currentStep === 2 ? validateStep2(form)
            : currentStep === 3 ? validateStep3(form)
            : validateStep4(form);
        setFieldErrors(prev => ({ ...prev, [name]: all[name] }));
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

    const nextStep = () => {
        const errs = currentStep === 1 ? validateStep1(form)
            : currentStep === 2 ? validateStep2(form)
            : validateStep3(form);
            
        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            setTouched(prev => {
                const t = { ...prev };
                Object.keys(errs).forEach(k => (t[k] = true));
                return t;
            });
            return;
        }
        
        setFieldErrors({});
        if (currentStep < 4) setCurrentStep(p => p + 1);
    };
    
    const prevStep = () => { 
        setFieldErrors({});
        if (currentStep > 1) setCurrentStep(p => p - 1); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateStep4(form);
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
            const errData = err?.response;
            if (errData) {
                if (errData.status === 500) {
                    setServerError({ server: errData.statusText });
                } else {
                    setServerError(errData.data);
                }
            } else {
                setServerError({ server: "Server Error!!!" });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const fe = fieldErrors;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative animate-[slideIn_0.3s_ease-out] w-full max-w-2xl">

                {!isCompulsory && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition cursor-pointer p-1 hover:bg-slate-50 rounded-lg"
                    >
                        <FaTimes className="text-lg" />
                    </button>
                )}

                <div className="text-center mb-6">
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
                
                {Object.keys(serverError).length > 0 && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-center font-semibold text-xs flex flex-col items-center justify-center gap-1 animate-[fadeIn_0.3s_ease-out]">
                        <div className="flex items-center gap-2">
                            <FaExclamationCircle /> <span>{serverError.server || serverError.detail || serverError.error || (typeof serverError === 'string' ? serverError : "Please ensure all fields are correct.")}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-center font-semibold text-xs flex items-center justify-center gap-2 animate-[fadeIn_0.3s_ease-out]">
                        <FaCheck /> {success}
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()}>

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

                            <div className="flex flex-col items-center gap-4">
                                <label className="relative group cursor-pointer">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 bg-slate-100 shadow-md">
                                        {preview ? (
                                            <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                                                <FaUser className="text-5xl text-indigo-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-700 transition">
                                        <FaCamera />
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                <p className="text-xs text-slate-500">Click the avatar to upload a profile picture</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="First Name" icon={FaUser} error={fe.firstname} isRequired>
                                    <input name="firstname" value={form.firstname} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., John" className={getInputClass(fe.firstname, true)} />
                                </InputField>
                                <InputField label="Last Name" icon={FaUser} error={fe.lastname} isRequired>
                                    <input name="lastname" value={form.lastname} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="e.g., Doe" className={getInputClass(fe.lastname, true)} />
                                </InputField>
                            </div>

                            <InputField label="Email">
                                <input type="email" value={userData?.email ?? ""} disabled
                                    className={getInputClass(false) + " opacity-60 cursor-not-allowed bg-slate-100"} />
                            </InputField>

                            <InputField label="Phone Number" icon={FaPhone} error={fe.phone} isRequired>
                                <input name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="10-digit number" className={getInputClass(fe.phone, true)} />
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
                                <InputField label="Country" error={fe.country} isRequired>
                                    <input name="country" value={form.country} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="India" className={getInputClass(fe.country)} />
                                </InputField>
                                <InputField label="State" error={fe.state} isRequired>
                                    <input name="state" value={form.state} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="Gujarat" className={getInputClass(fe.state)} />
                                </InputField>
                                <InputField label="City" error={fe.city} isRequired>
                                    <input name="city" value={form.city} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="Ahmedabad" className={getInputClass(fe.city)} />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <InputField label="College / University" error={fe.college} isRequired>
                                    <input name="college" value={form.college} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="ABC Engineering College" className={getInputClass(fe.college)} />
                                </InputField>
                                <InputField label="Degree" error={fe.degree} isRequired>
                                    <input name="degree" value={form.degree} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="B.Tech Computer Engineering" className={getInputClass(fe.degree)} />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="School" error={fe.school} isRequired>
                                    <input name="school" value={form.school} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="XYZ High School" className={getInputClass(fe.school)} />
                                </InputField>
                                <InputField label="Graduation Year" error={fe.graduation_year} isRequired>
                                    <input type="number" name="graduation_year" value={form.graduation_year} onChange={handleChange} onBlur={handleBlur}
                                        placeholder="2026" className={getInputClass(fe.graduation_year)} min={new Date().getFullYear()} />
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

                            <InputField label="Bio" error={fe.bio} isRequired>
                                <textarea name="bio" rows="3" value={form.bio} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="Tell us about yourself, your goals, what excites you..."
                                    className={getInputClass(fe.bio) + " resize-none"}></textarea>
                            </InputField>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField label="Experience Level" error={fe.experience}>
                                    <select name="experience" value={form.experience} onChange={handleChange} onBlur={handleBlur} className={getInputClass(fe.experience)}>
                                        {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
                                    </select>
                                </InputField>
                                <InputField label="Preferred Role" error={fe.preferred_role}>
                                    <select name="preferred_role" value={form.preferred_role} onChange={handleChange} onBlur={handleBlur} className={getInputClass(fe.preferred_role)}>
                                        {PREFERRED_ROLES.map(r => <option key={r}>{r}</option>)}
                                    </select>
                                </InputField>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Skills</label>
                                <select className={getInputClass(false)} onChange={(e) => { addSkill(e.target.value); e.target.value = ""; }}>
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

                            <InputField label="GitHub URL" icon={FaGithub} error={fe.git_link}>
                                <input type="url" name="git_link" value={form.git_link} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="https://github.com/username" className={getInputClass(fe.git_link, true)} />
                            </InputField>

                            <InputField label="LinkedIn URL" icon={FaLinkedin} error={fe.linkedin_link}>
                                <input type="url" name="linkedin_link" value={form.linkedin_link} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="https://linkedin.com/in/username" className={getInputClass(fe.linkedin_link, true)} />
                            </InputField>

                            <InputField label="Portfolio URL" icon={FaLink} error={fe.portfolio_link}>
                                <input type="url" name="portfolio_link" value={form.portfolio_link} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="https://your-portfolio.com" className={getInputClass(fe.portfolio_link, true)} />
                            </InputField>

                            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                <p className="text-[10px] text-indigo-700 font-medium text-center">
                                    🎉 Almost done! Click <strong>Save Profile</strong> to publish your profile.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Navigation ── */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        {currentStep > 1 ? (
                            <button type="button" onClick={prevStep} disabled={submitting}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                <FaArrowLeft className="text-[10px]" /> Back
                            </button>
                        ) : <div />}

                        {currentStep < 4 ? (
                            <button type="button" onClick={nextStep}
                                disabled={Object.keys(currentStep === 1 ? validateStep1(form) : currentStep === 2 ? validateStep2(form) : validateStep3(form)).length > 0}
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                                Next <FaArrowRight className="text-[10px]" />
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} disabled={submitting || Object.keys(validateStep4(form)).length > 0}
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
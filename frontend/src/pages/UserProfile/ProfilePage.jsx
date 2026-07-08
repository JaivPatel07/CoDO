import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contextAPI/userContext";
import { fetch_profile } from "../../api/user_apis";
import { Link } from "react-router-dom";
import {
    FaUser, FaPhone, FaMapMarkerAlt, FaGraduationCap, FaSchool,
    FaCode, FaLinkedin, FaGithub, FaBriefcase, FaInfoCircle,
    FaPencilAlt, FaStar
} from "react-icons/fa";
import ProfileForm from "../ProfileForm/ProfileForm";

export default function ProfilePage() {
    const { userData } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch_profile();
                setProfile(res.data);
            } catch (err) {
                const msg = err?.response?.data?.message || err?.response?.data?.detail || "";
                if (msg.toLowerCase().includes("not found")) {
                    setProfile(null);
                } else {
                    setError(msg || "Failed to load profile.");
                }
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, []);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 mt-6">
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl text-red-700 flex items-center gap-3">
                    <FaInfoCircle className="flex-shrink-0 text-xl" />
                    <div>
                        <p className="font-bold">Error loading profile</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    /* ── No Profile Yet ── */
    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto px-4 text-center py-16">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center">
                    <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 text-3xl mb-4">
                        <FaUser />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">No profile yet</h2>
                    <p className="text-slate-500 mt-2 max-w-sm text-sm">
                        Complete your student profile to start connecting with organizations and opportunities.
                    </p>
                    <button
                        onClick={() => {
                            setIsCompulsory(true);
                            setIsFormOpen(true);
                        }}
                        className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg cursor-pointer"
                    >
                        Create Profile
                    </button>
                </div>

                <ProfileForm
                    isOpen={isFormOpen}
                    isCompulsory={isCompulsory}
                    onClose={() => {
                        if (!isCompulsory) setIsFormOpen(false);
                    }}
                    onSuccess={(newProfile) => {
                        setProfile(newProfile);
                        setIsFormOpen(false);
                        setIsCompulsory(false);
                    }}
                    initialData={profile}
                />
            </div>
        );
    }

    const fullName = [profile.firstname, profile.lastname].filter(Boolean).join(" ");
    const location = [profile.city, profile.state, profile.country].filter(Boolean).join(", ");

    /* ── Profile Display ── */
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.03)] overflow-hidden">

                {/* ── Banner Header ── */}
                <div className="min-h-52 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 relative flex items-end p-6 sm:p-8">
                    <div className="absolute inset-0 bg-black/15"></div>

                    <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-white">

                        {/* Left: Name + Meta */}
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
                                {fullName || userData?.username || "Student"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2.5">
                                {profile.preferred_role && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/10">
                                        <FaBriefcase className="text-xs" />
                                        {profile.preferred_role}
                                    </span>
                                )}
                                {location && (
                                    <span className="inline-flex items-center gap-1 text-xs text-indigo-100 font-semibold">
                                        <FaMapMarkerAlt className="text-indigo-300" />
                                        {location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Floating Avatar / Profile Pic */}
                        <div className="sm:absolute sm:right-8 sm:-bottom-5 flex-shrink-0 z-20">
                            {profile.profile_pic ? (
                                <img
                                    src={profile.profile_pic}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-2xl bg-indigo-50 border-4 border-white shadow-lg flex items-center justify-center text-indigo-600 text-5xl font-black">
                                    {(profile.firstname || userData?.username || "U").charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Card Body ── */}
                <div className="px-6 pb-8 sm:px-8 relative">

                    {/* Edit Button Row */}
                    <div className="pt-6 sm:pt-4 flex justify-between items-center border-b border-slate-100 pb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Profile</span>
                        <button
                            onClick={() => {
                                setIsCompulsory(false);
                                setIsFormOpen(true);
                            }}
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm text-xs cursor-pointer"
                        >
                            <FaPencilAlt className="text-[10px]" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mt-6 border-b border-slate-100 pb-6">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">About Me</h2>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{profile.bio}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {profile.selectedSkills?.length > 0 && (
                        <div className="mt-6 border-b border-slate-100 pb-6">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FaCode className="text-indigo-500" /> Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.selectedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
                                    >
                                        <FaStar className="text-[8px]" /> {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal / Contact */}
                        <div className="space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Details</h3>
                            {profile.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaPhone /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Phone</p>
                                        <p className="font-semibold text-slate-700">{profile.phone}</p>
                                    </div>
                                </div>
                            )}
                            {profile.experience && (
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaBriefcase /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Experience</p>
                                        <p className="font-semibold text-slate-700 leading-relaxed">{profile.experience}</p>
                                    </div>
                                </div>
                            )}
                            {profile.linkedin_link && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaLinkedin /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn</p>
                                        <a
                                            href={profile.linkedin_link} target="_blank" rel="noopener noreferrer"
                                            className="font-bold text-indigo-600 hover:text-indigo-700 text-xs truncate max-w-[200px] block"
                                        >
                                            {profile.linkedin_link.replace(/(^\w+:|^)\/\//, '')}
                                        </a>
                                    </div>
                                </div>
                            )}
                            {profile.git_link && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaGithub /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">GitHub</p>
                                        <a
                                            href={profile.git_link} target="_blank" rel="noopener noreferrer"
                                            className="font-bold text-indigo-600 hover:text-indigo-700 text-xs truncate max-w-[200px] block"
                                        >
                                            {profile.git_link.replace(/(^\w+:|^)\/\//, '')}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Education */}
                        <div className="space-y-3.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Education</h3>
                            {profile.college && (
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaGraduationCap /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">College</p>
                                        <p className="font-semibold text-slate-700">{profile.college}</p>
                                        {profile.degree && <p className="text-xs text-slate-500">{profile.degree}</p>}
                                        {profile.graduation_year && (
                                            <p className="text-xs text-slate-400">Class of {profile.graduation_year}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {profile.school && (
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaSchool /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">School</p>
                                        <p className="font-semibold text-slate-700">{profile.school}</p>
                                    </div>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Location</p>
                                        <p className="font-semibold text-slate-700">{location}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ProfileForm
                isOpen={isFormOpen}
                isCompulsory={isCompulsory}
                onClose={() => {
                    if (!isCompulsory) setIsFormOpen(false);
                }}
                onSuccess={(newProfile) => {
                    setProfile(newProfile);
                    setIsFormOpen(false);
                    setIsCompulsory(false);
                }}
                initialData={profile}
            />
        </div>
    );
}
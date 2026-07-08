import { useEffect, useState } from "react";
import { fetch_organization_profile } from "../../api/organization_apis";
import OrganizationProfileForm from "./OrganizationProfileForm";
import {
    FaBuilding,
    FaUser,
    FaPhone,
    FaGlobe,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaLinkedin,
    FaInstagram,
    FaTwitter,
    FaPencilAlt
} from 'react-icons/fa';

export default function OrganizationProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const data = await fetch_organization_profile();
                setProfile(data);
            } catch (err) {
                const errMsg = err.detail || err.error || "";
                if (errMsg.includes("not found")) {
                    setProfile(null);
                    setIsFormOpen(true);
                    setIsCompulsory(true);
                } else {
                    setError(errMsg || "Failed to fetch organization profile.");
                }
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

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

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto px-4 text-center py-16">
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 flex flex-col items-center">
                    <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-3xl mb-4">
                        <FaBuilding />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">No profile found</h2>
                    <p className="text-slate-500 mt-2 max-w-sm">Please complete your organization profile to connect with student talent.</p>
                    <button
                        onClick={() => {
                            setIsCompulsory(true);
                            setIsFormOpen(true);
                        }}
                        className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg cursor-pointer"
                    >
                        Create Profile
                    </button>
                </div>

                <OrganizationProfileForm
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(15,23,42,0.03)] overflow-hidden">
                {/* Banner Header */}
                <div className="min-h-52 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 relative flex items-end p-6 sm:p-8">
                    <div className="absolute inset-0 bg-black/15"></div>
                    <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-white">
                        {/* Left: Organization Name & Meta Info inside the green box */}
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-sm">
                                {profile.organization_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/10">
                                    <FaBuilding className="text-xs" />
                                    {profile.organization_type}
                                </span>
                                {(profile.city || profile.country) && (
                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-50 font-semibold drop-shadow-sm">
                                        <FaMapMarkerAlt className="text-emerald-300" />
                                        {profile.city && `${profile.city}, `}{profile.country}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Floating Logo/Icon Container */}
                        <div className="sm:absolute sm:right-8 sm:-bottom-5 flex-shrink-0 z-20">
                            {profile.logo ? (
                                <img
                                    src={profile.logo}
                                    alt="Organization Logo"
                                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                                />
                            ) : (
                                <div className="w-28 h-28 rounded-2xl bg-emerald-50 border-4 border-white shadow-lg flex items-center justify-center text-emerald-600 text-5xl font-black">
                                    {profile.organization_name ? profile.organization_name.charAt(0).toUpperCase() : 'C'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Card Info */}
                <div className="px-6 pb-8 sm:px-8 relative">
                    {/* Actions and Edit button */}
                    <div className="pt-6 sm:pt-4 flex justify-between items-center border-b border-slate-50 pb-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace</span>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setIsCompulsory(false);
                                    setIsFormOpen(true);
                                }}
                                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-sm text-xs cursor-pointer"
                            >
                                <FaPencilAlt className="text-[10px]" />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight mb-3">About Us</h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">{profile.description}</p>
                    </div>

                    {/* Contact details & Social Connect */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                        <div className="space-y-4.5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Contact Details</h3>
                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3.5 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600"><FaUser /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Contact Person</p>
                                        <p className="font-semibold text-slate-700">{profile.contact_person}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3.5 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600"><FaPhone /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Phone Number</p>
                                        <p className="font-semibold text-slate-700">{profile.phone_number}</p>
                                    </div>
                                </div>
                                {profile.website && (
                                    <div className="flex items-center gap-3.5 text-sm">
                                        <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600"><FaGlobe /></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase">Website</p>
                                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 hover:text-emerald-700">
                                                {profile.website.replace(/(^\w+:|^)\/\//, '')}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-4.5">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Location</h3>
                            <div className="space-y-3.5">
                                <div className="flex items-center gap-3.5 text-sm">
                                    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600"><FaMapMarkerAlt /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Address / Headquarter</p>
                                        <p className="font-semibold text-slate-700">
                                            {[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Social Links */}
                                {(profile.linkedin || profile.instagram || profile.twitter) && (
                                    <div className="pt-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2.5">Social Connections</p>
                                        <div className="flex gap-2.5">
                                            {profile.linkedin && (
                                                <a
                                                    href={profile.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                                                >
                                                    <FaLinkedin className="text-lg" />
                                                </a>
                                            )}
                                            {profile.instagram && (
                                                <a
                                                    href={profile.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                                                >
                                                    <FaInstagram className="text-lg" />
                                                </a>
                                            )}
                                            {profile.twitter && (
                                                <a
                                                    href={profile.twitter}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                                                >
                                                    <FaTwitter className="text-lg" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <OrganizationProfileForm
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
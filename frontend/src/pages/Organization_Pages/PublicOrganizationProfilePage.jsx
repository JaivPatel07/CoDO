import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FaBuilding,
    FaUser,
    FaGlobe,
    FaMapMarkerAlt,
    FaLinkedin,
    FaInstagram,
    FaTwitter,
    FaExternalLinkAlt,
} from "react-icons/fa";
import { fetch_public_organization_profile } from "../../api/organization_apis";
import OrganizationEvents from "./OrganizationEvents";

export default function PublicOrganizationProfilePage() {
    const { username } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await fetch_public_organization_profile(username);
                setProfile(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [username]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profile) {
        return <div>Organization not found.</div>;
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm relative p-6 md:p-8 mb-8">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-t-2xl"></div>
                    <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
                        {/* Logo */}
                        <div className="flex-shrink-0 -mt-12 md:-mt-16">
                            {profile.logo ? (
                                <img src={profile.logo} alt="Organization Logo" className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-lg bg-white" />
                            ) : (
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-emerald-100 border-4 border-white shadow-lg flex items-center justify-center text-emerald-600 text-5xl font-black">
                                    {profile.organization_name ? profile.organization_name.charAt(0).toUpperCase() : 'C'}
                                </div>
                            )}
                        </div>
                        {/* Info */}
                        <div className="flex-grow">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{profile.organization_name}</h1>
                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-1.5"><FaBuilding className="text-slate-400" /> {profile.organization_type}</span>
                                <span className="inline-flex items-center gap-1.5"><FaMapMarkerAlt className="text-slate-400" /> {[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                                {profile.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold">
                                        <FaGlobe className="text-slate-400" /> {profile.website.replace(/(^\w+:|^)\/\//, '')}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Company Details</h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-4">
                                    <FaUser className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Contact Person</p>
                                        <p className="text-slate-600">{profile.contact_person}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <FaMapMarkerAlt className="text-slate-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-slate-800">Location</p>
                                        <p className="text-slate-600">{[profile.city, profile.state, profile.country].filter(Boolean).join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Social Links</h3>
                            <div className="space-y-3">
                                {profile.linkedin && <SocialLink icon={FaLinkedin} href={profile.linkedin} text="LinkedIn" />}
                                {profile.instagram && <SocialLink icon={FaInstagram} href={profile.instagram} text="Instagram" />}
                                {profile.twitter && <SocialLink icon={FaTwitter} href={profile.twitter} text="Twitter" />}
                            </div>
                        </div>
                    </aside>

                    {/* Right Content Area */}
                    <section className="lg:col-span-2 space-y-6">
                        {/* Tab Headers */}
                        <div className="flex border-b border-slate-200 mb-6">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                                    activeTab === "overview"
                                        ? "text-emerald-600 border-emerald-600"
                                        : "text-slate-500 border-transparent hover:text-slate-700"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab("events")}
                                className={`pb-3 px-4 font-bold text-sm transition-all border-b-2 cursor-pointer ${
                                    activeTab === "events"
                                        ? "text-emerald-600 border-emerald-600"
                                        : "text-slate-500 border-transparent hover:text-slate-700"
                                }`}
                            >
                                Events
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === "overview" ? (
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">About Company</h3>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                                    {profile.description || "No description provided."}
                                </p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-200 space-y-6">
                                <h3 className="text-lg font-bold text-slate-900">Programs & Events</h3>
                                <OrganizationEvents organization={profile} />
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

const SocialLink = ({ icon: Icon, href, text }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-emerald-600 group transition-colors"
    >
        <Icon className="text-slate-400 group-hover:text-emerald-600 transition-colors text-lg" />
        <span>{text}</span>
        <FaExternalLinkAlt className="text-slate-400 ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
);

const InfoItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="font-bold text-slate-800 mt-1">{value || 'Not specified'}</p>
    </div>
);
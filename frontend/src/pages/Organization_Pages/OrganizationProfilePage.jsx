import { useEffect, useState, useContext } from "react";
import { fetch_organization_profile, fetch_public_organization_profile } from "../../api/organization_apis";
import OrganizationProfileForm from "./OrganizationProfileForm";
import {
    Building2, MapPin, Globe, User, Phone, PencilLine,
    Link as LinkIcon, Share2, Download, Copy, CheckCircle2, Calendar,
    FileText, Award
} from "lucide-react";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contextAPI/userContext";
import OrganizationEvents from "./OrganizationEvents";

export default function OrganizationProfilePage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [copied, setCopied] = useState(false);

    const isOwner = userData?.username === username;

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true);
                const data = isOwner ? await fetch_organization_profile() : await fetch_public_organization_profile(username);
                setProfile(data);
            } catch (err) {
                const errMsg = err.detail || err.error || "";
                if (errMsg.toLowerCase().includes("not found")) {
                    setProfile(null);
                    if (isOwner) {
                        setIsFormOpen(true);
                        setIsCompulsory(true);
                    } else {
                        setError("Organization profile not found.");
                    }
                } else {
                    setError(errMsg || "Failed to fetch organization profile.");
                }
            } finally {
                setLoading(false);
            }
        };
        getProfile();
    }, [username, isOwner]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${window.location.origin}/organization/profile/${profile?.username}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2170e4]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 mt-6">
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl text-red-700 flex items-center gap-3">
                    <Building2 className="flex-shrink-0 text-xl" />
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
                        <Building2 />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">No profile found</h2>
                    <p className="text-slate-500 mt-2 max-w-sm">Please complete your organization profile to connect with student talent.</p>
                    {isOwner && (
                        <button
                            onClick={() => {
                                setIsCompulsory(true);
                                setIsFormOpen(true);
                            }}
                            className="mt-6 inline-flex items-center gap-2 bg-[#2170e4] hover:bg-[#0058be] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-lg cursor-pointer"
                        >
                            Create Profile
                        </button>
                    )}
                </div>

                <OrganizationProfileForm
                    isOpen={isFormOpen}
                    isCompulsory={isCompulsory}
                    onClose={() => {
                        if (!isCompulsory) setIsFormOpen(false);
                    }}
                    onSuccess={(newProfile) => {
                        if (newProfile && newProfile.username) {
                            setIsFormOpen(false);
                            setIsCompulsory(false);
                            navigate(`/organization/${newProfile.username}`, { replace: true });
                        }
                    }}
                    initialData={profile}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f9fb] font-sans text-[#191c1e]">
            <main className="max-w-[1280px] mx-auto px-6 py-1">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Sidebar */}
                    <aside className="w-full lg:w-[320px] flex flex-col gap-6 flex-shrink-0">
                        {/* Profile Info Card */}
                        <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md transition-all">
                            <div className="flex flex-col items-center lg:items-start">
                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#eceef0] mb-2 bg-slate-50 flex items-center justify-center">
                                    {profile.profile_pic ? (
                                        <img src={profile.profile_pic} alt="Organization Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-blue-50 flex items-center justify-center text-[#0058be] text-4xl font-black">
                                            {profile.username ? profile.username.charAt(0).toUpperCase() : 'C'}
                                        </div>
                                    )}
                                </div>
                                <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full">
                                    <h1 className="text-[20px] font-bold text-[#191c1e] flex items-center gap-2">
                                        {profile.username}
                                        <button onClick={handleCopy} className="text-[#45464d] hover:text-[#0058be] transition-colors" title="Copy Name">
                                            {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                                        </button>
                                    </h1>
                                    <span className="inline-block mt-2 px-3 py-0.5 bg-[#2170e4] text-white rounded-full text-[12px] font-semibold shadow-sm">
                                        {profile.industry || 'Organization'}
                                    </span>
                                </div>

                                <div className="w-full mt-4 mb-4 space-y-3 pt-4 border-t border-[#c6c6cd]">
                                    <div className="flex items-center gap-3 text-[#45464d]">
                                        <User size={20} />
                                        <span className="text-[14px] truncate">{profile.contact_person}</span>
                                    </div>
                                    {profile.phone_number && (
                                        <div className="flex items-center gap-3 text-[#45464d]">
                                            <Phone size={20} />
                                            <span className="text-[14px]">{profile.phone_number}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-[#45464d]">
                                        <MapPin size={20} />
                                        <span className="text-[14px]">{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                                    </div>
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#45464d] hover:text-[#0058be] transition-colors">
                                            <Globe size={20} />
                                            <span className="text-[14px] truncate">{profile.website.replace(/(^\w+:|^)\/\//, '')}</span>
                                        </a>
                                    )}
                                </div>

                                {isOwner && (
                                    <button 
                                        onClick={() => { setIsCompulsory(false); setIsFormOpen(true); }}
                                        className="w-full bg-black text-white text-[14px] font-medium py-2.5 rounded-lg active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 hover:bg-[#2d3133] hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        <PencilLine size={14} /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Navigation Tabs (Desktop) */}
                        <nav className="bg-white p-2 rounded-xl border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hidden lg:flex flex-col gap-1">
                            {[
                                { id: 'overview', label: 'Overview', icon: Building2 },
                                { id: 'events', label: 'Events & Programs', icon: Calendar },
                                { id: 'social', label: 'Social Networks', icon: LinkIcon }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 text-left ${
                                        activeTab === tab.id 
                                            ? 'bg-[#2170e4] text-white font-bold shadow-md scale-[1.02]' 
                                            : 'text-[#45464d] hover:bg-[#e6e8ea] hover:text-[#191c1e] font-medium hover:scale-[1.01]'
                                    }`}
                                >
                                    <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-[#7c839b]'} />
                                    <span className="text-[14px]">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <section className="flex-1 min-w-0">
                        {/* Mobile Tab Navigation */}
                        <div className="flex lg:hidden overflow-x-auto border-b border-[#c6c6cd] mb-6 pb-2 scrollbar-hide">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'events', label: 'Events' },
                                { id: 'social', label: 'Socials' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap px-4 py-2 text-[14px] font-medium transition-colors ${
                                        activeTab === tab.id ? 'text-black border-b-2 border-black' : 'text-[#45464d]'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Overview */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-4">Corporate Overview</h2>
                                
                                <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-[20px] font-bold text-slate-900 mb-3">About Company</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{profile.description || "No description provided."}</p>
                                </div>

                                <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-[20px] font-bold text-slate-900 mb-4">Firm Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be]">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">Industry Sector</span>
                                                <p className="text-[16px] font-bold text-[#191c1e] mt-0.5">{profile.industry || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be]">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">Primary Location</span>
                                                <p className="text-[16px] font-bold text-[#191c1e] mt-0.5">{[profile.city, profile.country].filter(Boolean).join(', ') || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab Content: Events */}
                        {activeTab === 'events' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-4 font-sans">Programs & Hackathons</h2>
                                <OrganizationEvents organization={profile} />
                            </div>
                        )}

                        {/* Tab Content: Social */}
                        {activeTab === 'social' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-8">Corporate Connections</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.linkedin && (
                                        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-[#0077b5] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-[#0077b5] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-[20px] font-bold text-[#191c1e]">LinkedIn</h3>
                                                    <p className="text-[14px] text-[#45464d]">Professional Hub</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-[#0077b5] group-hover:text-white group-hover:border-[#0077b5] transition-all text-[#191c1e]">
                                                View Page <Globe size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </a>
                                    )}

                                    {profile.instagram && (
                                        <a href={profile.instagram} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-[#e1306c] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-[#e1306c] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                    <FaInstagram className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[20px] font-bold text-[#191c1e]">Instagram</h3>
                                                    <p className="text-[14px] text-[#45464d]">Visual Feed</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-[#e1306c] group-hover:text-white group-hover:border-[#e1306c] transition-all text-[#191c1e]">
                                                View Feed <Globe size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </a>
                                    )}

                                    {profile.twitter && (
                                        <a href={profile.twitter} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-black hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-black flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                                                    <FaTwitter className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-[20px] font-bold text-[#191c1e]">Twitter / X</h3>
                                                    <p className="text-[14px] text-[#45464d]">Microblog Updates</p>
                                                </div>
                                            </div>
                                            <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-black group-hover:text-white group-hover:border-black transition-all text-[#191c1e]">
                                                View Account <Globe size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <OrganizationProfileForm
                isOpen={isFormOpen}
                isCompulsory={isCompulsory}
                onClose={() => {
                    if (!isCompulsory) setIsFormOpen(false);
                }}
                onSuccess={(newProfile) => {
                    if (newProfile && newProfile.username) {
                        setIsFormOpen(false);
                        setIsCompulsory(false);
                        navigate(`/organization/${newProfile.username}`, { replace: true });
                    }
                }}
                initialData={profile}
            />
        </div>
    );
}
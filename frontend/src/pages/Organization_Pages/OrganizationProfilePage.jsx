import React, { useContext, useEffect, useState } from 'react';
import {
  Mail, MapPin, CheckCircle2, Edit2, Copy,
  ExternalLink, Building, Calendar, Phone, ShieldCheck
} from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contextAPI/userContext";
import OrganizationProfileForm from "./OrganizationProfileForm";
import OrganizationEvents from "./OrganizationEventsPage";
import { fetch_organization_profile } from "../../api/public_apis";
import { follow_organization, unfollow_organization } from "../../api/organization_apis";
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM COMPONENTS ---
const ProfilePic = ({ uname, custom_pic_url, className }) => {
  if (custom_pic_url) {
    return <img src={custom_pic_url} alt={uname} className={className} />;
  }
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-black ${className}`}>
      {uname ? uname.charAt(0).toUpperCase() : 'C'}
    </div>
  );
};

const OrgProfileHero = ({
  profile,
  isOwner,
  canFollow,
  isFollowBusy,
  handleEdit,
  handleEditLogo,
  handleCopy,
  handleFollowToggle,
  copied
}) => {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative shrink-0"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl bg-slate-100 z-10 relative group">
            <ProfilePic uname={profile?.username} custom_pic_url={profile?.profile_pic} className="w-full h-full text-5xl object-cover" />
            {isOwner && (
              <button
                onClick={handleEditLogo}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                title="Change Logo"
              >
                <Edit2 size={24} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="flex-1 w-full pt-2 md:pt-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="min-w-0">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                {profile?.username}
                <ShieldCheck size={22} className="text-violet-500" title="Verified Organization" />
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 font-medium truncate">@{profile?.username?.toLowerCase()}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-violet-500" /> Official Partner
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-slate-600 font-medium">
                  {profile?.followers_count || 0} Followers
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {profile?.industry && (
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <Building size={16} className="text-slate-400" />
                    {profile.industry}
                  </div>
                )}
                {(profile?.city || profile?.country) && (
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin size={16} className="text-slate-400" />
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </div>
                )}
                {profile?.contact_person && (
                  <div className="flex items-center gap-1.5 font-medium">
                    <Mail size={16} className="text-slate-400" />
                    {profile.contact_person}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 w-full md:w-auto shrink-0"
            >
              {isOwner ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-violet-500" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </>
              ) : (
                <>
                  {canFollow && (
                    <button
                      onClick={handleFollowToggle}
                      disabled={isFollowBusy}
                      className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm cursor-pointer disabled:opacity-70 ${
                        profile?.is_following
                          ? 'bg-slate-900 hover:bg-slate-800 text-white'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      }`}
                    >
                      {profile?.is_following ? <CheckCircle2 size={16} /> : <Building size={16} />}
                      {profile?.is_following ? 'Following' : 'Follow'}
                    </button>
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-violet-500" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

const OrgOverviewTab = ({ profile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
  >
    {/* Left Column (Main Content) */}
    <div className="lg:col-span-2 space-y-6 md:space-y-8">
      {/* About Section */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
          <Building size={20} className="text-slate-400" /> About Company
        </h2>
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]">
          {profile?.description || "No description provided."}
        </p>

        {/* Corporate Details Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industry Sector</span>
            <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
              <Building size={16} className="text-slate-400" />
              {profile?.industry || 'Not specified'}
            </span>
          </div>
          {profile?.phone_number && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Corporate Line</span>
              <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                {profile.phone_number}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>

    {/* Right Column (Sidebar: Social & Links) */}
    <div className="space-y-6 md:space-y-8">
      {/* Corporate Focus */}
      <div className="bg-violet-50 p-6 rounded-2xl shadow-sm border border-violet-100 text-slate-900 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Building size={80} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-2">Organization</h2>
          <p className="text-2xl font-bold leading-tight mb-2">{profile?.industry || "Tech Company"}</p>
          <p className="text-violet-500 text-sm flex items-center gap-1.5 mt-4">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            Official Account
          </p>
        </div>
      </div>

      {/* Social Networks */}
      {(profile?.website || profile?.linkedin || profile?.instagram || profile?.twitter) && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">Connect</h2>
          <div className="space-y-4">
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                  <ExternalLink size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Website</p>
                  <p className="text-xs text-slate-500">Official corporate site</p>
                </div>
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#0077b5] group-hover:text-white transition-colors">
                  <FaLinkedin size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">LinkedIn</p>
                  <p className="text-xs text-slate-500">Professional network</p>
                </div>
              </a>
            )}
            {profile?.twitter && (
              <a href={profile.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <FaTwitter size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">X / Twitter</p>
                  <p className="text-xs text-slate-500">Latest updates</p>
                </div>
              </a>
            )}
            {profile?.instagram && (
              <a href={profile.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors group">
                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#e1306c] group-hover:text-white transition-colors">
                  <FaInstagram size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Instagram</p>
                  <p className="text-xs text-slate-500">Visual feed</p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const OrganizationProfilePage = () => {
  const { organization_name } = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState('all');
  const [followError, setFollowError] = useState(null);
  const [isFollowBusy, setIsFollowBusy] = useState(false);

  const isOwner = userData?.username === organization_name;
  const accountType = localStorage.getItem('accountType');
  const canFollow = accountType === 'student' && !isOwner;

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const data = await fetch_organization_profile(organization_name);
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
  }, [organization_name, isOwner]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/organization/${organization_name}/profile`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditProfile = () => {
    setEditMode('all');
    setIsCompulsory(false);
    setIsFormOpen(true);
  };

  const handleEditLogo = () => {
    setEditMode('logo');
    setIsCompulsory(false);
    setIsFormOpen(true);
  };

  const handleFollowToggle = async () => {
    if (!profile?.user || isFollowBusy) return;

    try {
      setIsFollowBusy(true);
      setFollowError(null);
      const data = profile.is_following
        ? await unfollow_organization(profile.user)
        : await follow_organization(profile.user);

      setProfile((current) => ({
        ...current,
        is_following: data.is_following,
        followers_count: data.followers_count,
      }));
    } catch (err) {
      setFollowError(err.error || err.detail || "Unable to update follow status.");
    } finally {
      setIsFollowBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-slate-50 pt-24 px-4">
        {/* Loading Skeleton */}
        <div className="w-full max-w-[1080px] animate-pulse">
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-200 rounded-2xl shrink-0"></div>
            <div className="space-y-4 flex-1 pt-4">
              <div className="h-8 bg-slate-200 rounded-lg w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1080px]">
        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl text-red-700 flex items-center gap-3">
          <Building className="flex-shrink-0 text-xl" />
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
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center shadow-sm animate-in fade-in duration-500">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-3xl mb-4 border border-slate-100">
            <Building />
          </div>
          <h2 className="text-2xl font-black text-slate-900">No profile found</h2>
          <p className="text-slate-500 mt-2 max-w-sm">Please complete your organization profile to connect with talent.</p>
          {isOwner && (
            <button
              onClick={() => {
                setIsCompulsory(true);
                setIsFormOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
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
              setProfile(newProfile);
            }
          }}
          initialData={profile}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building },
    { id: 'events', label: 'Events & Programs', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 selection:bg-violet-100 selection:text-violet-900 relative">
      
      {/* Background Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-violet-50/50 to-transparent pointer-events-none -z-10"></div>
      
      <main className="max-w-[1080px] mx-auto">
        
        <OrgProfileHero 
          profile={profile}
          isOwner={isOwner}
          canFollow={canFollow}
          isFollowBusy={isFollowBusy}
          handleEdit={handleEditProfile}
          handleEditLogo={handleEditLogo}
          handleCopy={handleCopy}
          handleFollowToggle={handleFollowToggle}
          copied={copied} // Removed mt-2 from OrgProfileHero's internal div, relying on main's padding
        />
        {followError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {followError}
          </div>
        )}

        {/* Space underneath Hero before tabs */}
        <div className="mt-8 px-4 sm:px-6 md:px-8"></div>

        {/* Sticky Tabs Navigation */}
        <div className="sticky top-0 z-40 pt-4 pb-4 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200 mb-8 px-4 sm:px-6 md:px-8">
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${ // Removed mt-2 from here, relying on main's padding
                    isActive ? 'text-slate-900 bg-slate-100/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                  }`}
                >
                  <tab.icon size={16} className={isActive ? 'text-slate-900' : 'text-slate-400'} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-t-full origin-bottom"
                      initial={false}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px] px-4 sm:px-6 md:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OrgOverviewTab key="overview" profile={profile} />}
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OrganizationEvents organization={profile} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Profile Form Edit Modal */}
      <OrganizationProfileForm
        isOpen={isFormOpen}
        isCompulsory={isCompulsory}
        editMode={editMode}
        onClose={() => {
          if (!isCompulsory) setIsFormOpen(false);
        }}
        onSuccess={(newProfile) => {
          if (newProfile && newProfile.username) {
            setIsFormOpen(false);
            setIsCompulsory(false);
            setProfile(newProfile);
          }
        }}
        initialData={profile}
      />
    </div>
  );
};

export default OrganizationProfilePage;

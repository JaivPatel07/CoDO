import React, { useContext, useEffect, useState } from 'react';
import {
  Building, Calendar, CheckCircle2, Copy, Edit2, ExternalLink,
  Link as LinkIcon, Mail, MapPin, Phone, ShieldCheck, Users
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

// ─────────────────────────────────────────────
// PROFILE HERO  (matches User Profile style)
// ─────────────────────────────────────────────
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
  const location = [profile?.city, profile?.state, profile?.country].filter(Boolean).join(', ');

  return (
    <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 rounded-xl border border-[#e5e7eb] p-4 md:p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">

        {/* Left: Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-start flex-1 min-w-0">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="shrink-0">
            <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden border-2 border-white ring-2 ring-zinc-200 bg-zinc-50 dark:bg-slate-800 shrink-0 shadow-md relative group">
              <ProfilePic uname={profile?.username} custom_pic_url={profile?.profile_pic} className="w-full h-full text-4xl object-cover" />
              {isOwner && (
                <button
                  onClick={handleEditLogo}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  title="Change Logo"
                >
                  <Edit2 size={20} />
                </button>
              )}
            </div>
          </motion.div>

          <div className="flex-1 min-w-0 pt-1">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-slate-100 tracking-tight truncate">
                  {profile?.username}
                </h1>
                <ShieldCheck size={20} className="text-violet-500 shrink-0" title="Verified Organization" />
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-slate-400 mb-3 flex-wrap">
                <span className="font-medium text-zinc-700 dark:text-slate-300">@{profile?.username?.toLowerCase()}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                {profile?.industry && <span className="flex items-center gap-1"><Building size={14} /> {profile.industry}</span>}
                <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-violet-500" /> Official Partner</span>
              </div>

              <p className="text-sm text-zinc-600 dark:text-slate-400 line-clamp-2 max-w-2xl mb-4 leading-relaxed">
                {profile?.description || "Organization description will appear here."}
              </p>

              <div className="flex flex-wrap gap-2">
                {location && (
                  <span className="px-2.5 py-1 bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-300 text-xs font-medium rounded-md flex items-center gap-1">
                    <MapPin size={12} /> {location}
                  </span>
                )}
                {profile?.contact_person && (
                  <span className="px-2.5 py-1 bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-300 text-xs font-medium rounded-md flex items-center gap-1">
                    <Mail size={12} /> {profile.contact_person}
                  </span>
                )}
                {profile?.phone_number && (
                  <span className="px-2.5 py-1 bg-zinc-50 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 text-zinc-700 dark:text-slate-300 text-xs font-medium rounded-md flex items-center gap-1">
                    <Phone size={12} /> {profile.phone_number}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0">
          <div className="flex gap-2 w-full">
            {isOwner ? (
              <>
                <button onClick={handleEdit} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={handleCopy} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 dark:bg-slate-950 hover:bg-zinc-50 dark:bg-slate-800 border border-[#e5e7eb] text-zinc-700 dark:text-slate-300 h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  {copied ? <CheckCircle2 size={14} className="text-violet-500" /> : <LinkIcon size={14} />}
                  {copied ? 'Copied' : 'Share'}
                </button>
              </>
            ) : (
              <>
                {canFollow && (
                  <button
                    onClick={handleFollowToggle}
                    disabled={isFollowBusy}
                    className={`flex-1 lg:flex-none flex items-center justify-center gap-2 h-[36px] px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-70 ${
                      profile?.is_following
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                        : 'bg-violet-600 hover:bg-violet-700 text-white'
                    }`}
                  >
                    {profile?.is_following ? <CheckCircle2 size={14} /> : <Building size={14} />}
                    {profile?.is_following ? 'Following' : 'Follow'}
                  </button>
                )}
                <button onClick={handleCopy} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 dark:bg-slate-950 hover:bg-zinc-50 dark:bg-slate-800 border border-[#e5e7eb] text-zinc-700 dark:text-slate-300 h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  {copied ? <CheckCircle2 size={14} className="text-violet-500" /> : <LinkIcon size={14} />}
                  {copied ? 'Copied' : 'Share'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PROFILE STATS BAR
// ─────────────────────────────────────────────
const OrgProfileStats = ({ profile }) => {
  const stats = [
    { label: 'Followers', value: profile?.followers_count || 0, icon: Users },
    { label: 'Industry', value: profile?.industry || 'N/A', icon: Building },
    { label: 'Est. Location', value: [profile?.country, profile?.state].filter(Boolean).join(', ') || 'N/A', icon: MapPin },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 rounded-xl border border-[#e5e7eb] p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4 md:gap-0 md:divide-x divide-zinc-200">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-center min-w-[30%] md:min-w-0">
            <div className="flex items-center gap-1.5 text-zinc-900 dark:text-slate-100">
              <Icon size={16} className="text-zinc-400" />
              <span className="text-xl font-bold truncate max-w-[140px]">{stat.value}</span>
            </div>
            <span className="text-xs font-medium text-zinc-500 dark:text-slate-400 mt-1">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────
// OVERVIEW TAB
// ─────────────────────────────────────────────
const OrgOverviewTab = ({ profile }) => {
  const socials = [
    { key: 'website', label: 'Website', sub: 'Official corporate site', icon: ExternalLink, hover: 'hover:bg-slate-100 dark:bg-slate-800' },
    { key: 'linkedin', label: 'LinkedIn', sub: 'Professional network', icon: FaLinkedin, hover: 'hover:bg-[#0077b5] hover:text-white' },
    { key: 'twitter', label: 'X / Twitter', sub: 'Latest updates', icon: FaTwitter, hover: 'hover:bg-zinc-900 hover:text-white' },
    { key: 'instagram', label: 'Instagram', sub: 'Visual feed', icon: FaInstagram, hover: 'hover:bg-[#e1306c] hover:text-white' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-5">
        {/* About Section */}
        <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Building size={18} className="text-zinc-400" /> About Company
          </h2>
          <p className="text-sm text-zinc-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {profile?.description || "This organization hasn't added a description yet."}
          </p>
        </section>

        {/* Corporate Details */}
        <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-slate-100 mb-4">Corporate Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-start gap-3">
              <Building size={16} className="text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">{profile?.industry || 'Not specified'}</p>
                <p className="text-xs text-zinc-500 dark:text-slate-400">Industry Sector</p>
              </div>
            </div>
            {profile?.phone_number && (
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">{profile.phone_number}</p>
                  <p className="text-xs text-zinc-500 dark:text-slate-400">Corporate Line</p>
                </div>
              </div>
            )}
            {profile?.contact_person && (
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">{profile.contact_person}</p>
                  <p className="text-xs text-zinc-500 dark:text-slate-400">Contact Person</p>
                </div>
              </div>
            )}
            {[profile?.city, profile?.state, profile?.country].filter(Boolean).length > 0 && (
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-slate-100">{profile.city}{profile.city && profile.country ? ', ' : ''}{profile.country}</p>
                  <p className="text-xs text-zinc-500 dark:text-slate-400">Location</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Column (Sidebar) */}
      <div className="space-y-5">
        {/* Verified Card */}
        <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <ShieldCheck size={16} className="text-violet-500" /> Verification
          </h2>
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-slate-300">
            <CheckCircle2 size={16} className="text-violet-500" />
            <span>Official Partner</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-slate-400 mt-2 leading-relaxed">
            This is a verified organization account on CoDO.
          </p>
        </div>

        {/* Connect / Social Networks */}
        {socials.some((s) => profile?.[s.key]) && (
          <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-slate-100 mb-4">Connect</h2>
            <div className="space-y-2">
              {socials.map((s) => {
                if (!profile?.[s.key]) return null;
                const Icon = s.icon;
                return (
                  <a key={s.key} href={profile[s.key]} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-2 -m-1 rounded-lg hover:bg-zinc-50 dark:bg-slate-800 transition-colors group`}>
                    <div className={`p-2 bg-zinc-100 dark:bg-slate-800 rounded-lg text-zinc-600 dark:text-slate-400 shrink-0 transition-colors ${s.hover}`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-slate-100">{s.label}</p>
                      <p className="text-xs text-zinc-500 dark:text-slate-400 truncate">{s.sub}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
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
      <div className="min-h-screen flex items-start justify-center bg-[#fafafa] pt-12 px-4">
        <div className="w-full max-w-[1200px] animate-pulse">
          <div className="h-32 bg-zinc-200 rounded-xl w-full mb-6"></div>
          <div className="h-12 bg-zinc-200 rounded-xl w-full mb-6"></div>
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 h-64 bg-zinc-200 rounded-xl w-full"></div>
            <div className="h-64 bg-zinc-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 md:pt-10">
        <div className="bg-red-50 border border-red-200 p-5 rounded-xl text-red-700 flex items-center gap-3">
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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center">
        <div className="bg-white dark:bg-slate-900 dark:bg-slate-950 border border-[#e5e7eb] rounded-xl p-10 flex flex-col items-center shadow-sm animate-in fade-in duration-500">
          <div className="h-16 w-16 bg-zinc-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-zinc-400 text-3xl mb-4 border border-zinc-100 dark:border-slate-800">
            <Building />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-slate-100">No profile found</h2>
          <p className="text-zinc-500 dark:text-slate-400 mt-2 max-w-sm">Please complete your organization profile to connect with talent.</p>
          {isOwner && (
            <button
              onClick={() => {
                setIsCompulsory(true);
                setIsFormOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-3 rounded-lg transition-all shadow-md cursor-pointer active:scale-95"
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
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 dark:text-slate-100 pb-20 selection:bg-violet-100 dark:bg-violet-500/20 selection:text-violet-900">
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 md:pt-10">

        <OrgProfileHero
          profile={profile}
          isOwner={isOwner}
          canFollow={canFollow}
          isFollowBusy={isFollowBusy}
          handleEdit={handleEditProfile}
          handleEditLogo={handleEditLogo}
          handleCopy={handleCopy}
          handleFollowToggle={handleFollowToggle}
          copied={copied}
        />
        {followError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {followError}
          </div>
        )}

        <OrgProfileStats profile={profile} />

        {/* Sticky Tabs Navigation */}
        <div className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#e5e7eb]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 h-12 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-zinc-900 dark:text-slate-100' : 'text-zinc-500 dark:text-slate-400 hover:text-zinc-800'
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                  {isActive && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-t-full" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
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

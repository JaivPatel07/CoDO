import React, { useContext, useEffect, useState } from 'react';
import {
  Mail, MapPin, CheckCircle2, Edit2, Copy,
  ExternalLink, FileText, Globe, Building,
  Rocket, FolderOpen, Share2, Calendar, Award, Phone
} from 'lucide-react';
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contextAPI/userContext";
import OrganizationProfileForm from "./OrganizationProfileForm";
import OrganizationEvents from "./OrganizationEvents";
import { fetch_organization_profile } from "../../api/public_apis";

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

  const isOwner = userData?.username === organization_name;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] pb-12 animate-pulse">
        {/* Skeleton Cover Photo */}
        <div className="w-full h-44 md:h-52 bg-slate-200 border-b border-slate-100"></div>

        <main className="max-w-[1080px] mx-auto px-4 sm:px-6 relative z-10 -mt-20 md:-mt-24">
          {/* Skeleton Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-200 shrink-0"></div>
              <div className="flex flex-col items-center md:items-start mt-2 space-y-3">
                <div className="h-6 w-40 bg-slate-200 rounded-lg"></div>
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-5 w-28 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-4 w-52 bg-slate-200 rounded-lg"></div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0 shrink-0">
              <div className="h-9 w-32 bg-slate-200 rounded-xl"></div>
              <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
            </div>
          </div>

          {/* Skeleton Navbar */}
          <div className="mt-8 h-10 w-80 bg-slate-200 rounded-2xl mx-auto"></div>

          {/* Skeleton Content */}
          <div className="mt-8 max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded-lg mb-4"></div>
              <div className="h-4 w-full bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-4/5 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 space-y-4">
              <div className="h-5 w-36 bg-slate-200 rounded-lg mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 bg-slate-200 rounded-xl"></div>
                <div className="h-12 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
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
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 flex flex-col items-center shadow-sm">
          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-3xl mb-4 border border-slate-100">
            <Building />
          </div>
          <h2 className="text-2xl font-black text-slate-800">No profile found</h2>
          <p className="text-slate-500 mt-2 max-w-sm">Please complete your organization profile to connect with talent.</p>
          {isOwner && (
            <button
              onClick={() => {
                setIsCompulsory(true);
                setIsFormOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-full transition-all shadow-md cursor-pointer active:scale-95"
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

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-800 pb-12">
      
      {/* Premium Cover Photo Banner */}
      <div className="w-full h-44 md:h-52 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative z-0 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 relative z-10 -mt-20 md:-mt-24">
        
        {/* Horizontal Profile Card */}
        <section className="bg-white rounded-2xl shadow-lg shadow-slate-100/80 border border-slate-200/60 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between backdrop-blur-sm">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full md:w-auto">
            {/* Avatar - Scaled Down */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white bg-slate-50 shadow-md shrink-0 flex items-center justify-center">
              {profile.profile_pic ? (
                <img src={profile.profile_pic} alt="Organization Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-650 flex items-center justify-center text-white text-4xl font-black">
                  {profile.username ? profile.username.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
            </div>

            {/* Core Info */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start mt-1 md:mt-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-2.5">
                {profile.username}
                <button onClick={handleCopy} className="text-slate-400 hover:text-violet-600 transition-colors p-1.5 rounded-full hover:bg-slate-50 active:scale-95" title="Copy Profile Link">
                  {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </h1>
              
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3.5 py-1 bg-violet-50 text-violet-700 border border-violet-100/70 rounded-full text-[11px] font-bold tracking-wide">
                  {profile.industry || 'Organization'}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 border border-slate-200/60 rounded-full text-[11px] font-semibold">
                  <MapPin size={12} className="text-slate-400"/>
                  {[profile.city, profile.country].filter(Boolean).join(', ') || 'Global'}
                </div>
              </div>

              {profile.contact_person && (
                <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-slate-500 text-xs font-semibold">
                  <Building size={14} className="text-slate-450"/>
                  <span>Primary Representative: <strong className="text-slate-800">{profile.contact_person}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Action Links & Buttons */}
          <div className="flex flex-col items-center md:items-end justify-center w-full md:w-auto mt-2 md:mt-0 gap-3 shrink-0">
            {isOwner && (
              <button 
                onClick={() => { setIsCompulsory(false); setIsFormOpen(true); }}
                className="w-full md:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex justify-center items-center gap-1.5 hover:bg-slate-800 hover:shadow-md active:scale-95 cursor-pointer"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            )}

            {/* Quick Connect / Social Links */}
            <div className="flex items-center justify-center gap-2 w-full md:w-auto mt-1">
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50/50 px-4 py-2 rounded-full transition-all shadow-sm group">
                  <Globe size={14} className="group-hover:scale-105 transition-transform"/>
                  <span className="text-xs font-bold">Website</span>
                </a>
              )}
              
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="flex items-center justify-center bg-slate-50 border border-slate-200/80 text-slate-500 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] w-8 h-8 rounded-full transition-all shadow-sm group">
                  <svg className="w-4 h-4 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Soft Navbar - Compact & Rounded */}
        <nav className="mt-8 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-sm border border-slate-200/60 flex overflow-x-auto gap-1 scrollbar-hide max-w-fit mx-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'events', label: 'Events & Programs', icon: Calendar },
            { id: 'social', label: 'Social Networks', icon: Share2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl transition-all duration-300 font-bold whitespace-nowrap text-xs ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Sections */}
        <section className="mt-8 max-w-4xl mx-auto">
          
          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-base font-black mb-4 text-slate-900 border-b border-slate-100 pb-2.5">About Company</h3>
                <p className="text-slate-655 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{profile.description || "No description provided."}</p>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-base font-black mb-5 text-slate-900 border-b border-slate-100 pb-2.5">Corporate Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-50 rounded-xl text-violet-600 shrink-0 border border-violet-100/50">
                      <Building size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industry Sector</span>
                      <p className="font-bold text-slate-850 mt-0.5">{profile.industry || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-50 rounded-xl text-rose-600 shrink-0 border border-rose-100/50">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location Headquarters</span>
                      <p className="font-bold text-slate-850 mt-0.5">{[profile.city, profile.country].filter(Boolean).join(', ') || 'Not specified'}</p>
                    </div>
                  </div>

                  {profile.phone_number && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-550 shrink-0 border border-slate-200/50">
                        <Phone size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Corporate Line</span>
                        <p className="font-bold text-slate-850 mt-0.5">{profile.phone_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Events */}
          {activeTab === 'events' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <OrganizationEvents organization={profile} />
            </div>
          )}

          {/* Tab Content: Social */}
          {activeTab === 'social' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col group hover:border-[#0077b5] transition-all hover:shadow-md duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#0077b5] flex items-center justify-center rounded-xl border border-slate-200/60 transition-colors">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">LinkedIn</h3>
                        <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Professional Hub</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-6 flex-1">Connect with us on LinkedIn for job postings, updates, and news.</p>
                    <div className="flex items-center text-xs font-semibold text-slate-650 group-hover:text-[#0077b5]">
                      Visit Profile <ExternalLink size={14} className="ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                )}

                {profile.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col group hover:border-[#e1306c] transition-all hover:shadow-md duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#e1306c] flex items-center justify-center rounded-xl border border-slate-200/60 transition-colors">
                        <FaInstagram className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Instagram</h3>
                        <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Visual Feed</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-6 flex-1">Explore our work environment and team highlights on Instagram.</p>
                    <div className="flex items-center text-xs font-semibold text-slate-650 group-hover:text-[#e1306c]">
                      View Feed <ExternalLink size={14} className="ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                )}

                {profile.twitter && (
                  <a href={profile.twitter} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col group hover:border-slate-800 transition-all hover:shadow-md duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-slate-50 group-hover:bg-slate-900 flex items-center justify-center rounded-xl border border-slate-200/60 transition-colors">
                        <FaTwitter className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Twitter / X</h3>
                        <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Microblog Updates</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-6 flex-1">Follow our latest news, discussions, and updates on Twitter/X.</p>
                    <div className="flex items-center text-xs font-semibold text-slate-650 group-hover:text-slate-900">
                      View Account <ExternalLink size={14} className="ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-6 mt-12 border-t border-slate-200/60 bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1080px] mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-sm font-bold text-slate-700 tracking-tight">CoDO Portal</span>
            <p className="text-[11px] text-slate-400 mt-0.5">© {new Date().getFullYear()} {profile.username}. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a className="text-[11px] font-medium text-slate-450 hover:text-slate-800 transition-colors" href="#">Privacy Policy</a>
            <a className="text-[11px] font-medium text-slate-450 hover:text-slate-800 transition-colors" href="#">Terms of Use</a>
          </div>
        </div>
      </footer>

      {/* Profile Form Edit Modal */}
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
};

export default OrganizationProfilePage;
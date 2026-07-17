import React, { useContext, useEffect, useState } from 'react';
import {
  Mail, MapPin, CheckCircle2, Edit2, Copy,
  ExternalLink, FileText, GraduationCap,
  Terminal, Link as LinkIcon, Building, 
  Rocket, FolderOpen, Share2, Download, Upload,
  Calendar, Award
} from 'lucide-react';
import { UserContext } from '../../../contextAPI/userContext';
import ProfileForm from '../ProfileForm/ProfileForm';
import ProfilePic from '../../../components/ProfilePic';
import { fetch_student_profile } from '../../../api/public_apis';
import { useNavigate, useParams } from "react-router-dom";



const ProfilePage = () => {
  const { user_name } = useParams();
  const [activeTab, setActiveTab] = useState('education');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  let { userData, profileData, setProfileData } = useContext(UserContext);
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [publicProfile, setPublicProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user_name) return;

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await fetch_student_profile(user_name);
            setPublicProfile(data);
        } catch (err) {
            console.log(err);
            setPublicProfile(null);
        } finally {
            setLoading(false);
        }
    };

    loadProfile();
  }, [user_name]);

  const handle_editprofile = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
  };

  const isOwnProfile = user_name === userData?.username;

  const profile = isOwnProfile ? profileData : publicProfile;
  const user = isOwnProfile ? userData : publicProfile;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/user/${user?.username}/profile`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate('/*',{replace:true});
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-800 pb-12">
      
      {/* Soft Cover Photo */}
      <div className="w-full h-40 md:h-48 bg-gradient-to-r from-blue-100 via-indigo-50 to-blue-50 relative z-0 border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 relative z-10 -mt-16 md:-mt-20">
        
        {/* Horizontal Profile Card */}
        <section className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-5 md:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between backdrop-blur-sm">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 w-full md:w-auto">
            {/* Avatar - Scaled Down */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white bg-slate-50 shadow-sm shrink-0">
              <ProfilePic uname={profile?.firstname} className='w-full h-full text-3xl' />
              <div className={`absolute bottom-1 right-2 w-3.5 h-3.5 rounded-full border-2 border-white ${user?.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} title={user?.is_active ? "Active" : "Offline"} />
            </div>

            {/* Core Info - Smaller Fonts */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start mt-1 md:mt-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                {profile?.firstname} {profile?.lastname}
                <button onClick={handleCopy} className="text-slate-400 hover:text-blue-500 transition-colors p-1 rounded-full active:scale-95" title="Copy Profile Link">
                  {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
              </h1>
              
              <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-blue-50/50 text-blue-600 border border-blue-100/50 rounded-full text-[11px] font-semibold tracking-wide">
                  {profile?.preferred_role}
                </span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-full text-[11px] font-medium">
                  <MapPin size={12} className="text-slate-400"/>
                  {profile?.state}, {profile?.country}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-slate-500 text-xs font-medium">
                <GraduationCap size={14} className="text-slate-400"/>
                {profile?.degree} • {profile?.college}
              </div>
            </div>
          </div>

          {/* Action Links & Buttons - Pill shaped & smaller */}
          <div className="flex flex-col items-center md:items-end justify-center w-full md:w-auto mt-2 md:mt-0 gap-3 shrink-0">
            {isOwnProfile && (
              <button 
                onClick={handle_editprofile}
                className="w-full md:w-auto bg-slate-800 text-white px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 flex justify-center items-center gap-1.5 hover:bg-slate-700 hover:shadow-sm active:scale-95"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            )}

            {/* Quick Connect / Social Links */}
            <div className="flex items-center justify-center gap-2 w-full md:w-auto mt-1">
              <a href={`mailto:${user?.email}`} title="Connect via Email" className="flex items-center justify-center gap-1.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-full transition-all shadow-sm group">
                <Mail size={14} className="group-hover:scale-105 transition-transform"/>
                <span className="text-xs font-medium">Connect</span>
              </a>
              
              {profile?.git_link && (
                <a href={profile?.git_link} target="_blank" rel="noreferrer" title="GitHub" className="flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-600 hover:bg-[#24292e] hover:text-white hover:border-[#24292e] w-8 h-8 rounded-full transition-all shadow-sm group">
                  <svg className="w-4 h-4 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                </a>
              )}
              
              {profile?.linkedin_link && (
                <a href={profile?.linkedin_link} target="_blank" rel="noreferrer" title="LinkedIn" className="flex items-center justify-center bg-slate-50 border border-slate-200 text-slate-600 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] w-8 h-8 rounded-full transition-all shadow-sm group">
                  <svg className="w-4 h-4 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Soft Navbar - Compact & Rounded */}
        <nav className="mt-6 bg-white/70 backdrop-blur-md p-1.5 rounded-full shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex overflow-x-auto gap-1 scrollbar-hide max-w-fit mx-auto">
          {[
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'technical', label: 'Skills', icon: Terminal },
            { id: 'projects', label: 'Projects', icon: Rocket },
            { id: 'activity', label: 'Activity', icon: Calendar },
            { id: 'connections', label: 'Connections', icon: Share2 },
            { id: 'social', label: 'Social', icon: LinkIcon },
            { id: 'resume', label: 'Resume', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-300 font-medium whitespace-nowrap text-xs ${
                activeTab === tab.id 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <tab.icon size={14} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Content Sections - Scaled Down */}
        <section className="mt-6 max-w-4xl mx-auto">
          
          {/* Tab Content: Education */}
          {activeTab === 'education' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* University Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50/50 rounded-xl text-blue-500 shrink-0">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Higher Education</span>
                    <h3 className="text-sm font-semibold mt-0.5 text-slate-800">University</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                      <Building size={12} className="text-slate-400" /> 
                      {profile?.college}
                    </p>
                  </div>
                </div>
                
                {/* High School Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all flex items-start gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 shrink-0">
                    <Building size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Education</span>
                    <h3 className="text-sm font-semibold mt-0.5 text-slate-800">High School</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                      <Building size={12} className="text-slate-400" /> 
                      {profile?.school}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Bar */}
              <div className="mt-4 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50/50 rounded-lg text-emerald-500 shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Degree</span>
                    <p className="text-sm font-semibold text-slate-800">{profile?.degree}</p>
                  </div>
                </div>
                
                <div className="hidden md:block w-px h-8 bg-slate-100 shrink-0"></div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50/50 rounded-lg text-orange-400 shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Graduation</span>
                    <p className="text-sm font-semibold text-slate-800">{profile?.graduation_year || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Technical */}
          {activeTab === 'technical' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Skills Container */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-4 text-slate-800 flex items-center gap-2">
                    <Terminal size={16} className="text-slate-400" /> Core Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.selectedSkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-full border border-slate-100 hover:bg-slate-100 transition-colors cursor-default">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                  
                  {/* Miniature Chart */}
                  <div className="mt-8 pt-6 border-t border-slate-50">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Activity Velocity</h4>
                    <div className="flex gap-2 h-20 items-end group">
                      {[40, 60, 50, 90, 70, 100, 55, 95, 80, 65].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-300 rounded-sm transition-all duration-300 cursor-pointer" style={{ height: `${h}%` }}>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Role Brief Container */}
                <div className="bg-slate-50 border border-slate-100 text-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="p-2 bg-white border border-slate-100 rounded-lg w-fit mb-4 shadow-sm">
                      <Rocket size={20} className="text-blue-500" />
                    </div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Role Focus</h3>
                    <p className="text-lg font-bold leading-tight">{profile?.preferred_role}</p>
                  </div>
                  <div className="mt-8">
                    <button className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-full text-xs font-semibold hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
                      Get Tech Brief
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Placeholder Tabs: Projects, Activity, Connections */}
          {['projects', 'activity', 'connections'].includes(activeTab) && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    {activeTab === 'projects' && <FolderOpen size={24} className="text-slate-300" />}
                    {activeTab === 'activity' && <Calendar size={24} className="text-slate-300" />}
                    {activeTab === 'connections' && <Share2 size={24} className="text-slate-300" />}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 capitalize mb-1">{activeTab} Space</h3>
                  <p className="text-xs text-slate-400 max-w-xs">This section is currently being updated. Check back soon for the latest {activeTab}.</p>
               </div>
            </div>
          )}

          {/* Tab Content: Social */}
          {activeTab === 'social' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Github Card */}
                <a href={profile?.git_link} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col group hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#24292e] flex items-center justify-center rounded-xl border border-slate-100 transition-colors">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">GitHub</h3>
                      <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Open Source</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-6 flex-1">Explore my repositories, code contributions, and current tech experiments.</p>
                  <div className="flex items-center text-xs font-semibold text-slate-600 group-hover:text-[#24292e]">
                    Visit Profile <ExternalLink size={14} className="ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
                
                {/* LinkedIn Card */}
                <a href={profile?.linkedin_link} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col group hover:border-[#0077b5] transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-slate-50 group-hover:bg-[#0077b5] flex items-center justify-center rounded-xl border border-slate-100 transition-colors">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">LinkedIn</h3>
                      <p className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">Professional</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-6 flex-1">Connect for career updates, articles, and professional networking.</p>
                  <div className="flex items-center text-xs font-semibold text-slate-600 group-hover:text-[#0077b5]">
                    View Connect <ExternalLink size={14} className="ml-1 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* Tab Content: Resume */}
          {activeTab === 'resume' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 md:p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="text-slate-400" size={18} />
                    <span className="text-sm font-semibold text-slate-800">Documents</span>
                  </div>
                  <button className="bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 shadow-sm transition-all">
                    <Upload size={14} /> Upload
                  </button>
                </div>
                
                <div className="p-10 md:p-16 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <FolderOpen size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1">No documents found</h3>
                  <p className="text-xs text-slate-400 max-w-[250px]">
                    Your resume or portfolio documents will appear here once uploaded.
                  </p>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-6 mt-12 border-t border-slate-100 bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1080px] mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-sm font-bold text-slate-700 tracking-tight">DevProfile</span>
            <p className="text-[11px] text-slate-400 mt-0.5">© {new Date().getFullYear()} {profile?.firstname}. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a className="text-[11px] font-medium text-slate-400 hover:text-slate-800 transition-colors" href="#">Privacy</a>
            <a className="text-[11px] font-medium text-slate-400 hover:text-slate-800 transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>

      {/* Modal Profile Form */}
      {isProfileFormOpen && (
        <ProfileForm
          isOpen={isProfileFormOpen}
          isCompulsory={false}
          onClose={() => setIsProfileFormOpen(false)}
          onSuccess={(newProfile) => {
            setProfileData(newProfile);
            setIsProfileFormOpen(false);
          }}
          initialData={profile && Object.keys(profile).length > 0 ? profile : null}
        />
      )}
    </div>
  );
};

export default ProfilePage;
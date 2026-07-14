import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import {
  Mail, MapPin, CheckCircle2, Copy,
  ExternalLink, GraduationCap,
  Terminal, Link as LinkIcon, Building,
  Calendar, Award
} from 'lucide-react';
import ProfilePic from '../../components/ProfilePic';
import { fetch_public_profile } from '../../api/public_apis';
import PageNotFound from '../Page_not_found';

const PublicProfilePage = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('education');
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await fetch_public_profile(username);
            setProfile(data);
        } catch (err) {
            console.error(err);
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    loadProfile();
  }, [username]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  if (!profile) {
      return <PageNotFound />;
  }

  // The user object is part of the profile object from the public API
  const user = profile;

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans text-[#191c1e]">
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm">
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#eceef0] mb-2">
                  <ProfilePic uname={profile?.firstname} p_pic={profile?.profile_pic} className='w-full h-full text-2xl' />
                </div>
                <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full">
                  <h1 className="text-[20px] font-bold text-[#191c1e] flex items-center gap-2">
                    {profile?.firstname} {profile?.lastname}
                    <button onClick={handleCopy} className="text-[#45464d] hover:text-[#0058be] transition-colors" title="Copy Profile URL">
                      {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </h1>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-[#2170e4] text-white rounded-full text-[12px] font-semibold shadow-sm">
                    {profile?.preferred_role}
                  </span>
                </div>

                <div className="w-full mt-4 mb-4 space-y-3 pt-4 border-t border-[#c6c6cd]">
                  <a href={`mailto:${user?.email}`} className="flex items-center gap-3 text-[#45464d] hover:text-[#0058be] transition-colors group">
                    <Mail size={20} />
                    <span className="text-[14px] truncate">{user?.email}</span>
                  </a>
                  <a href={`https://maps.google.com/?q=${profile?.city},+${profile?.state},+${profile?.country}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#45464d] hover:text-[#0058be] transition-colors group">
                    <MapPin size={20} />
                    <span className="text-[14px]">{profile?.state}, {profile?.country}</span>
                  </a>
                  <div className="flex items-center gap-3 text-[#45464d]">
                    <GraduationCap size={20} />
                    <span className="text-[14px]">{profile?.degree}</span>
                  </div>
                </div>
              </div>
            </div>

            <nav className="bg-white p-2 rounded-xl border border-[#e0e3e5] shadow-sm hidden lg:flex flex-col gap-1">
              {[
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'technical', label: 'Technical Skills', icon: Terminal },
                { id: 'social', label: 'Social Links', icon: LinkIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all duration-200 text-left ${
                    activeTab === tab.id 
                      ? 'bg-[#2170e4] text-white font-bold shadow-md' 
                      : 'text-[#45464d] hover:bg-[#e6e8ea] font-medium'
                  }`}
                >
                  <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-[#7c839b]'} />
                  <span className="text-[14px]">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <section className="flex-1 min-w-0">
            <div className="flex lg:hidden overflow-x-auto border-b border-[#c6c6cd] mb-6 pb-2">
              {[
                { id: 'education', label: 'Education' },
                { id: 'technical', label: 'Technical' },
                { id: 'social', label: 'Socials' },
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

            {activeTab === 'education' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-8">Academic Journey</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be]"><GraduationCap size={28} /></div>
                      <div>
                        <span className="text-[12px] font-semibold text-[#45464d] uppercase">Higher Education</span>
                        <h3 className="text-[20px] font-bold mt-1 text-[#191c1e]">University</h3>
                        <p className="text-[14px] text-[#75859d] mt-2 flex items-center gap-1.5"><Building size={14} /> {profile?.college}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be]"><Building size={28} /></div>
                      <div>
                        <span className="text-[12px] font-semibold text-[#45464d] uppercase">Secondary Education</span>
                        <h3 className="text-[20px] font-bold mt-1 text-[#191c1e]">High School</h3>
                        <p className="text-[14px] text-[#75859d] mt-2 flex items-center gap-1.5"><Building size={14} /> {profile?.school}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full sm:w-1/2">
                    <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be]"><Award size={24} /></div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#45464d] uppercase">Degree</span>
                      <p className="text-[16px] font-bold text-[#191c1e] mt-0.5">{profile?.degree}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-[#e0e3e5]"></div>
                  <div className="flex items-center gap-4 w-full sm:w-1/2 sm:pl-6">
                    <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be]"><Calendar size={24} /></div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#45464d] uppercase">Graduation Year</span>
                      <p className="text-[16px] font-bold text-[#191c1e] mt-0.5">{profile?.graduation_year || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-8">Technical Stack</h2>
                <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm">
                  <h3 className="text-[20px] font-bold mb-6 text-[#191c1e]">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.selectedSkills?.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-[#f2f4f6] text-[#191c1e] text-[14px] font-medium rounded-lg border border-[#c6c6cd]">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-8">Connect & Collaborate</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href={profile?.git_link} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-[#24292e]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#24292e] flex items-center justify-center rounded-lg"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg></div>
                      <div>
                        <h3 className="text-[20px] font-bold text-[#191c1e]">GitHub</h3>
                        <p className="text-[14px] text-[#45464d]">Developer Profile</p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-[#24292e] group-hover:text-white transition-all text-[#191c1e]">View Profile <ExternalLink size={16} /></div>
                  </a>
                  <a href={profile?.linkedin_link} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-[#0077b5]">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#0077b5] flex items-center justify-center rounded-lg"><svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg></div>
                      <div>
                        <h3 className="text-[20px] font-bold text-[#191c1e]">LinkedIn</h3>
                        <p className="text-[14px] text-[#45464d]">Professional Network</p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-[#0077b5] group-hover:text-white transition-all text-[#191c1e]">View Profile <ExternalLink size={16} /></div>
                  </a>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default PublicProfilePage;
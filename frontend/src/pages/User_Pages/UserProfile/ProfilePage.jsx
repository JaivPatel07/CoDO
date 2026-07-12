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
import { fetch_public_profile } from '../../../api/public_apis';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('education');
  const [copied, setCopied] = useState(false);

  
    let { userData, profileData, setProfileData } = useContext(UserContext);
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);

  const handle_editprofile = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:5173/u/profile/${userData.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans text-[#191c1e]">
      
      <main className="max-w-[1280px] mx-auto px-6 py-1">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex flex-col gap-6">
            
            {/* Profile Info Card */}
            <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#eceef0] mb-2 group cursor-pointer">

                  <ProfilePic uname={profileData.firstname} className='w-full h-full text-2xl'></ProfilePic>
                </div>
                <div className="text-center lg:text-left flex flex-col items-center lg:items-start w-full">
                  <h1 className="text-[20px] font-bold text-[#191c1e] flex items-center gap-2">
                    {profileData.firstname} {profileData.lastname}
                    <button onClick={handleCopy} className="text-[#45464d] hover:text-[#0058be] transition-colors" title="Copy Name">
                      {copied ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </h1>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-[#2170e4] text-white rounded-full text-[12px] font-semibold shadow-sm">
                    {profileData.preferred_role}
                  </span>
                </div>

                <div className="w-full mt-4 mb-4 space-y-3 pt-4 border-t border-[#c6c6cd]">
                  <a href={`mailto:${userData.email}`} className="flex items-center gap-3 text-[#45464d] hover:text-[#0058be] transition-colors group">
                    <Mail size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[14px] truncate">{userData.email}</span>
                  </a>
                  <a href={`https://maps.google.com/?q=${profileData.city},+${profileData.city},+${profileData.country}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#45464d] hover:text-[#0058be] transition-colors group">
                    <MapPin size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[14px]">{profileData.state}, {profileData.country}</span>
                  </a>
                  <div className="flex items-center gap-3 text-[#45464d]">
                    <GraduationCap size={20} />
                    <span className="text-[14px]">{profileData.degree}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#45464d]">
                    <div className={`w-3 h-3 rounded-full shadow-inner ${userData.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[14px] capitalize">{userData.is_active ? "Active Status" : "Deactivated"}</span>
                  </div>
                </div>

                <button 
                  onClick={handle_editprofile}
                  className="w-full bg-black text-white text-[14px] font-medium py-2.5 rounded-lg active:scale-95 transition-all duration-300 flex justify-center items-center gap-2 hover:bg-[#2d3133] hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              </div>
            </div>

            {/* Navigation Tabs Card (Desktop) */}
            <nav className="bg-white p-2 rounded-xl border border-[#e0e3e5] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hidden lg:flex flex-col gap-1">
              {[
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'technical', label: 'Technical Skills', icon: Terminal },
                { id: 'social', label: 'Social Links', icon: LinkIcon },
                { id: 'resume', label: 'Resume', icon: FileText }
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

          {/* Main Content */}
          <section className="flex-1 min-w-0">
            
            {/* Mobile Tab Navigation */}
            <div className="flex lg:hidden overflow-x-auto border-b border-[#c6c6cd] mb-6 pb-2 scrollbar-hide">
              {[
                { id: 'education', label: 'Education' },
                { id: 'technical', label: 'Technical' },
                { id: 'social', label: 'Socials' },
                { id: 'resume', label: 'Resume' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 text-[14px] font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'text-black border-b-2 border-black' 
                      : 'text-[#45464d]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content: Education */}
            {activeTab === 'education' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e]">Academic Journey</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* College Card */}
                  <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm hover:border-[#2170e4] hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be] group-hover:bg-[#2170e4] group-hover:text-white transition-colors duration-300">
                        <GraduationCap size={28} />
                      </div>
                      <div>
                        <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">Higher Education</span>
                        <h3 className="text-[20px] font-bold mt-1 text-[#191c1e]">University</h3>
                        <p className="text-[14px] text-[#75859d] mt-2 flex items-center gap-1.5">
                          <Building size={14} /> 
                          {profileData.college}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* High School Card */}
                  <div className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm hover:border-[#2170e4] hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be] group-hover:bg-[#2170e4] group-hover:text-white transition-colors duration-300">
                        <Building size={28} />
                      </div>
                      <div>
                        <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">Secondary Education</span>
                        <h3 className="text-[20px] font-bold mt-1 text-[#191c1e]">High School</h3>
                        <p className="text-[14px] text-[#75859d] mt-2 flex items-center gap-1.5">
                          <Building size={14} /> 
                          {profileData.school}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Added Summary Bar Below */}
                <div className="mt-6 bg-white p-6 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-4 w-full sm:w-1/2">
                    <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be] group-hover:bg-[#e0e3e5] transition-colors">
                      <Award size={24} />
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">Degree Obtained</span>
                      <p className="text-[16px] font-bold text-[#191c1e] mt-0.5">{profileData.degree}</p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block w-px h-12 bg-[#e0e3e5]"></div>
                  
                  <div className="flex items-center gap-4 w-full sm:w-1/2 sm:pl-6">
                    <div className="p-3 bg-[#f2f4f6] rounded-lg text-[#0058be] group-hover:bg-[#e0e3e5] transition-colors">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <span className="text-[12px] font-semibold text-[#45464d] uppercase tracking-wider">Graduation Year</span>
                      <p className="text-[16px] font-bold text-[#191c1e] mt-0.5">{profileData.graduation_year || "Not specified"}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab Content: Technical */}
            {activeTab === 'technical' && (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e]">Technical Stack</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                  <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-[20px] font-bold mb-6 text-[#191c1e]">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.selectedSkills.map((skill, i) => (
                        <span key={i} className="px-4 py-2 bg-[#f2f4f6] text-[#191c1e] text-[14px] font-medium rounded-lg border border-[#c6c6cd] hover:bg-[#2170e4] hover:text-white hover:border-[#2170e4] transition-all cursor-default hover:-translate-y-0.5 shadow-sm">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-[#c6c6cd]">
                      <h4 className="text-[14px] font-bold text-[#191c1e] mb-4">Contribution Velocity</h4>
                      <div className="flex gap-1 h-32 items-end group">
                        {[40, 60, 50, 90, 70, 100, 55, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-[#0058be] rounded-t-sm transition-all duration-500 group-hover:opacity-100" style={{ height: `${h}%`, opacity: (h/100) }}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-black text-white p-8 rounded-xl shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                    <div>
                      <Rocket size={40} className="mb-4 text-[#2170e4]" />
                      <h3 className="text-[20px] font-bold">Preferred Role</h3>
                      <p className="text-[16px] text-[#c6c6cd] mt-2">{profileData.preferred_role}</p>
                    </div>
                    <div className="mt-8">
                      <button className="w-full bg-[#f7f9fb] text-black py-2.5 rounded-lg text-[14px] font-bold hover:bg-[#e0e3e5] active:scale-95 transition-all shadow-md">
                        Download Tech Brief
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content: Social */}
            {activeTab === 'social' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-8">Connect & Collaborate</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a href={profileData.git_link} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-[#24292e] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#24292e] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-[20px] font-bold text-[#191c1e]">GitHub</h3>
                        <p className="text-[14px] text-[#45464d]">Developer Profile</p>
                      </div>
                    </div>
                    <p className="text-[16px] text-[#45464d] mb-6">Browse my open-source projects, components, and codebase contributions.</p>
                    <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-[#24292e] group-hover:text-white group-hover:border-[#24292e] transition-all text-[#191c1e]">
                      View Profile <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </a>
                  
                  <a href={profileData.linkedin_link} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-xl border border-[#e0e3e5] shadow-sm flex flex-col group hover:border-[#0077b5] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#0077b5] flex items-center justify-center rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-[20px] font-bold text-[#191c1e]">LinkedIn</h3>
                        <p className="text-[14px] text-[#45464d]">Professional Network</p>
                      </div>
                    </div>
                    <p className="text-[16px] text-[#45464d] mb-6">Connect for professional networking, technical insights, and career updates.</p>
                    <div className="mt-auto flex items-center justify-center gap-2 py-2.5 border border-[#c6c6cd] rounded-lg text-[14px] font-medium group-hover:bg-[#0077b5] group-hover:text-white group-hover:border-[#0077b5] transition-all text-[#191c1e]">
                      View Profile <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Tab Content: Resume */}
            {activeTab === 'resume' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-[32px] font-semibold tracking-tight text-[#191c1e] mb-8">Resume & Documents</h2>
                <div className="bg-white rounded-xl border border-[#e0e3e5] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 sm:p-8 bg-[#f2f4f6] border-b border-[#c6c6cd] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="text-black" size={24} />
                      <span className="text-[14px] font-bold text-[#191c1e]">My Documents</span>
                    </div>
                    <button className="bg-[#2170e4] text-white px-5 py-2.5 rounded-lg text-[14px] font-semibold flex items-center gap-2 transition-all hover:bg-[#0058be] hover:shadow-md active:scale-95">
                      <Upload size={18} /> Upload File
                    </button>
                  </div>
                  <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center group cursor-pointer">
                    <div className="w-24 h-24 bg-[#f2f4f6] rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:bg-[#e6e8ea] transition-colors">
                      <FileText size={40} className="text-[#c6c6cd] group-hover:text-[#45464d] transition-colors" />
                    </div>
                    <h3 className="text-[24px] font-bold text-[#191c1e] group-hover:text-[#0058be] transition-colors">No documents yet</h3>
                    <p className="text-[16px] text-[#45464d] max-w-sm mt-3 leading-relaxed">
                      Upload your latest resume or CV in PDF format to share with collaborators.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t border-[#c6c6cd] mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1280px] mx-auto gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[14px] font-bold text-[#191c1e]">DevProfile</span>
            <p className="text-[14px] text-[#45464d] mt-1">© {new Date().getFullYear()} {profileData.firstname}. Engineered for excellence.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-[12px] font-semibold text-[#45464d] hover:text-[#0058be] transition-colors" href="#">Privacy Policy</a>
            <a className="text-[12px] font-semibold text-[#45464d] hover:text-[#0058be] transition-colors" href="#">Terms</a>
            <a className="text-[12px] font-semibold text-[#45464d] hover:text-[#0058be] transition-colors" href="#">Contact</a>
          </div>
          <div className="flex gap-4">
            <div className="p-2 bg-[#f2f4f6] rounded-full hover:bg-[#e6e8ea] hover:text-[#0058be] transition-all cursor-pointer">
              <Share2 size={18} className="text-[#45464d]" />
            </div>
            <div className="p-2 bg-[#f2f4f6] rounded-full hover:bg-[#e6e8ea] hover:text-[#0058be] transition-all cursor-pointer">
              <Download size={18} className="text-[#45464d]" />
            </div>
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
          initialData={profileData && Object.keys(profileData).length > 0 ? profileData : null}
        />
      )}
    </div>
  );
};

export default ProfilePage;
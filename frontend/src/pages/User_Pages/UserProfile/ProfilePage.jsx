import React, { useContext, useEffect, useState } from 'react';
import {
  Mail, MapPin, CheckCircle2, Edit2, Copy,
  ExternalLink, GraduationCap,
  User, Link as LinkIcon, Building,
  Briefcase, Star, GitFork, GitPullRequest,
  MessageSquare, UserPlus,
  ShieldCheck, Clock, Activity, Terminal,
  Trash2, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../../contextAPI/userContext';
import ProfileForm from '../ProfileForm/ProfileForm';
import ProfilePic from '../../../components/ProfilePic';
import { fetch_student_profile } from '../../../api/public_apis';
import { useNavigate, useParams } from "react-router-dom";
import { add_network_request, get_networks, remove_network, update_network_request } from '../../../api/networks_api';
import calculate_post_time from '../../../reusable_methods/time_calculator';

// --- CUSTOM SVG ICONS ---
const GithubIcon = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const ProfileHero = ({ profile, user, isOwnProfile, handle_editprofile, handleCopy, copied, onSuccess, onError,user_relation }) => {

  const handleConnectionRequest = async (receiver_username) => {
    try {
      await add_network_request({receiver_username:receiver_username});
      onSuccess("Connection request sent successfully!");
    }
    catch (err) {
      onError(err);
    }
  }

  return (
    <div className="relative mt-2">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start relative z-10">

        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative shrink-0"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-zinc-100 z-10 relative">
            <ProfilePic uname={profile?.firstname} custom_pic_url={profile?.profile_pic} className="w-full h-full text-5xl object-cover" />
          </div>
        </motion.div>

        {/* Info Section */}
        <div className="flex-1 w-full pt-2 md:pt-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
                {profile?.firstname} {profile?.lastname}
                <ShieldCheck size={22} className="text-blue-500" title="Verified Profile" />
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-zinc-500 font-medium">@{user?.username || profile?.firstname?.toLowerCase()}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-blue-500" /> Profile Complete
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                {profile?.preferred_role && (
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                    <Briefcase size={16} className="text-zinc-400" />
                    {profile.preferred_role}
                  </div>
                )}
                {profile?.state && profile?.country && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-zinc-400" />
                    {profile.state}, {profile.country}
                  </div>
                )}
                {user?.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={16} className="text-zinc-400" />
                    {user.email}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0"
            >
              {isOwnProfile ? (
                <>
                  <button
                    onClick={handle_editprofile}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm"
                  >
                    <Edit2 size={16} /> Edit Profile
                  </button>
                  <button
                    onClick={handleCopy}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleConnectionRequest(user.username)}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm">
                    <UserPlus size={16} /> {user_relation}
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 flex justify-center items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 shadow-sm">
                      <MessageSquare size={16} /> Message
                    </button>
                  </div>
                </>
              )}
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileStats = ({ info = [] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="flex flex-wrap md:flex-nowrap gap-2 md:gap-8 py-6 mt-6 border-y border-zinc-200"
  >
    {info.map((stat, i) => (
      <div
        key={i}
        onClick={stat.onClick}
        className={`flex flex-col flex-1 min-w-[30%] md:min-w-0 transition-colors ${stat.onClick ? 'cursor-pointer hover:opacity-75' : ''}`}
      >
        <span className="text-xl font-bold text-zinc-900">{stat.value}</span>
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
      </div>
    ))}
  </motion.div>
);

const ProfessionalLinks = ({ profile }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="py-6 flex flex-wrap gap-3"
  >
    {profile?.git_link && (
      <a href={profile.git_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-sm font-medium transition-all group shadow-sm">
        <GithubIcon size={16} className="text-zinc-900" /> GitHub
        <ExternalLink size={14} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      </a>
    )}
    <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-sm font-medium transition-all group shadow-sm">
      <LinkIcon size={16} className="text-zinc-500" /> Portfolio
    </a>
  </motion.div>
);

const OverviewTab = ({ profile, user }) => (
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
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight mb-4 flex items-center gap-2">
          <User size={20} className="text-zinc-400" /> About Me
        </h2>
        <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap text-[15px]">
          {profile?.bio || "This professional hasn't added a bio yet. They are probably busy writing awesome code!"}
        </p>

        {/* Quick Contact & Details Bar */}
        <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</span>
            <span className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <MapPin size={16} className="text-zinc-400" />
              {profile?.state ? `${profile.state}, ` : ''}{profile?.country || "Not specified"}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact</span>
            <span className="text-sm font-medium text-zinc-900 flex items-center gap-2">
              <Mail size={16} className="text-zinc-400" />
              {user?.email || "Not specified"}
            </span>
          </div>
        </div>
      </section>

      {/* Tech Stack & Skills */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight mb-6 flex items-center gap-2">
          <Terminal size={20} className="text-zinc-400" /> Tech Stack & Skills
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {profile?.selectedSkills && profile.selectedSkills.length > 0 ? (
            profile.selectedSkills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium rounded-xl text-sm transition-colors cursor-default">
                {skill.trim()}
              </span>
            ))
          ) : (
            <p className="text-zinc-500 text-sm">No skills specified.</p>
          )}
        </div>
      </section>

      {/* Recent Activity (Dummy) */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight mb-6 pb-2 flex items-center gap-2">
          <Activity size={20} className="text-zinc-400" /> Recent Activity
        </h2>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-start border-b border-zinc-100 last:border-0 last:pb-0">
              <div className="p-2.5 bg-zinc-50 rounded-full shrink-0 border border-zinc-200">
                <GitPullRequest size={18} className="text-zinc-500" />
              </div>
              <div className="pt-0.5">
                <p className="text-[15px] font-medium text-zinc-900">
                  Merged pull request in <span className="text-blue-600 font-semibold cursor-pointer hover:underline">acme-corp/frontend</span>
                </p>
                <p className="text-xs font-medium text-zinc-500 mt-1">{i} day{i !== 1 && 's'} ago</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    {/* Right Column (Sidebar) */}
    <div className="space-y-6 md:space-y-8">

      {/* Role / Focus Highlight */}
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-md border border-zinc-800 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Briefcase size={80} />
        </div>
        <div className="relative z-10">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Current Focus</h2>
          <p className="text-2xl font-bold leading-tight mb-2">{profile?.preferred_role || "Software Developer"}</p>
          <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Actively building
          </p>
        </div>
      </div>

      {/* Education Timeline */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-6">Education Background</h2>

        <div className="relative pl-5 border-l-2 border-zinc-100 space-y-8">
          {/* College */}
          <div className="relative">
            <div className="absolute -left-[29px] top-0.5 p-1.5 bg-white border border-zinc-200 rounded-full shadow-sm">
              <GraduationCap size={14} className="text-blue-600" />
            </div>
            <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">{profile?.college || "University"}</h3>
            <p className="text-sm font-medium text-zinc-600 mt-1">{profile?.degree}</p>
            {profile?.graduation_year && (
              <p className="text-xs font-semibold text-zinc-400 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
                <Clock size={12} /> Class of {profile.graduation_year}
              </p>
            )}
          </div>

          {/* School */}
          {profile?.school && (
            <div className="relative">
              <div className="absolute -left-[29px] top-0.5 p-1.5 bg-white border border-zinc-200 rounded-full shadow-sm">
                <Building size={14} className="text-zinc-500" />
              </div>
              <h3 className="text-[15px] font-bold text-zinc-900 leading-tight">{profile.school}</h3>
              <p className="text-xs font-semibold text-zinc-500 mt-2 uppercase tracking-wide">Secondary Education</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const GithubTab = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6 md:space-y-8"
  >
    {/* Pinned Repositories */}
    <div>
      <h2 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
        Pinned <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-xs text-zinc-500 font-semibold">6</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'awesome-react-hooks', desc: 'A collection of beautiful and reusable React hooks.', lang: 'TypeScript', color: 'bg-blue-500', stars: '2.4k', forks: '342' },
          { name: 'e-commerce-backend', desc: 'Scalable microservices backend built with Node.js and Redis.', lang: 'JavaScript', color: 'bg-yellow-400', stars: '1.2k', forks: '189' },
          { name: 'django-auth-template', desc: 'Boilerplate for Django projects with JWT authentication.', lang: 'Python', color: 'bg-blue-600', stars: '892', forks: '124' }
        ].map((repo, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-colors flex flex-col h-full cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase size={16} className="text-zinc-400" />
              <span className="font-bold text-blue-600 group-hover:underline">{repo.name}</span>
            </div>
            <p className="text-xs text-zinc-600 mb-5 flex-1 line-clamp-2 leading-relaxed">{repo.desc}</p>
            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${repo.color}`}></div>{repo.lang}</span>
              <span className="flex items-center gap-1 hover:text-blue-600"><Star size={14} /> {repo.stars}</span>
              <span className="flex items-center gap-1 hover:text-blue-600"><GitFork size={14} /> {repo.forks}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// --- MODAL COMPONENT FOR CONNECTIONS ---
const ConnectionsModal = ({ 
  isOpen, 
  onClose, 
  connections, 
  pendingConnections, 
  title, 
  type,
  onRemoveConnection,
  onAcceptConnection,
  onRejectConnection,
  onSuccessMessage,
  onErrorMessage,
  isOwner
}) => {
  if (!isOpen) return null;
  if (!isOwner) return null

  const handleDeleteNetwork = async (user_id) => {
    try {
      await remove_network(user_id);
      onRemoveConnection(user_id);
      onSuccessMessage("Connection removed successfully.");
    }
    catch (err) {
      onErrorMessage(err);
    }
  }

  // Handle Request Accept
  const handleAcceptRequest = async (conn) => {
    try {
      await update_network_request({user_name: conn.username, is_accept: true});
      onAcceptConnection(conn);
      onSuccessMessage(`Accepted connection request from ${conn.fullname}.`);
    } catch (err) {
      onErrorMessage(err);
    }
  }
  
  // Handle Request Reject
  const handleRejectRequest = async (conn) => {
    try {
      await update_network_request({user_name: conn.username, is_accept: false});
      onRejectConnection(conn.username);
      onSuccessMessage(`Rejected connection request from ${conn.fullname}.`);
    } catch (err) {
      onErrorMessage(err);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <UserPlus size={18} className="text-zinc-500" /> {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X size={20} className="text-zinc-500" />
          </button>
        </div>

        {/* Connection List Container */}
        <div className="overflow-y-auto p-2">

          {/* --- 1. MAIN CONNECTIONS SECTION (Followers / Following) --- */}
          {connections.length > 0 && (
            <h4 className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 rounded-lg mx-2 mt-2 mb-2">
              {type === 'followers' ? 'Followers' : 'Following'} ({connections.length})
            </h4>
          )}

          {connections.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              No users found yet.
            </div>
          ) : (
            connections.map((conn) => (
              <div
                key={conn.network_id || conn.user_id}
                className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-zinc-100 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                  <ProfilePic
                    uname={conn.fullname}
                    custom_pic_url={conn.profile_pic}
                    className="w-full h-full object-cover text-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 truncate">{conn.fullname}</p>
                  <p className="text-xs text-zinc-500 truncate">@{conn.username}</p>

                  {conn.connect_at && (
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {calculate_post_time(conn.connect_at)}
                    </p>
                  )}
                </div>
                {/* Trash Icon for removing connection */}
                <button 
                  onClick={() => handleDeleteNetwork(conn.user_id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Connection"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}

          {/* --- 2. PENDING SECTION (ONLY SHOWS FOR FOLLOWERS) --- */}
          {type === 'followers' && pendingConnections?.length > 0 && (
            <div className="mt-4 border-t border-zinc-100 pt-2">
              <h4 className="px-3 py-2 text-xs font-bold text-orange-500 uppercase tracking-wider bg-orange-50/50 rounded-lg mx-2 mt-1 mb-2">
                Pending Requests ({pendingConnections.length})
              </h4>
              {pendingConnections.map((conn) => (
                <div
                  key={conn.network_id || conn.user_id}
                  className="flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-zinc-100 ring-2 ring-transparent transition-all">
                    <ProfilePic
                      uname={conn.fullname}
                      custom_pic_url={conn.profile_pic}
                      className="w-full h-full object-cover text-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">{conn.fullname}</p>
                    <p className="text-xs text-zinc-500 truncate">@{conn.username}</p>
                    {conn.connect_at && (
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {calculate_post_time(conn.connect_at)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Check Icon for Accepting Request */}
                    <button 
                      onClick={() => handleAcceptRequest(conn)}
                      className="p-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      title="Accept Request"
                    >
                      <Check size={18} />
                    </button>
                    {/* Cross Icon for Rejecting Request */}
                    <button 
                      onClick={() => handleRejectRequest(conn)}
                      className="p-2 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      title="Reject Request"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

const ProfilePage = () => {
  const { user_name } = useParams();

  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  let { userData, profileData, setProfileData } = useContext(UserContext);
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);

  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('followers');

  const [publicProfile, setPublicProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [pending, setPending] = useState([]);

  // Toast states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Toast Handler - Success
  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000); // clears after 3 seconds
  };

  // Toast Handler - Error
  const handleShowError = (err) => {
    let msg = "An unexpected error occurred.";
    if (err?.response) {
      const status = err.response.status;
      if (status === 400) msg = "Bad Request: The operation could not be completed.";
      else if (status === 401) msg = "Unauthorized: Please log in to continue.";
      else if (status === 403) msg = "Forbidden: You do not have permission for this action.";
      else if (status === 404) msg = "Not Found: The requested resource does not exist.";
      else if (status >= 500) msg = "Server Error: Please try again later.";
      else msg = err.response?.data?.message || `Error ${status}: Something went wrong.`;
    } else if (err?.message) {
      msg = err.message;
    }
    
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000); // clears after 3 seconds
  };

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

    const fetchConnection = async () => {
      try {
        const res = await get_networks(user_name);
        // console.log(res)
        setFollowers(res.data.followers);
        setFollowing(res.data.following);
        setPending(res.data.pending);
      }
      catch (err) {
        console.log(err?.response);
      }
    }

    loadProfile();
    fetchConnection();
  }, [user_name]);

  const handle_editprofile = () => {
    setIsProfileFormOpen(!isProfileFormOpen);
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsConnectionsModalOpen(true);
  };

  const isOwnProfile = user_name === userData?.username;
  const profile = isOwnProfile ? profileData : publicProfile;
  const user = isOwnProfile ? userData : publicProfile;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/user/${user?.username}/profile`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // State Update Callbacks for ConnectionsModal
  const handleRemoveConnection = (userId) => {
    if (modalType === 'followers') {
      setFollowers(prev => prev.filter(conn => conn.user_id !== userId));
    } else {
      setFollowing(prev => prev.filter(conn => conn.user_id !== userId));
    }
  };

  const handleAcceptConnection = (conn) => {
    setPending(prev => prev.filter(p => p.username !== conn.username));
    setFollowers(prev => [...prev, { ...conn, status: 'accepted' }]);
  };

  const handleRejectConnection = (username) => {
    setPending(prev => prev.filter(p => p.username !== username));
  };


  if (loading && !isOwnProfile) {
    return (
      <div className="min-h-screen flex items-start justify-center bg-zinc-50 pt-24 px-4">
        {/* Loading Skeleton */}
        <div className="w-full max-w-[1080px] animate-pulse">
          <div className="flex gap-6 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-200 rounded-full shrink-0"></div>
            <div className="space-y-4 flex-1 pt-4">
              <div className="h-8 bg-zinc-200 rounded-lg w-1/3"></div>
              <div className="h-4 bg-zinc-200 rounded-lg w-1/4"></div>
              <div className="h-4 bg-zinc-200 rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate('/*', { replace: true });
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'github', label: 'GitHub', icon: GithubIcon }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20 selection:bg-blue-100 selection:text-blue-900 relative">

      {/* --- TOAST NOTIFICATIONS --- */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[250px]"
            >
              <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </motion.div>
          )}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[250px]"
            >
              <X size={20} className="text-red-500 shrink-0" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* ------------------------- */}

      {/* Background Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-10"></div>

      <main className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8">

        <ProfileHero
          profile={profile}
          user={user}
          isOwnProfile={isOwnProfile}
          handle_editprofile={handle_editprofile}
          handleCopy={handleCopy}
          copied={copied}
          onSuccess={handleShowSuccess}
          onError={handleShowError}
          user_relation={profile.user_relation}
        />

        {/* Stats Section with Trigger */}
        <ProfileStats
          info={[
            { label: 'Total Project', value: 0 },
            {
              label: 'Followers',
              value: followers.length,
              onClick: () => handleOpenModal('followers')
            },
            {
              label: 'Following',
              value: following.length,
              onClick: () => handleOpenModal('following')
            },
            { label: 'max streak', value: 0 }
          ]}
        />

        <ProfessionalLinks profile={profile} />

        {/* Sticky Tabs Navigation */}
        <div className="sticky top-0 z-40 pt-4 pb-4 bg-zinc-50/80 backdrop-blur-xl border-b border-zinc-200 mt-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isActive ? 'text-zinc-900 bg-zinc-100/50' : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100/50'
                    }`}
                >
                  <tab.icon size={16} className={isActive ? 'text-zinc-900' : 'text-zinc-400'} />
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
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab key="overview" profile={profile} user={user} />}
            {activeTab === 'github' && <GithubTab key="github" />}
          </AnimatePresence>
        </div>
      </main>

      {/* Connections Modal */}
      <ConnectionsModal
        isOpen={isConnectionsModalOpen}
        onClose={() => setIsConnectionsModalOpen(false)}
        connections={modalType === 'followers' ? followers : following}
        pendingConnections={pending}
        type={modalType}
        title={modalType === 'followers' ? 'Followers' : 'Following'}
        onRemoveConnection={handleRemoveConnection}
        onAcceptConnection={handleAcceptConnection}
        onRejectConnection={handleRejectConnection}
        onSuccessMessage={handleShowSuccess}
        onErrorMessage={handleShowError}
        isOwner={isOwnProfile}
      />

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
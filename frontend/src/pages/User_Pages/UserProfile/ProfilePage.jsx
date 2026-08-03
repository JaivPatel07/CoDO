import React, { useContext, useEffect, useState } from 'react';
import {
  Activity, BookOpen, Briefcase, Building, Check, CheckCircle,
  CheckCircle2, Clock, Code, Copy, Edit2,
  ExternalLink, FolderGit2, GitFork, GitPullRequest,
  GraduationCap, LayoutDashboard, Link as LinkIcon, Mail,
  MapPin, MessageSquare, ShieldCheck, Star, Terminal,
  Trash2, User, UserPlus, Users, X, Trophy, GitCommit,
  AlertCircle, Calendar, ArrowRight, BarChart2
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../../contextAPI/userContext';
import ProfileForm from '../ProfileForm/ProfileForm';
import ProfilePic from '../../../components/ProfilePic';
import { fetch_git_profile, fetch_student_profile } from '../../../api/public_apis';
import { Navigate, useNavigate, useParams } from "react-router-dom";
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

const GitHubRequiredCTA = ({isOwner}) => {
  if (!isOwner) return null
  const handleConnectGithub = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    const redirectUri = "http://localhost:5173/github/callback";

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=read:user user:email`;

    setIsGithubConnected(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-[#e5e7eb] p-8 max-w-2xl mx-auto my-10 text-center shadow-sm">
      <div className="w-16 h-16 bg-zinc-50 border border-zinc-200 rounded-full flex items-center justify-center mx-auto mb-5">
        <GithubIcon size={32} className="text-zinc-400" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">GitHub Connection Required</h3>
      <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">
        Connect your GitHub account to display your contribution graph, repository history, coding streak, language statistics, and open source activity.
      </p>
      <div className="flex flex-col gap-2 items-center text-sm text-zinc-600 mb-8 w-fit mx-auto text-left">
        <span className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Contribution graph</span>
        <span className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Repository history</span>
        <span className="flex items-center gap-2"><Check size={16} className="text-green-500" /> Language statistics</span>
      </div>
      <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2" onClick={() => handleConnectGithub()}>
        <GithubIcon size={16} /> Connect GitHub
      </button>
    </motion.div>
  )
};

const ProfileHero = ({ profile, user, isOwnProfile, handle_editprofile, handleCopy, copied, onSuccess, onError, user_relation, gitData }) => {
  const isGitConnected = !!gitData?.data?.viewer;
  const viewer = gitData?.data?.viewer;

  const handleConnectionRequest = async (receiver_username) => {
    if (user_relation === "Connected") return null;
    try {
      await add_network_request({ receiver_username: receiver_username });
      onSuccess("Connection request sent successfully!");
    } catch (err) {
      onError(err);
    }
  };

  const navigate = useNavigate();
  const handleMessageRequest = async (other_user) => {
    const udata = {
      "other_fullname": `${other_user.firstname} ${other_user.lastname}`,
      "other_username": other_user.username,
      "other_profile_pic": other_user.profile_pic,
      "user2": other_user.user
    };
    navigate(`/user/${localStorage.getItem('username')}/chat`, { state: { receiver: udata } });
  };

  const handleConnectGithub = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    const redirectUri = "http://localhost:5173/github/callback";

    window.location.href =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=read:user user:email`;

    setIsGithubConnected(true);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 md:p-6 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">

        {/* Left: Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-start flex-1 min-w-0">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="shrink-0">
            <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 shrink-0">
              <ProfilePic uname={profile?.firstname} custom_pic_url={profile?.profile_pic} className="w-full h-full text-4xl object-cover" />
            </div>
          </motion.div>

          <div className="flex-1 min-w-0 pt-1">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight truncate">
                  {profile?.firstname} {profile?.lastname}
                </h1>
                <ShieldCheck size={20} className="text-blue-500 shrink-0" title="Verified Profile" />
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-500 mb-3 flex-wrap">
                <span className="font-medium text-zinc-700">@{user?.username || profile?.firstname?.toLowerCase()}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                {profile?.preferred_role && <span className="flex items-center gap-1"><Briefcase size={14} /> {profile.preferred_role}</span>}
                <span className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block"></span>
                {profile?.state && profile?.country && <span className="flex items-center gap-1"><MapPin size={14} /> {profile.state}, {profile.country}</span>}
              </div>

              <p className="text-sm text-zinc-600 line-clamp-2 max-w-2xl mb-4 leading-relaxed">
                {profile?.bio || "Software engineer passionate about building scalable applications and open-source tools."}
              </p>

              <div className="flex flex-wrap gap-2">
                {profile?.selectedSkills?.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-medium rounded-md">
                    {skill.trim()}
                  </span>
                ))}
                {profile?.selectedSkills?.length > 5 && (
                  <span className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 text-zinc-500 text-xs font-medium rounded-md">
                    +{profile.selectedSkills.length - 5}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right: Actions & GitHub Status */}
        <div className="flex flex-col gap-4 w-full lg:w-auto shrink-0">
          <div className="flex gap-2 w-full">
            {isOwnProfile ? (
              <>
                <button onClick={handle_editprofile} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
                <button onClick={handleCopy} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-[#e5e7eb] text-zinc-700 h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <LinkIcon size={14} />}
                  {copied ? 'Copied' : 'Share'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleConnectionRequest(user.username)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  <UserPlus size={14} /> {user_relation}
                </button>
                <button onClick={() => handleMessageRequest(user)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-zinc-50 border border-[#e5e7eb] text-zinc-700 h-[36px] px-4 rounded-lg text-sm font-medium transition-colors">
                  <MessageSquare size={14} /> Message
                </button>
              </>
            )}
          </div>

          {/* Premium GitHub Status Badge */}
          {isGitConnected ? (
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-sm flex flex-col gap-2 min-w-[240px]">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-900"><GithubIcon size={16} /> {viewer.login}</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-md font-medium flex items-center gap-1"><Check size={12} /> Connected</span>
              </div>
              <div className="flex items-center justify-between text-zinc-500 text-xs mt-1">
                <span className="flex items-center gap-1"><BookOpen size={12} /> {viewer.repositories?.totalCount || 0} Repos</span>
                <span className="flex items-center gap-1"><Star size={12} /> {viewer.starredRepositories?.totalCount || 0} Stars</span>
                <span className="flex items-center gap-1"><Users size={12} /> {viewer.followers?.totalCount || 0}</span>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50/50 border border-orange-200 rounded-lg p-3 text-sm flex flex-col gap-2 min-w-[240px]">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-zinc-900 text-xs">Unlock Analytics</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">Connect GitHub to display your developer metrics publicly.</p>
                </div>
              </div>
              {isOwnProfile && (
                <button onClick={() => handleConnectGithub()} className="mt-1 w-full flex items-center justify-center gap-1.5 bg-white border border-orange-200 text-orange-600 h-[28px] rounded-md text-xs font-medium hover:bg-orange-50 transition-colors">
                  Connect Account <ArrowRight size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileStats = ({ info = [] }) => (
  <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-4 md:gap-0 divide-x-0 md:divide-x divide-zinc-200">
    {info.map((stat, i) => (
      <div
        key={i}
        onClick={stat.onClick}
        className={`flex-1 flex flex-col items-center justify-center min-w-[30%] md:min-w-0 ${stat.onClick ? 'cursor-pointer hover:opacity-75 transition-opacity' : ''}`}
      >
        <div className="flex items-center gap-1.5 text-zinc-900">
          {stat.icon && <stat.icon size={16} className="text-zinc-400" />}
          <span className="text-xl font-bold">{stat.value}</span>
        </div>
        <span className="text-xs font-medium text-zinc-500 mt-1">{stat.label}</span>
      </div>
    ))}
  </div>
);

// --- 1. OVERVIEW TAB ---
const OverviewTab = ({ profile, user, isGitConnected }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

    {/* Left Column */}
    <div className="lg:col-span-2 space-y-5">
      {/* About Section */}
      <section className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 mb-3">About</h2>
        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
          {profile?.bio || "This professional hasn't added a bio yet."}
        </p>
      </section>

      {/* Experience / Timeline Mock */}
      <section className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 mb-4 flex items-center justify-between">
          <span>Recent Activity Timeline</span>
        </h2>
      </section>

      {/* Skills Box */}
      <section className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 mb-3">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {profile?.selectedSkills?.length > 0 ? (
            profile.selectedSkills.map((skill, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-800 font-medium rounded-md text-xs cursor-default">
                {skill.trim()}
              </span>
            ))
          ) : (
            <p className="text-zinc-500 text-sm">No skills specified.</p>
          )}
        </div>
      </section>
    </div>

    {/* Right Column (Sidebar) */}
    <div className="space-y-5">
      {/* Profile Completion */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-sm font-bold text-zinc-900">Profile Completion</h2>
          <span className="text-xs font-bold text-blue-600">{isGitConnected ? '100%' : '80%'}</span>
        </div>
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden mb-3">
          <div className={`h-full bg-blue-500 rounded-full ${isGitConnected ? 'w-full' : 'w-4/5'}`}></div>
        </div>
        {!isGitConnected && (
          <p className="text-xs text-zinc-500 flex items-center gap-1"><AlertCircle size={12} /> Connect GitHub to reach 100%</p>
        )}
      </div>

      {/* Developer Badges */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">Badges</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 border border-zinc-100 bg-zinc-50 rounded-lg flex flex-col items-center text-center gap-1">
            <Trophy size={20} className="text-yellow-500" />
            <span className="text-[10px] font-semibold text-zinc-700 uppercase">Beta User</span>
          </div>
          {isGitConnected && (
            <div className="p-3 border border-zinc-100 bg-zinc-50 rounded-lg flex flex-col items-center text-center gap-1">
              <Code size={20} className="text-blue-500" />
              <span className="text-[10px] font-semibold text-zinc-700 uppercase">Open Source</span>
            </div>
          )}
        </div>
      </div>

      {/* Education & Basics */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
        <h2 className="text-sm font-bold text-zinc-900 mb-4">Education & Background</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <GraduationCap size={16} className="text-zinc-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-zinc-900">{profile?.college || "University not listed"}</p>
              <p className="text-xs text-zinc-500">{profile?.degree || "Degree not specified"}</p>
              {profile?.graduation_year && <p className="text-[11px] text-zinc-400 mt-1">Class of {profile.graduation_year}</p>}
            </div>
          </div>
          {profile?.school && (
            <div className="flex items-start gap-3">
              <Building size={16} className="text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-900">{profile.school}</p>
                <p className="text-xs text-zinc-500">Secondary Education</p>
              </div>
            </div>
          )}
          {user?.email && (
            <div className="flex items-start gap-3">
              <Mail size={16} className="text-zinc-400 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-zinc-900 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

// --- 2. ACTIVITY TAB (GitHub Timeline Style) ---
const ActivityTab = ({ gitData,is_owner }) => {
  const viewer = gitData?.data?.viewer;

  if (!viewer) {
    return <GitHubRequiredCTA is_owner={is_owner}/>;
  }

  const contributions = viewer.contributionsCollection || {};
  const calendar = contributions.contributionCalendar || {};
  const weeks = calendar.weeks || [];
  const pullRequests = contributions.pullRequestContributions?.nodes || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5">

      {/* Contribution Heatmap Card */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2"><Calendar size={16} /> {calendar.totalContributions || 0} contributions in the last year</h2>
        </div>
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="inline-flex gap-[3px]">
            {weeks.map((week, index) => (
              <div key={index} className="flex flex-col gap-[3px]">
                {week.contributionDays?.map((day, j) => (
                  <div
                    key={j}
                    className="w-[10px] h-[10px] rounded-[2px]"
                    style={{ backgroundColor: day.contributionCount === 0 ? '#ebedf0' : day.color }}
                    title={`${day.contributionCount} contributions on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GitHub Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2"><GitPullRequest size={16} /> Recent Pull Requests</h2>
          <div className="space-y-4">
            {pullRequests.length === 0 ? (
              <p className="text-sm text-zinc-500">No recent pull requests.</p>
            ) : (
              pullRequests.slice(0, 5).map((pr, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="mt-0.5"><GitPullRequest size={16} className="text-green-600" /></div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      Merged PR in <span className="font-bold">{pr.pullRequest?.repository?.name || pr.repository?.name || 'repository'}</span>
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{new Date(pr.occurredAt).toDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2"><Code size={16} /> Top Languages</h2>
          <div className="space-y-3">
            {/* Mocked Language distribution for premium feel, ideally derived from gitData */}
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> JavaScript</span>
              <span className="font-medium text-zinc-600">45%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> TypeScript</span>
              <span className="font-medium text-zinc-600">30%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-300"></span> React</span>
              <span className="font-medium text-zinc-600">15%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-zinc-300"></span> Other</span>
              <span className="font-medium text-zinc-600">10%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden flex mt-2">
              <div className="h-full bg-yellow-400 w-[45%]"></div>
              <div className="h-full bg-blue-500 w-[30%]"></div>
              <div className="h-full bg-blue-300 w-[15%]"></div>
              <div className="h-full bg-zinc-300 w-[10%]"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. PROJECTS TAB ---
const ProjectsTab = ({ gitData,is_owner }) => {
  const viewer = gitData?.data?.viewer;

  if (!viewer) {
    return <GitHubRequiredCTA is_owner={is_owner} />;
  }

  const repositories = viewer.repositories;
  const reposList = Array.isArray(repositories?.nodes) ? repositories.nodes : [];

  if (reposList.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-10 text-center shadow-sm">
        <FolderGit2 className="mx-auto text-zinc-400 mb-3" size={32} />
        <h3 className="text-sm font-bold text-zinc-900">No repositories found</h3>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reposList.map((repo) => (
          <div key={repo.id || repo.name} className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-sm hover:border-zinc-300 transition-all flex flex-col h-full">
            <div className="flex items-start gap-2 mb-2">
              <FolderGit2 size={16} className="text-zinc-400 mt-0.5 shrink-0" />
              <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-zinc-900 hover:text-blue-600 truncate">
                {repo.name}
              </a>
              <span className="ml-auto text-[10px] border border-zinc-200 px-1.5 py-0.5 rounded-full text-zinc-500">Public</span>
            </div>

            <p className="text-xs text-zinc-600 mb-4 flex-1 line-clamp-2">
              {repo.description || "No description provided."}
            </p>

            <div className="flex items-center gap-3 text-xs text-zinc-500">
              {repo.primaryLanguage && (
                <div className="flex items-center gap-1.5 font-medium text-zinc-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: repo.primaryLanguage.color }} />
                  {repo.primaryLanguage.name}
                </div>
              )}
              <div className="flex items-center gap-1 hover:text-zinc-800 transition-colors cursor-pointer"><Star size={14} /> {repo.stargazerCount}</div>
              <div className="flex items-center gap-1 hover:text-zinc-800 transition-colors cursor-pointer"><GitFork size={14} /> {repo.forkCount}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};


// --- MODAL COMPONENT FOR CONNECTIONS ---
const ConnectionsModal = ({
  isOpen, onClose, connections, pendingConnections, title, type,
  onRemoveConnection, onAcceptConnection, onRejectConnection,
  onSuccessMessage, onErrorMessage, isOwner
}) => {
  if (!isOpen || !isOwner) return null;

  const handleDeleteNetwork = async (user_id) => {
    try {
      await remove_network(user_id);
      onRemoveConnection(user_id);
      onSuccessMessage("Connection removed successfully.");
    } catch (err) {
      onErrorMessage(err);
    }
  };

  const handleAcceptRequest = async (conn) => {
    try {
      await update_network_request({ user_name: conn.username, is_accept: true });
      onAcceptConnection(conn);
      onSuccessMessage(`Accepted connection request from ${conn.fullname}.`);
    } catch (err) {
      onErrorMessage(err);
    }
  };

  const handleRejectRequest = async (conn) => {
    try {
      await update_network_request({ user_name: conn.username, is_accept: false });
      onRejectConnection(conn.username);
      onSuccessMessage(`Rejected connection request from ${conn.fullname}.`);
    } catch (err) {
      onErrorMessage(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[420px] overflow-hidden flex flex-col max-h-[70vh] border border-[#e5e7eb]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-zinc-100 transition-colors"><X size={16} className="text-zinc-500" /></button>
        </div>

        <div className="overflow-y-auto p-2">
          {connections.length > 0 && (
            <h4 className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              {type === 'followers' ? 'Followers' : 'Following'} ({connections.length})
            </h4>
          )}
          {connections.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">No users found.</div>
          ) : (
            connections.map((conn) => (
              <div key={conn.network_id || conn.user_id} className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-lg transition-colors group">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-100">
                  <ProfilePic uname={conn.fullname} custom_pic_url={conn.profile_pic} className="w-full h-full object-cover text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-900 truncate">{conn.fullname}</p>
                  <p className="text-xs text-zinc-500 truncate">@{conn.username}</p>
                </div>
                <button onClick={() => handleDeleteNetwork(conn.user_id)} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md transition-colors" title="Remove Connection">
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}

          {type === 'followers' && pendingConnections?.length > 0 && (
            <div className="mt-4 border-t border-zinc-100 pt-2">
              <h4 className="px-3 py-1 text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">
                Pending Requests ({pendingConnections.length})
              </h4>
              {pendingConnections.map((conn) => (
                <div key={conn.network_id || conn.user_id} className="flex items-center gap-3 p-2 hover:bg-zinc-50 rounded-lg transition-colors group">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-zinc-100">
                    <ProfilePic uname={conn.fullname} custom_pic_url={conn.profile_pic} className="w-full h-full object-cover text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 truncate">{conn.fullname}</p>
                    <p className="text-xs text-zinc-500 truncate">@{conn.username}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleAcceptRequest(conn)} className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-md" title="Accept"><Check size={14} /></button>
                    <button onClick={() => handleRejectRequest(conn)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-md" title="Reject"><X size={14} /></button>
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
  const [userGitData, setUserGitData] = useState(null);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleShowError = (err) => {
    let msg = "An unexpected error occurred.";
    if (err?.response) {
      const status = err.response.status;
      if (status === 400) msg = "Bad Request.";
      else if (status === 401) msg = "Unauthorized.";
      else if (status === 403) msg = "Forbidden.";
      else if (status === 404) msg = "Not Found.";
      else if (status >= 500) msg = "Server Error.";
      else msg = err.response?.data?.message || `Error ${status}.`;
    } else if (err?.message) {
      msg = err.message;
    }
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (!user_name) return;
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (userData.username !== user_name) {
          const data = await fetch_student_profile(user_name);
          setPublicProfile(data);
        }
        const gitdata = await fetch_git_profile(user_name);
        setUserGitData(gitdata);
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
        setFollowers(res.data.followers);
        setFollowing(res.data.following);
        setPending(res.data.pending);
      } catch (err) {
        console.log(err?.response);
      }
    };
    loadProfile();
    fetchConnection();
  }, [user_name, userData]);

  const handle_editprofile = () => setIsProfileFormOpen(!isProfileFormOpen);
  const handleOpenModal = (type) => { setModalType(type); setIsConnectionsModalOpen(true); };

  const isOwnProfile = user_name === userData?.username;
  const profile = isOwnProfile ? profileData : publicProfile;
  const user = isOwnProfile ? userData : publicProfile;
  const isGitConnected = !!userGitData?.data?.viewer;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/user/${user?.username}/profile`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveConnection = (userId) => {
    if (modalType === 'followers') setFollowers(prev => prev.filter(conn => conn.user_id !== userId));
    else setFollowing(prev => prev.filter(conn => conn.user_id !== userId));
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

  if (!profile) {
    navigate('/*', { replace: true });
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-zinc-900 pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {successMessage && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-zinc-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
              <CheckCircle2 size={16} className="text-green-400" /> {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
              <X size={16} className="text-red-500" /> {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 md:pt-10">

        <ProfileHero
          profile={profile} user={user} isOwnProfile={isOwnProfile}
          handle_editprofile={handle_editprofile} handleCopy={handleCopy}
          copied={copied} onSuccess={handleShowSuccess} onError={handleShowError}
          user_relation={profile.user_relation} gitData={userGitData}
        />

        <ProfileStats
          info={[
            { label: 'Repositories', value: userGitData?.data?.viewer?.repositories?.totalCount || 0, icon: FolderGit2 },
            { label: 'Contributions', value: userGitData?.data?.viewer?.contributionsCollection?.contributionCalendar?.totalContributions || 0, icon: GitCommit },
            { label: 'Followers', value: followers.length, onClick: () => handleOpenModal('followers'), icon: Users },
            { label: 'Following', value: following.length, onClick: () => handleOpenModal('following'), icon: UserPlus },
            { label: 'Max Streak', value: isGitConnected ? '32 Days' : '-', icon: Trophy }
          ]}
        />

        {/* Sticky Tabs Navigation */}
        <div className="sticky top-0 z-40 bg-[#fafafa]/90 backdrop-blur-md mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex gap-2 overflow-x-auto scrollbar-hide border-b border-[#e5e7eb]">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 h-12 px-4 text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
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
            {activeTab === 'overview' && <OverviewTab key="overview" profile={profile} user={user} />}
            {activeTab === 'activity' && <ActivityTab key="activity" gitData={userGitData} is_owner={isOwnProfile} />}
            {activeTab === 'projects' && <ProjectsTab key="projects" gitData={userGitData} is_owner={isOwnProfile} />}
          </AnimatePresence>
        </div>
      </main>

      <ConnectionsModal
        isOpen={isConnectionsModalOpen} onClose={() => setIsConnectionsModalOpen(false)}
        connections={modalType === 'followers' ? followers : following} pendingConnections={pending}
        type={modalType} title={modalType === 'followers' ? 'Followers' : 'Following'}
        onRemoveConnection={handleRemoveConnection} onAcceptConnection={handleAcceptConnection}
        onRejectConnection={handleRejectConnection} onSuccessMessage={handleShowSuccess}
        onErrorMessage={handleShowError} isOwner={isOwnProfile}
      />

      {isProfileFormOpen && (
        <ProfileForm
          isOpen={isProfileFormOpen} isCompulsory={false} onClose={() => setIsProfileFormOpen(false)}
          onSuccess={(newProfile) => { setProfileData(newProfile); setIsProfileFormOpen(false); }}
          initialData={profile && Object.keys(profile).length > 0 ? profile : null}
        />
      )}
    </div>
  );
};

export default ProfilePage;
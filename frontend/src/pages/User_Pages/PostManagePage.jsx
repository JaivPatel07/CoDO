import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Calendar, MapPin, Users, Target, CheckCircle2,
    AlertCircle, Loader2, Link as LinkIcon,
    Trash2, Edit2, X, Check, Shield, UserPlus, Clock, Rocket,
    Search, Filter, ChevronRight, Star, Zap, TrendingUp,
    Copy, ExternalLink, RefreshCw, MoreVertical, Eye,
    CheckSquare, XSquare, Info, Globe, Wifi, Lock, Unlock
} from 'lucide-react';
import ProfilePic from '../../components/ProfilePic';
import { delete_collabration_post, fetch_collabration_post, fetch_join_request } from '../../api/user_apis';
import { add_team_member, delete_team_member, get_team_member, team_invite } from '../../api/team_apis';
import { AnimatePresence, motion } from 'framer-motion';

// ─── Sub-components ────────────────────────────────────────────────────────────

const Avatar = ({ username, picUrl, sizeClass = "w-10 h-10" }) => (
    <div className={`${sizeClass} rounded-full overflow-hidden border-2 border-white ring-1 ring-slate-200 shrink-0 bg-slate-100`}>
        <ProfilePic uname={username} custom_pic_url={picUrl} className="w-full h-full object-cover" />
    </div>
);

const Toast = ({ notification }) => (
    <AnimatePresence>
        {notification && (
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-sm min-w-[260px] max-w-sm ${
                    notification.type === 'success'
                        ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
                        : 'bg-red-50/95 border-red-200 text-red-800'
                }`}
            >
                {notification.type === 'success'
                    ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    : <AlertCircle size={18} className="text-red-500 shrink-0" />}
                <span className="text-[13px] font-semibold">{notification.message}</span>
            </motion.div>
        )}
    </AnimatePresence>
);

// Slots progress bar component
const SlotsProgressBar = ({ filled, total, label }) => {
    const pct = total === 0 ? 0 : Math.min(100, (filled / total) * 100);
    const slotsLeft = Math.max(0, total - filled);
    const isFull = slotsLeft === 0;

    const barColor = isFull
        ? 'from-rose-500 to-red-400'
        : pct >= 75
        ? 'from-amber-500 to-orange-400'
        : 'from-violet-600 to-indigo-500';

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${
                    isFull ? 'bg-rose-100 text-rose-600' : 'bg-violet-100 text-violet-700'
                }`}>
                    {isFull ? 'Team Full' : `${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} left`}
                </span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                />
            </div>
            <div className="flex justify-between mt-1.5">
                <span className="text-[11px] text-slate-400 font-medium">{filled} joined</span>
                <span className="text-[11px] text-slate-400 font-medium">{total} total</span>
            </div>
        </div>
    );
};

// Stat card with icon
const StatCard = ({ icon: Icon, label, value, sub, accent = 'indigo', delay = 0 }) => {
    const accents = {
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        violet: 'text-violet-600 bg-violet-50 border-violet-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        rose: 'text-rose-600 bg-rose-50 border-rose-100',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
        >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${accents[accent]} group-hover:scale-110 transition-transform`}>
                <Icon size={17} strokeWidth={2.2} />
            </div>
            <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <p className="text-[22px] font-black text-slate-900 leading-none">{value}</p>
                {sub && <p className="text-[12px] text-slate-500 font-medium mt-1.5 truncate">{sub}</p>}
            </div>
        </motion.div>
    );
};


// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PostManagePage() {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [project, setProject] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [isRequestsLoading, setIsRequestsLoading] = useState(true);

    // Fine-grained loading states
    const [processingActionId, setProcessingActionId] = useState(null);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    const [notification, setNotification] = useState(null);

    // UI State
    const [memberSearch, setMemberSearch] = useState('');
    const [requestSearch, setRequestSearch] = useState('');
    const [activeTab, setActiveTab] = useState('team'); // 'team' | 'requests'
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchData = async (showRefreshing = false) => {
        if (showRefreshing) setIsRefreshing(true);
        try {
            if (!showRefreshing) setIsLoading(true);
            const response = await fetch_collabration_post({ filter: null, sort: null, postId });
            const data = response.data;
            setProject({ ...data, is_owner: data.is_owner });

            if (data.team_id) {
                const teamResponse = await get_team_member(data.team_id);
                const teamData = teamResponse.data;
                let parsedTeam = [];
                if (Array.isArray(teamData) && teamData.length > 0) {
                    const leader = teamData[0];
                    if (leader) {
                        parsedTeam.push({
                            username: leader.leader_user_name,
                            fullname: leader.leader_name || leader.leader_fullname || leader.leader_user_name,
                            isLeader: true,
                            pic_url: leader.leader_pic_url,
                            joined_at: null,
                        });
                    }
                    if (teamData.length > 1 && Array.isArray(teamData[1])) {
                        const members = teamData[1].map(m => ({
                            username: m.member_user_name,
                            fullname: m.member_name || m.member_fullname || m.member_user_name,
                            isLeader: false,
                            pic_url: m.member_pic_url,
                            joined_at: m.joined_at || null,
                        }));
                        parsedTeam = [...parsedTeam, ...members];
                    }
                }
                setTeamMembers(parsedTeam);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load project details.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const fetchRequests = async () => {
        try {
            setIsRequestsLoading(true);
            const response = await fetch_join_request(postId);
            setJoinRequests(response.data || []);
        } catch (err) {
            setNotification({ type: "error", message: "Failed to load candidate requests." });
        } finally {
            setIsRequestsLoading(false);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchData();
            fetchRequests();
        }
    }, [postId]);

    const handleRefresh = async () => {
        await fetchData(true);
        await fetchRequests();
        setNotification({ type: 'success', message: 'Data refreshed.' });
    };

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleAccept = async (eventId, requestId, userId) => {
        const acceptedReq = joinRequests.find(req => req.id === requestId);
        if (!acceptedReq) return;
        const fullName = Array.isArray(acceptedReq.request_fullname) ? acceptedReq.request_fullname[0] : acceptedReq.request_fullname;
        const username = Array.isArray(acceptedReq.request_user_name) ? acceptedReq.request_user_name[0] : acceptedReq.request_user_name;

        setProcessingActionId(`accept-${requestId}`);
        try {
            await add_team_member({ event_id: eventId, action: "accept", user_id: userId, team_id: project.team_id });
            setJoinRequests(prev => prev.filter(req => req.id !== requestId));
            setProject(prev => ({ ...prev, members_required: Math.max(0, prev.members_required - 1) }));
            setTeamMembers(prev => [...prev, {
                username, fullname: fullName, isLeader: false,
                pic_url: acceptedReq.request_user_pic, joined_at: new Date().toISOString()
            }]);
            setSelectedApplicant(null);
            setNotification({ type: 'success', message: `✓ ${fullName} joined the team!` });
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to accept user.' });
        } finally {
            setProcessingActionId(null);
        }
    };

    const handleDecline = async (eventId, requestId, userId) => {
        setProcessingActionId(`decline-${requestId}`);
        try {
            await add_team_member({ event_id: eventId, request_id: requestId, action: "reject", user_id: userId, team_id: project.team_id });
            setJoinRequests(prev => prev.filter(req => req.id !== requestId));
            setSelectedApplicant(null);
            setNotification({ type: 'success', message: 'Request declined.' });
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to decline request.' });
        } finally {
            setProcessingActionId(null);
        }
    };

    const handleRemoveMember = async (targetUsername) => {
        const confirmDelete = window.confirm(`Remove @${targetUsername} from the team?`);
        if (!confirmDelete) return;
        setProcessingActionId(`remove-${targetUsername}`);
        try {
            await delete_team_member(project.team_id, targetUsername);
            setTeamMembers(prev => prev.filter(m => m.username !== targetUsername));
            setProject(prev => ({ ...prev, members_required: prev.members_required + 1 }));
            setNotification({ type: 'success', message: `@${targetUsername} removed from team.` });
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to remove member.' });
        } finally {
            setProcessingActionId(null);
        }
    };

    const copyInviteLink = async () => {
        try {

            const response = await team_invite(project.team_id)
            navigator.clipboard.writeText(response.data.link);
            setIsLinkCopied(true);
            setNotification({ type: 'success', message: 'Invite link copied!' });
            setTimeout(() => setIsLinkCopied(false), 2500);
        }
        catch (err) {
            console.log(err)
        }
    };

    const handleDeletePost = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this collaboration post? This action cannot be undone.");
        if (!confirmDelete) return;
        setIsDeletingPost(true);
        try {
            await delete_collabration_post(project.id);
            setNotification({ type: 'success', message: 'Post deleted successfully.' });
            setTimeout(() => navigate(-1), 1200);
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to delete post.' });
            setIsDeletingPost(false);
        }
    };

    // ─── Derived Values ───────────────────────────────────────────────────────

    const isOwner = project?.is_owner;
    const totalCapacity = project?.team_size || 0;
    const currentMembersCount = teamMembers.length;
    const slotsLeft = Math.max(0, project?.members_required ?? 0);
    const pendingRequests = joinRequests.filter(r => r.status === 'requested');
    const isTeamFull = slotsLeft === 0 && totalCapacity > 0;

    const sortedTeamMembers = useMemo(() =>
        [...teamMembers].sort((a, b) => (a.isLeader === b.isLeader ? 0 : a.isLeader ? -1 : 1)),
        [teamMembers]
    );

    const filteredMembers = useMemo(() =>
        sortedTeamMembers.filter(m =>
            m.fullname?.toLowerCase().includes(memberSearch.toLowerCase()) ||
            m.username?.toLowerCase().includes(memberSearch.toLowerCase())
        ),
        [sortedTeamMembers, memberSearch]
    );

    const filteredRequests = useMemo(() =>
        pendingRequests.filter(req => {
            const name = Array.isArray(req.request_fullname) ? req.request_fullname[0] : req.request_fullname;
            const uname = Array.isArray(req.request_user_name) ? req.request_user_name[0] : req.request_user_name;
            const q = requestSearch.toLowerCase();
            return name?.toLowerCase().includes(q) || uname?.toLowerCase().includes(q);
        }),
        [pendingRequests, requestSearch]
    );

    // ─── Error / Loading States ───────────────────────────────────────────────

    if (error || (!isLoading && !project)) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 border border-red-100 shadow-sm">
                    <AlertCircle size={28} />
                </div>
                <h2 className="text-[20px] font-bold text-slate-900 mb-2">Project Not Found</h2>
                <p className="text-[13px] text-slate-500 mb-7 max-w-xs">The project doesn't exist or you don't have permission to view it.</p>
                <button onClick={() => navigate(-1)} className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[14px] font-semibold shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    // ─── Page ─────────────────────────────────────────────────────────────────

    return (
        <div className="font-sans text-slate-900 selection:bg-violet-100 selection:text-violet-900">

            {/* Toast */}
            <div className="fixed top-5 right-5 z-[200]">
                <Toast notification={notification} />
            </div>

            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Applicant Detail Drawer */}
                    <AnimatePresence>
                        {selectedApplicant && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
                                    onClick={() => setSelectedApplicant(null)}
                                />
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                                    className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-[160] flex flex-col"
                                >
                                    {/* Drawer Header */}
                                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                                        <h3 className="text-[16px] font-bold text-slate-900">Applicant Details</h3>
                                        <button onClick={() => setSelectedApplicant(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Drawer Body */}
                                    <div className="flex-1 overflow-y-auto p-6">
                                        {/* Profile */}
                                        <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-slate-100">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white ring-2 ring-violet-200 mb-4 shadow-md">
                                                <ProfilePic uname={selectedApplicant.username} custom_pic_url={selectedApplicant.pic_url} className="w-full h-full object-cover" />
                                            </div>
                                            <h4 className="text-[18px] font-bold text-slate-900">{selectedApplicant.fullName}</h4>
                                            <p className="text-[13px] text-slate-500 mt-0.5">@{selectedApplicant.username}</p>
                                            <button
                                                onClick={() => navigate(`/user/${selectedApplicant.username}/profile`)}
                                                className="mt-3 flex items-center gap-1.5 text-[12px] text-violet-600 font-semibold hover:underline"
                                            >
                                                <ExternalLink size={13} /> View full profile
                                            </button>
                                        </div>

                                        {/* Applied for info */}
                                        <div className="rounded-xl bg-violet-50 border border-violet-100 p-4 mb-5">
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-violet-500 mb-1">Applied For</p>
                                            <p className="text-[14px] font-semibold text-violet-900">{project?.title}</p>
                                        </div>

                                        {/* Request info */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <Clock size={15} className="text-slate-400 shrink-0" />
                                                <div>
                                                    <p className="text-[11px] text-slate-400 font-semibold uppercase">Request Status</p>
                                                    <p className="text-[13px] font-bold text-amber-600">Pending Review</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Drawer Footer */}
                                    <div className="p-5 border-t border-slate-100 flex flex-col gap-2.5">
                                        <button
                                            onClick={() => handleAccept(selectedApplicant.req.event, selectedApplicant.req.id, selectedApplicant.req.user)}
                                            disabled={processingActionId === `accept-${selectedApplicant.req.id}` || isTeamFull}
                                            className="w-full h-11 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-[14px] font-bold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processingActionId === `accept-${selectedApplicant.req.id}`
                                                ? <Loader2 size={16} className="animate-spin" />
                                                : <><CheckSquare size={16} /> {isTeamFull ? 'Team Full' : 'Accept & Add to Team'}</>}
                                        </button>
                                        <button
                                            onClick={() => handleDecline(selectedApplicant.req.event, selectedApplicant.req.id, selectedApplicant.req.user)}
                                            disabled={processingActionId === `decline-${selectedApplicant.req.id}`}
                                            className="w-full h-11 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[14px] font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50"
                                        >
                                            {processingActionId === `decline-${selectedApplicant.req.id}`
                                                ? <Loader2 size={16} className="animate-spin" />
                                                : <><XSquare size={16} /> Decline</>}
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* ── Back + Actions Bar ── */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm disabled:opacity-50"
                                title="Refresh data"
                            >
                                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
                            </button>
                            {!isLoading && isOwner && (
                                <>
                                    <button
                                        onClick={() => navigate(`/user/${localStorage.getItem("username")}/createpost`, { state: { postId: project.id, projectData: project } })}
                                        className="h-9 px-4 flex items-center gap-1.5 bg-white border border-slate-200 text-[13px] font-semibold text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                                    >
                                        <Edit2 size={14} /> Edit Post
                                    </button>
                                    <button
                                        onClick={handleDeletePost}
                                        disabled={isDeletingPost}
                                        className="h-9 px-4 flex items-center gap-1.5 bg-white border border-rose-200 text-[13px] font-semibold text-rose-600 rounded-xl shadow-sm hover:bg-rose-50 transition-all disabled:opacity-50"
                                    >
                                        {isDeletingPost ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Header ── */}
                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-9 bg-slate-200 rounded-xl w-2/3 mb-3" />
                            <div className="h-4 bg-slate-200 rounded-lg w-full max-w-xl" />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                <h1 className="text-[30px] leading-tight font-black text-slate-900 tracking-tight">
                                    {project.title}
                                </h1>
                                {/* Status badge */}
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${
                                    project.status
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                        : 'bg-slate-100 border-slate-200 text-slate-500'
                                }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${project.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                    {project.status ? 'Open' : 'Closed'}
                                </span>
                                {project.event_type && (
                                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-violet-50 border border-violet-200 text-violet-700">
                                        {project.event_type}
                                    </span>
                                )}
                            </div>
                            <p className="text-[14px] text-slate-500 max-w-2xl leading-relaxed">
                                {project.description || "Manage your event timeline, review candidate applications, and build your core team."}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Stats Grid ── */}
                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-[120px]">
                                <div className="w-9 h-9 bg-slate-100 rounded-xl mb-3" />
                                <div className="h-3 bg-slate-100 rounded w-16 mb-2" />
                                <div className="h-6 bg-slate-100 rounded w-24" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={MapPin}
                            label="Location"
                            value={project.event_location || project.event_mode || 'Remote'}
                            sub={project.event_type || 'Global'}
                            accent="violet"
                            delay={0}
                        />
                        <StatCard
                            icon={Calendar}
                            label="Timeline"
                            value={project.start_date || 'TBD'}
                            sub={project.end_date ? `Ends ${project.end_date}` : 'Ongoing'}
                            accent="indigo"
                            delay={0.06}
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Applications"
                            value={joinRequests.length}
                            sub={`${pendingRequests.length} pending review`}
                            accent="amber"
                            delay={0.12}
                        />
                        <StatCard
                            icon={Users}
                            label="Team"
                            value={`${currentMembersCount}/${totalCapacity}`}
                            sub={isTeamFull ? '🎉 Team complete!' : `${slotsLeft} open slot${slotsLeft !== 1 ? 's' : ''}`}
                            accent={isTeamFull ? 'emerald' : 'rose'}
                            delay={0.18}
                        />
                    </div>
                )}

                {/* ── Slots Progress Banner ── */}
                {!isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                            <div className="flex-1">
                                <SlotsProgressBar
                                    filled={currentMembersCount}
                                    total={totalCapacity}
                                    label="Available Slots"
                                />
                            </div>
                            <div className="shrink-0 flex items-center gap-3">
                                {/* Mini member avatars */}
                                {sortedTeamMembers.length > 0 && (
                                    <div className="flex -space-x-2">
                                        {sortedTeamMembers.slice(0, 5).map((m, i) => (
                                            <div key={m.username} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white ring-1 ring-slate-200 bg-slate-100" style={{ zIndex: 10 - i }}>
                                                <ProfilePic uname={m.username} custom_pic_url={m.pic_url} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {sortedTeamMembers.length > 5 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
                                                +{sortedTeamMembers.length - 5}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button
                                    onClick={copyInviteLink}
                                    className="h-9 px-4 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-[13px] font-bold shadow-md shadow-violet-500/20 hover:from-violet-700 hover:to-indigo-700 transition-all"
                                >
                                    {isLinkCopied ? <><Check size={14} /> Copied!</> : <><LinkIcon size={14} /> Invite</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Main Content Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

                    {/* ─── LEFT: Team + Invite ─── */}
                    <div className="lg:col-span-7 flex flex-col gap-6">

                        {/* Team Members Section */}
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Section Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-[17px] font-bold text-slate-900">Team Members</h2>
                                    <p className="text-[12px] text-slate-500 mt-0.5">Active participants & roles</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-[12px] font-bold px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700">
                                        {teamMembers.length} / {totalCapacity}
                                    </span>
                                </div>
                            </div>

                            {/* Search bar */}
                            {!isLoading && teamMembers.length > 0 && (
                                <div className="px-6 pt-4 pb-2">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search members…"
                                            value={memberSearch}
                                            onChange={e => setMemberSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 h-9 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400"
                                        />
                                        {memberSearch && (
                                            <button onClick={() => setMemberSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                <X size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="p-6 pt-3">
                                {isLoading ? (
                                    <div className="flex flex-col gap-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-200 rounded-full" />
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-slate-200 rounded w-28" />
                                                        <div className="h-3 bg-slate-200 rounded w-16" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : teamMembers.length === 0 ? (
                                    <div className="py-14 flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center mb-4">
                                            <Users size={22} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-[14px] font-bold text-slate-700 mb-1">No team members yet</h3>
                                        <p className="text-[12px] text-slate-400 max-w-[200px]">Accept requests from the right panel to build your team.</p>
                                    </div>
                                ) : filteredMembers.length === 0 ? (
                                    <div className="py-10 flex flex-col items-center justify-center text-center">
                                        <Search size={20} className="text-slate-300 mb-2" />
                                        <p className="text-[13px] text-slate-500 font-medium">No members match "<span className="text-slate-700">{memberSearch}</span>"</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        <AnimatePresence initial={false}>
                                            {filteredMembers.map((member, idx) => (
                                                <motion.div
                                                    key={member.username}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <Avatar username={member.username} picUrl={member.pic_url} sizeClass="w-10 h-10" />
                                                        <div className="min-w-0">
                                                            <span
                                                                onClick={() => navigate(`/user/${member.username}/profile`)}
                                                                className="font-bold text-[14px] text-slate-900 cursor-pointer hover:text-violet-600 transition-colors truncate block"
                                                            >
                                                                {member.fullname}
                                                            </span>
                                                            <span className="text-[12px] text-slate-400 truncate">@{member.username}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0 pl-3">
                                                        {member.isLeader ? (
                                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-lg">
                                                                <Star size={11} fill="currentColor" /> Leader
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-semibold rounded-lg">
                                                                <CheckCircle2 size={11} /> Member
                                                            </span>
                                                        )}
                                                        {!member.isLeader && isOwner && (
                                                            <button
                                                                onClick={() => handleRemoveMember(member.username)}
                                                                disabled={processingActionId === `remove-${member.username}`}
                                                                className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                                                title={`Remove ${member.fullname}`}
                                                            >
                                                                {processingActionId === `remove-${member.username}` ? <Loader2 size={13} className="animate-spin" /> : <X size={14} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Invite / Share Link Card */}
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                                    <Rocket size={16} className="text-violet-600" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-bold text-slate-900">Invite Link</h2>
                                    <p className="text-[12px] text-slate-500 mt-0.5">Share to let others discover and apply to your project.</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 h-10 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
                                    <Globe size={13} className="text-slate-400 shrink-0" />
                                    <input
                                        readOnly
                                        value={`${window.location.origin}/post/${postId}`}
                                        className="w-full bg-transparent text-[13px] text-slate-600 outline-none truncate"
                                        aria-label="Invite Link"
                                    />
                                </div>
                                <button
                                    onClick={copyInviteLink}
                                    className="h-10 px-4 flex items-center gap-2 bg-slate-900 text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-slate-700 transition-all shrink-0"
                                >
                                    {isLinkCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                                </button>
                            </div>

                            {/* Quick info row */}
                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
                                {project?.event_mode && (
                                    <span className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                                        {project.event_mode === 'Online' ? <Wifi size={13} /> : <MapPin size={13} />}
                                        {project.event_mode}
                                    </span>
                                )}
                                {project?.start_date && (
                                    <span className="flex items-center gap-1.5 text-[12px] text-slate-500 font-medium">
                                        <Calendar size={13} /> {project.start_date}
                                    </span>
                                )}
                                {project?.skills?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.skills.slice(0, 4).map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-600">{s}</span>
                                        ))}
                                        {project.skills.length > 4 && (
                                            <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[11px] font-semibold text-slate-500">+{project.skills.length - 4}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* ─── RIGHT: Pending Requests ─── */}
                    <div className="lg:col-span-5">
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
                            {/* Section Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-[17px] font-bold text-slate-900">Applications</h2>
                                    <p className="text-[12px] text-slate-500 mt-0.5">Review & manage join requests</p>
                                </div>
                                {pendingRequests.length > 0 && (
                                    <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[12px] font-black h-6 min-w-6 px-2 flex items-center justify-center rounded-full shadow-sm shadow-violet-400/30">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </div>

                            {/* Search */}
                            {!isRequestsLoading && pendingRequests.length > 0 && (
                                <div className="px-6 pt-4 pb-2">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search applicants…"
                                            value={requestSearch}
                                            onChange={e => setRequestSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 h-9 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400"
                                        />
                                        {requestSearch && (
                                            <button onClick={() => setRequestSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                <X size={13} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Team full warning */}
                            {!isRequestsLoading && isTeamFull && pendingRequests.length > 0 && (
                                <div className="mx-6 mt-3 px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                                    <Info size={14} className="text-amber-500 shrink-0" />
                                    <p className="text-[12px] text-amber-700 font-semibold">Team is full. Remove a member to accept more.</p>
                                </div>
                            )}

                            {/* List */}
                            <div className="p-5 pt-3 max-h-[580px] overflow-y-auto space-y-3">
                                {isRequestsLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="animate-pulse p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 bg-slate-200 rounded w-24" />
                                                    <div className="h-3 bg-slate-200 rounded w-16" />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="h-8 bg-slate-200 rounded-lg flex-1" />
                                                <div className="h-8 bg-slate-200 rounded-lg flex-1" />
                                            </div>
                                        </div>
                                    ))
                                ) : pendingRequests.length === 0 ? (
                                    <div className="py-14 flex flex-col items-center justify-center text-center">
                                        <div className="w-14 h-14 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center mb-4">
                                            <Target size={22} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-[14px] font-bold text-slate-700 mb-1">Inbox Zero 🎉</h3>
                                        <p className="text-[12px] text-slate-400">No pending requests right now.</p>
                                    </div>
                                ) : filteredRequests.length === 0 ? (
                                    <div className="py-10 flex flex-col items-center text-center">
                                        <Search size={20} className="text-slate-300 mb-2" />
                                        <p className="text-[13px] text-slate-500 font-medium">No applicants match</p>
                                    </div>
                                ) : (
                                    <AnimatePresence initial={false}>
                                        {filteredRequests.map((req, idx) => {
                                            const username = Array.isArray(req.request_user_name) ? req.request_user_name[0] : req.request_user_name;
                                            const fullName = Array.isArray(req.request_fullname) ? req.request_fullname[0] : req.request_fullname;
                                            const isAccepting = processingActionId === `accept-${req.id}`;
                                            const isDeclining = processingActionId === `decline-${req.id}`;
                                            const isProcessing = isAccepting || isDeclining;

                                            return (
                                                <motion.div
                                                    key={req.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: 30, scale: 0.95 }}
                                                    transition={{ delay: idx * 0.04 }}
                                                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/20 transition-all group"
                                                >
                                                    {/* User Info */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Avatar username={username} picUrl={req.request_user_pic} sizeClass="w-10 h-10" />
                                                            <div className="min-w-0">
                                                                <span
                                                                    onClick={() => navigate(`/user/${username}/profile`)}
                                                                    className="font-bold text-[13px] text-slate-900 cursor-pointer hover:text-violet-600 truncate block transition-colors"
                                                                >
                                                                    {fullName}
                                                                </span>
                                                                <span className="text-[12px] text-slate-400 truncate">@{username}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedApplicant({ username, fullName, pic_url: req.request_user_pic, req })}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-violet-100 hover:text-violet-600 opacity-0 group-hover:opacity-100 transition-all"
                                                            title="View details"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => handleAccept(req.event, req.id, req.user)}
                                                            disabled={isProcessing || isTeamFull}
                                                            className="h-8 flex items-center justify-center gap-1.5 text-[12px] font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-violet-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isAccepting
                                                                ? <Loader2 size={13} className="animate-spin" />
                                                                : <><Check size={13} /> Accept</>}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDecline(req.event, req.id, req.user)}
                                                            disabled={isProcessing}
                                                            className="h-8 flex items-center justify-center gap-1.5 text-[12px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isDeclining
                                                                ? <Loader2 size={13} className="animate-spin" />
                                                                : <><X size={13} /> Decline</>}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
            </div>
        </div>
    );
}

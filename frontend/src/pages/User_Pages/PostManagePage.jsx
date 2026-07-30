import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Calendar, Map, Users, Target, CheckCircle, 
    AlertCircle, Loader2, PieChart, Link as LinkIcon, 
    Trash2, Edit2, X, Check, Shield, UserPlus, Clock
} from 'lucide-react';
import ProfilePic from '../../components/ProfilePic';
import { delete_collabration_post, fetch_collabration_post, fetch_join_request } from '../../api/user_apis';
import { add_team_member, delete_team_member, get_team_member } from '../../api/team_apis';

export default function PostManagePage() {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [project, setProject] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [teamMembers, setTeamMembers] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [isRequestsLoading, setIsRequestsLoading] = useState(true);
    
    // Fine-grained Loading States for Premium UX
    const [processingActionId, setProcessingActionId] = useState(null);
    const [isDeletingEvent, setIsDeletingEvent] = useState(false);
    const [isLinkCopied, setIsLinkCopied] = useState(false);
    
    const [notification, setNotification] = useState(null);

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Fetch API Data
    useEffect(() => {
        const fetch_post_team = async () => {
            try {
                setIsLoading(true);
                const response = await fetch_collabration_post({ filter: null, sort: null, postId: postId });
                const data = response.data;

                setProject({
                    ...data,
                    team_size: data.team_size || 1,
                    members_required: data.members_required || 3,
                    is_owner: data.is_owner
                });

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
                                joined_at: null
                            });
                        }

                        if (teamData.length > 1 && Array.isArray(teamData[1])) {
                            const members = teamData[1].map(m => ({
                                username: m.member_user_name,
                                fullname: m.member_name || m.member_fullname || m.member_user_name,
                                isLeader: false,
                                pic_url: m.member_pic_url,
                                joined_at: m.joined_at || null
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
            }
        };

        const fetch_requests = async () => {
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

        if (postId) {
            fetch_post_team();
            fetch_requests();
        }
    }, [postId]);

    // Handlers
    const handleAccept = async (eventId, requestId, userId) => {
        const acceptedReq = joinRequests.find(req => req.id === requestId);
        if (!acceptedReq) return;

        const fullName = Array.isArray(acceptedReq.request_fullname) ? acceptedReq.request_fullname[0] : acceptedReq.request_fullname;
        const username = Array.isArray(acceptedReq.request_user_name) ? acceptedReq.request_user_name[0] : acceptedReq.request_user_name;

        setProcessingActionId(`accept-${requestId}`);
        try {
            await add_team_member({ event_id: eventId, action: "accept", user_id: userId, team_id: project.team_id });
            
            // Optimistic Update
            setJoinRequests(prev => prev.filter(req => req.id !== requestId));
            setProject(prev => ({ ...prev, team_size: prev.team_size + 1, members_required: Math.max(0, prev.members_required - 1) }));
            setTeamMembers(prev => [...prev, {
                username: username, fullname: fullName, isLeader: false, pic_url: acceptedReq.request_user_pic, joined_at: new Date().toISOString()
            }]);

            setNotification({ type: 'success', message: `${fullName} joined the team.` });
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to accept user.' });
        } finally {
            setProcessingActionId(null);
        }
    };

    const handleDecline = async (eventId, requestId, userId) => {
        setProcessingActionId(`decline-${requestId}`);
        try {
            await update_join_status({ event_id: eventId, request_id: requestId, action: "reject", user_id: userId, team_id: project.team_id });
            
            // Optimistic Update
            setJoinRequests(prev => prev.filter(req => req.id !== requestId));
            
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
            
            // Optimistic Update
            setTeamMembers(prev => prev.filter(member => member.username !== targetUsername));
            setProject(prev => ({ ...prev, team_size: Math.max(1, prev.team_size - 1), members_required: prev.members_required + 1 }));
            
            setNotification({ type: 'success', message: 'Member removed.' });
        } catch (err) {
            setNotification({ type: 'error', message: err.response?.data?.message || 'Failed to remove member.' });
        } finally {
            setProcessingActionId(null);
        }
    };

    const copyInviteLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        setIsLinkCopied(true);
        setNotification({ type: 'success', message: 'Invite link copied to clipboard!' });
        setTimeout(() => setIsLinkCopied(false), 2000);
    };

    const handleDeleteEvent = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
        if (!confirmDelete) return;

        setIsDeletingEvent(true);
        try {
            await delete_collabration_post(project.id)
            setNotification({ type: 'success', message: 'Event deleted successfully.' });
            setTimeout(() => navigate(-1), 1000);
        } catch (err) {
            setNotification({ type: 'error', message: err?.response || 'Failed to delete event. ' });
            setIsDeletingEvent(false);
        }
    };

    const Avatar = ({ username, picUrl, sizeClass = "w-10 h-10" }) => {
        return (
            <div className={`${sizeClass} rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-50`}>
                <ProfilePic uname={username} custom_pic_url={picUrl} className="w-full h-full object-cover" />
            </div>
        );
    };

    // Helper Variables
    const isOwner = project?.is_owner === true;
    const totalSpots = (project?.team_size || 0);
    const fillPercentage = totalSpots === 0 ? 0 : Math.min(100, (teamMembers.length / totalSpots) * 100);
    const pendingRequests = joinRequests.filter(r => r.status === 'requested');
    const sortedTeamMembers = [...teamMembers].sort((a, b) => (a.isLeader === b.isLeader ? 0 : a.isLeader ? -1 : 1));

    // Error State
    if (error || (!isLoading && !project)) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-red-100 shadow-sm">
                    <AlertCircle size={28} />
                </div>
                <h2 className="text-[22px] font-semibold text-slate-900 mb-2">Project Not Found</h2>
                <p className="text-[13px] text-slate-500 font-medium mb-8 max-w-sm">The project you're looking for doesn't exist or you lack permission to view it.</p>
                <button onClick={() => navigate(-1)} className="h-10 px-6 bg-slate-900 text-white rounded-lg text-[14px] font-medium shadow-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
            
            {/* Vercel-style Premium Toast Notification */}
            {notification && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-6 fade-in duration-200">
                    <div className={`px-5 py-3.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border text-[14px] font-medium flex items-center gap-3 backdrop-blur-md ${
                        notification.type === 'success' 
                            ? 'bg-slate-900/95 text-white border-slate-800' 
                            : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                        {notification.type === 'success' ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertCircle size={18} />}
                        {notification.message}
                    </div>
                </div>
            )}

            <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-1">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-2 text-[13px] font-medium text-slate-500 hover:text-slate-900 mb-50 transition-colors w-max outline-none rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAFAFA]"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to dashboard
                </button>

                {/* ================= HEADER SECTION ================= */}
                {isLoading ? (
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 animate-pulse">
                        <div className="flex-1 w-full space-y-3">
                            <div className="h-10 bg-slate-200 rounded-lg w-3/4 max-w-md"></div>
                            <div className="h-5 bg-slate-200 rounded-md w-full max-w-2xl"></div>
                        </div>
                        <div className="w-[200px] h-10 bg-slate-200 rounded-lg shrink-0"></div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-[36px] leading-[1.1] font-bold text-slate-900 truncate tracking-tight">
                                {project.title}
                            </h1>
                            <p className="text-[15px] text-slate-500 mt-3 max-w-3xl leading-relaxed line-clamp-2">
                                {project.description || "Manage your event timeline, review candidate applications, and organize your core team for deployment."}
                            </p>
                        </div>

                        {/* Owner Actions */}
                        {isOwner && (
                            <div className="flex items-center gap-3 shrink-0 pt-1">
                                <button 
                                    onClick={() => alert("not yet ready😓")} 
                                    className="h-10 px-5 flex items-center gap-2 bg-white border border-slate-200 text-[14px] font-medium text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button 
                                    onClick={handleDeleteEvent}
                                    disabled={isDeletingEvent}
                                    className="h-10 px-5 flex items-center gap-2 bg-white border border-red-200 text-[14px] font-medium text-red-600 rounded-lg shadow-sm hover:bg-red-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeletingEvent ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ================= STATS CARDS ================= */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 h-[140px] animate-pulse flex flex-col justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 bg-slate-200 rounded"></div>
                                    <div className="h-4 w-20 bg-slate-200 rounded"></div>
                                </div>
                                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Location */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[140px] transition-shadow hover:shadow-md group">
                            <div className="flex items-center gap-2.5 mb-4 text-slate-500 group-hover:text-slate-900 transition-colors">
                                <Map size={18} strokeWidth={2} />
                                <span className="text-[13px] font-semibold tracking-wide uppercase">Location</span>
                            </div>
                            <div className="mt-auto">
                                <p className="text-[26px] font-semibold text-slate-900 truncate leading-none capitalize" title={project.event_location || project.event_mode || 'Remote'}>
                                    {project.event_location || project.event_mode || 'Remote'}
                                </p>
                                <p className="text-[13px] text-slate-500 font-medium truncate mt-2">
                                    {project.event_type || 'Global Access'}
                                </p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[140px] transition-shadow hover:shadow-md group">
                            <div className="flex items-center gap-2.5 mb-4 text-slate-500 group-hover:text-slate-900 transition-colors">
                                <Calendar size={18} strokeWidth={2} />
                                <span className="text-[13px] font-semibold tracking-wide uppercase">Timeline</span>
                            </div>
                            <div className="mt-auto">
                                <p className="text-[26px] font-semibold text-slate-900 truncate leading-none">
                                    {project.start_date || 'TBD'}
                                </p>
                                <p className="text-[13px] text-slate-500 font-medium truncate mt-2">
                                    {project.end_date ? `Ends ${project.end_date}` : 'Ongoing duration'}
                                </p>
                            </div>
                        </div>

                        {/* Applications */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[140px] transition-shadow hover:shadow-md group">
                            <div className="flex items-center gap-2.5 mb-4 text-slate-500 group-hover:text-slate-900 transition-colors">
                                <PieChart size={18} strokeWidth={2} />
                                <span className="text-[13px] font-semibold tracking-wide uppercase">Engagement</span>
                            </div>
                            <div className="mt-auto">
                                <p className="text-[26px] font-semibold text-slate-900 leading-none">
                                    {joinRequests.length}
                                </p>
                                <p className="text-[13px] text-slate-500 font-medium truncate mt-2">
                                    Total applications
                                </p>
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between h-[140px] transition-shadow hover:shadow-md group">
                            <div className="flex items-center gap-2.5 mb-2 text-slate-500 group-hover:text-slate-900 transition-colors">
                                <Users size={18} strokeWidth={2} />
                                <span className="text-[13px] font-semibold tracking-wide uppercase">Capacity</span>
                            </div>
                            <div className="w-full mt-auto">
                                <div className="flex justify-between items-end mb-2.5">
                                    <p className="text-[26px] font-semibold text-slate-900 leading-none">{teamMembers.length}/{totalSpots}</p>
                                    <p className="text-[13px] font-semibold text-slate-500 leading-none mb-0.5">{Math.round(fillPercentage)}%</p>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${fillPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                        style={{ width: `${fillPercentage}%` }} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= MAIN CONTENT SPLIT ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: TEAM MEMBERS & INVITE (8 Cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        
                        {/* TEAM MANAGEMENT */}
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
                                <div>
                                    <h2 className="text-[22px] font-semibold text-slate-900">Team Members</h2>
                                    <p className="text-[13px] text-slate-500 mt-1">Manage active participants and roles.</p>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-semibold px-3 py-1 rounded-full">
                                    {teamMembers.length} Active
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50/50">
                                {isLoading ? (
                                    <div className="flex flex-col gap-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-slate-100 rounded w-28"></div>
                                                        <div className="h-3 bg-slate-100 rounded w-16"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : teamMembers.length === 0 ? (
                                    <div className="py-16 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-xl">
                                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Users size={20} className="text-slate-400" />
                                        </div>
                                        <h3 className="text-[15px] text-slate-900 font-semibold">No team members</h3>
                                        <p className="text-[13px] text-slate-500 mt-1">Accept requests to start building your team.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {sortedTeamMembers.map((member) => (
                                            <div key={member.username} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors group w-full">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <Avatar username={member.username} picUrl={member.pic_url} sizeClass="w-10 h-10" />
                                                    <div className="flex flex-col min-w-0">
                                                        <span 
                                                            onClick={() => navigate(`/user/${member.username}/profile`)} 
                                                            className="font-semibold text-[14px] text-slate-900 cursor-pointer hover:text-indigo-600 transition-colors truncate"
                                                        >
                                                            {member.fullname}
                                                        </span>
                                                        <span className="text-[13px] text-slate-500 truncate mt-0.5">
                                                            @{member.username}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 shrink-0 pl-4">
                                                    {member.isLeader ? (
                                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-[12px] font-semibold rounded-md">
                                                            <Shield size={14} className="text-slate-500" /> Leader
                                                        </span>
                                                    ) : isOwner && (
                                                        <button
                                                            onClick={() => handleRemoveMember(member.username)}
                                                            disabled={processingActionId === `remove-${member.username}`}
                                                            className="h-8 w-8 flex items-center justify-center text-slate-400 bg-white border border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50"
                                                            title="Remove Member"
                                                            aria-label={`Remove ${member.fullname}`}
                                                        >
                                                            {processingActionId === `remove-${member.username}` ? (
                                                                <Loader2 size={14} className="animate-spin text-red-500" />
                                                            ) : (
                                                                <X size={16} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* INVITE CARD */}
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-[18px] font-semibold text-slate-900 mb-1">Invite Members</h2>
                            <p className="text-[13px] text-slate-500 mb-5">Share this secure link to allow others to apply to your project.</p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <div className="flex-1 w-full flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-10 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                    <LinkIcon size={16} className="text-slate-400 shrink-0 mr-2.5" />
                                    <input 
                                        readOnly 
                                        value={`${window.location.host}/post/${postId}    not yet ready so do not try thise`}
                                        className="w-full bg-transparent text-[14px] text-slate-700 outline-none truncate"
                                        aria-label="Invite Link"
                                    />
                                </div>
                                <button 
                                    onClick={copyInviteLink} 
                                    className="w-full sm:w-auto h-10 px-6 bg-slate-900 text-white text-[14px] font-medium rounded-lg shadow-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
                                >
                                    {isLinkCopied ? (
                                        <><Check size={16} /> Copied</>
                                    ) : (
                                        "Copy Link"
                                    )}
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: PENDING REQUESTS (4 Cols) */}
                    <div className="lg:col-span-4">
                        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-fit sticky top-8 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
                                <div>
                                    <h2 className="text-[22px] font-semibold text-slate-900">Pending</h2>
                                    <p className="text-[13px] text-slate-500 mt-1">Require your approval</p>
                                </div>
                                {pendingRequests.length > 0 && (
                                    <span className="bg-indigo-50 text-indigo-700 text-[12px] font-bold h-6 min-w-[24px] px-2 flex items-center justify-center rounded-full">
                                        {pendingRequests.length}
                                    </span>
                                )}
                            </div>

                            <div className="p-6 bg-slate-50/50 flex-1 max-h-[700px] overflow-y-auto">
                                {isRequestsLoading ? (
                                    <div className="flex flex-col gap-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                                                    <div className="space-y-2 flex-1">
                                                        <div className="h-4 bg-slate-100 rounded w-24"></div>
                                                        <div className="h-3 bg-slate-100 rounded w-16"></div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="h-9 bg-slate-100 rounded-lg flex-1"></div>
                                                    <div className="h-9 bg-slate-100 rounded-lg flex-1"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : pendingRequests.length === 0 ? (
                                    <div className="py-12 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Target size={20} className="text-slate-300" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-[15px] font-semibold text-slate-900 mb-1">Inbox Zero</h3>
                                        <p className="text-[13px] text-slate-500">You have no pending requests.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {pendingRequests.map((req) => {
                                            const username = Array.isArray(req.request_user_name) ? req.request_user_name[0] : req.request_user_name;
                                            const fullName = Array.isArray(req.request_fullname) ? req.request_fullname[0] : req.request_fullname;
                                            const isAccepting = processingActionId === `accept-${req.id}`;
                                            const isDeclining = processingActionId === `decline-${req.id}`;
                                            const isProcessing = isAccepting || isDeclining;

                                            return (
                                                <div key={req.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col gap-5">
                                                    
                                                    {/* User Info Row */}
                                                    <div className="flex items-start justify-between min-w-0">
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Avatar username={username} picUrl={req.request_user_pic} sizeClass="w-10 h-10" />
                                                            <div className="flex flex-col min-w-0">
                                                                <span 
                                                                    onClick={() => navigate(`/user/${username}/profile`)} 
                                                                    className="font-semibold text-[14px] text-slate-900 cursor-pointer hover:text-indigo-600 truncate"
                                                                >
                                                                    {fullName}
                                                                </span>
                                                                <span className="text-[13px] text-slate-500 truncate mt-0.5">
                                                                    @{username}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions Row */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button 
                                                            onClick={() => handleAccept(req.event, req.id, req.user)} 
                                                            disabled={isProcessing}
                                                            className="h-9 flex items-center justify-center text-[13px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isAccepting ? <Loader2 size={16} className="animate-spin" /> : "Accept"}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDecline(req.event, req.id, req.user)} 
                                                            disabled={isProcessing}
                                                            className="h-9 flex items-center justify-center text-[13px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-red-600 rounded-lg shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isDeclining ? <Loader2 size={16} className="animate-spin" /> : "Decline"}
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}
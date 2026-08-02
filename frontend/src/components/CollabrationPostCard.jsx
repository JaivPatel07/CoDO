import { useEffect, useState } from "react";
import ProfilePic from "./ProfilePic";
import calculate_post_time from "../reusable_methods/time_calculator";
import { Dot, X, Calendar, MapPin, Link as LinkIcon, Users, Briefcase, Sparkles, Wrench, UserCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { make_join_request } from "../api/user_apis";
import { send_notification } from "../api/notification_apis";

export default function CollabrationPostCard({ project }) {
    const [isApplied, setApplied] = useState(false);
    const [isGrpOwner, setGrpOwner] = useState(false);

    useEffect(() => {
        setGrpOwner(project.is_owner);
        setApplied(project.is_applied);
    }, [project.is_owner, project.is_applied]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const getCategoryStyles = (category) => {
        switch (category) {
            case 'Hackathon': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'Side Project': return 'bg-violet-50 text-violet-700 border-violet-100';
            case 'Open Source': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const handleJoinRequest = async () => {
        if (!isApplied) {
            try {
                const response = await make_join_request({ post_id: project.id });
                if (response?.data?.message === "success") {
                    const notification_Data = {
                        notification_type: "Team Request",
                        notification_message: null,
                        reciver_name: project.owner_user_name,
                        event_id: project.id
                    };
                    await send_notification(notification_Data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const skillColors = [
        'bg-violet-50 text-violet-700 border-violet-100/80',
        'bg-indigo-50 text-indigo-700 border-indigo-100/80',
        'bg-purple-50 text-purple-700 border-purple-100/80'
    ];

    return (
        <>
            <div className={`bg-white p-6 rounded-2xl flex flex-col h-full transition-all duration-300 border shadow-sm relative ${
                !project.status 
                    ? 'opacity-55 grayscale-[40%] hover:opacity-90 hover:grayscale-0 border-slate-200/60' 
                    : 'hover:shadow-xl hover:shadow-violet-600/5 hover:border-violet-300 border-slate-200/80'
            }`}>
                
                {/* Header: Title & Category */}
                <div className="flex justify-between items-start mb-3 gap-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                        {project.title}
                    </h3>
                    <div className={`px-2.5 py-0.5 rounded-full border shrink-0 ${getCategoryStyles(project.event_type)}`}>
                        <span className="text-[10px] font-black uppercase tracking-wider">{project.event_type}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed inline">
                        {project.description}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-violet-600 hover:text-violet-700 text-[13px] font-bold ml-1 inline-block hover:underline"
                    >
                        View details
                    </button>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {project.skills?.map((skill, idx) => (
                        <span
                            key={idx}
                            className={`${skillColors[idx % skillColors.length]} border px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wide`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Info Stats List */}
                <div className="space-y-2.5 py-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Wrench size={14} />
                        <span className="text-[11.5px] font-bold uppercase tracking-wider">Roles:</span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-700 text-right truncate pl-2 max-w-[180px]">
                        {project.roles?.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <UserCheck size={14} />
                        <span className="text-[11.5px] font-bold uppercase tracking-wider">Required:</span>
                      </div>
                      <span className="text-[12px] font-black text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                        {project.members_required} members
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Users size={14} />
                        <span className="text-[11.5px] font-bold uppercase tracking-wider">Team Size:</span>
                      </div>
                      <span className="text-[12px] font-bold text-slate-700">
                        {project.team_size} current
                      </span>
                    </div>
                </div>

                {/* Footer section */}
                <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <ProfilePic uname={project.owner_name} custom_pic_url={project.owner_pic_url} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span
                                className="text-[13px] font-black text-slate-800 leading-none truncate max-w-[110px] hover:text-violet-600 transition-colors cursor-pointer"
                                onClick={() => navigate(`/user/${project.owner_user_name}/profile`, { replace: true })}
                            >
                                {project.owner_name}
                            </span>
                            <div className="flex items-center text-[10px] text-slate-400 font-semibold mt-0.5">
                                {project.status ? (
                                    <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                        Open
                                    </span>
                                ) : (
                                    <span className="text-red-500 font-bold flex items-center gap-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
                                        Closed
                                    </span>
                                )}
                                <span className="mx-1">•</span>
                                <span>{calculate_post_time(project.post_date)}</span>
                            </div>
                        </div>
                    </div>

                    {isGrpOwner ? (
                        <button 
                            onClick={() => navigate(`/user/${localStorage.getItem("username")}/managepost/${project.id}`)}
                            className="text-[12px] font-black px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-500/10"
                        >
                            Manage
                        </button>
                    ) : (
                        project.status && (
                            <button
                                onClick={() => { setApplied(true); handleJoinRequest(); }}
                                disabled={isApplied}
                                className={`text-[12px] font-black px-5 py-2 rounded-xl transition-all duration-200 active:scale-95 ${isApplied
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10'
                                }`}
                            >
                                {project.applied_status}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <div className={`px-2.5 py-0.5 rounded-full border ${getCategoryStyles(project.event_type)}`}>
                                    <span className="text-[10px] font-black uppercase tracking-wider">{project.event_type}</span>
                                </div>
                                {project.status ? (
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-emerald-100">Open</span>
                                ) : (
                                    <span className="bg-red-50 text-red-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border border-red-100">Closed</span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-150 rounded-xl transition-all"
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{project.title}</h2>
                                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                    Posted {calculate_post_time(project.post_date)}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">About the Project</h4>
                                <p className="text-slate-600 text-[13.5px] leading-relaxed whitespace-pre-wrap font-medium">
                                    {project.description}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                                {/* Left Side: Event Details */}
                                <div className="space-y-3.5">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b pb-1.5">Event Details</h4>
                                    
                                    {project.start_date && (
                                        <div className="flex gap-2.5 text-[12.5px] text-slate-600">
                                            <Calendar size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium"><span className="font-bold text-slate-700">Starts:</span> {project.start_date} {project.start_time && `at ${project.start_time}`}</p>
                                                {project.end_date && (
                                                    <p className="font-medium mt-0.5"><span className="font-bold text-slate-700">Ends:</span> {project.end_date} {project.end_time && `at ${project.end_time}`}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {project.event_mode && (
                                        <div className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
                                            <MapPin size={16} className="text-slate-400 shrink-0" />
                                            <p className="font-medium"><span className="font-bold text-slate-700">Mode:</span> {project.event_mode}</p>
                                        </div>
                                    )}

                                    {project.event_location && project.event_mode !== "Online" && (
                                        <div className="flex items-start gap-2.5 text-[12.5px] text-slate-600">
                                            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                            <p className="font-medium"><span className="font-bold text-slate-700">Location:</span> {project.event_location}</p>
                                        </div>
                                    )}

                                    {project.event_url && (
                                        <div className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
                                            <LinkIcon size={16} className="text-slate-400 shrink-0" />
                                            <a href={project.event_url} target="_blank" rel="noopener noreferrer" className="text-violet-600 font-bold hover:underline break-all">
                                                Event Website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Team details */}
                                <div className="space-y-3.5">
                                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest border-b pb-1.5">Team & Roles</h4>

                                    <div className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
                                        <Users size={16} className="text-slate-400 shrink-0" />
                                        <p className="font-medium"><span className="font-bold text-slate-700">Team Size:</span> {project.team_size} members</p>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-[12.5px] text-slate-650">
                                        <Sparkles size={16} className="text-violet-500 shrink-0" />
                                        <p className="font-medium"><span className="font-bold text-violet-700">Looking For:</span> {project.members_required} members</p>
                                    </div>

                                    <div className="flex items-start gap-2.5 text-[12.5px] text-slate-600">
                                        <Briefcase size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                        <div className="min-w-0">
                                            <span className="font-bold text-slate-700">Roles Needed:</span>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {project.roles?.map((role, idx) => (
                                                    <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-[10.5px] font-bold">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Needed */}
                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Required Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.skills?.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className={`${skillColors[idx % skillColors.length]} border px-2.5 py-1 rounded-lg text-[11px] uppercase font-bold tracking-wide`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <ProfilePic uname={project.owner_name} custom_pic_url={project.owner_pic_url} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Posted by</span>
                                    <span
                                        className="text-[13px] font-black text-slate-900 hover:text-violet-600 transition-colors cursor-pointer leading-tight"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            navigate(`/user/${project.owner_user_name}/profile`, { replace: true });
                                        }}
                                    >
                                        {project.owner_name}
                                    </span>
                                </div>
                            </div>

                            {isGrpOwner ? (
                                <button 
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        navigate(`/user/${localStorage.getItem("username")}/managepost/${project.id}`);
                                    }}
                                    className="text-[12px] font-black px-5 py-2 rounded-xl transition-all duration-200 active:scale-95 bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-500/10"
                                >
                                    Manage
                                </button>
                            ) : (
                                project.status && (
                                    <button
                                        onClick={() => { setApplied(true); handleJoinRequest(); }}
                                        disabled={isApplied}
                                        className={`text-[12px] font-black px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${isApplied
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10'
                                        }`}
                                    >
                                        {project.applied_status}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

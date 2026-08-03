import { useEffect, useState } from "react";
import ProfilePic from "./ProfilePic";
import calculate_post_time from "../reusable_methods/time_calculator";
import { X, Calendar, MapPin, Link as LinkIcon, Users, Briefcase, Sparkles, Wrench, UserCheck, Bookmark, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { make_join_request } from "../api/user_apis";
import { send_notification } from "../api/notification_apis";

export default function CollabrationPostCard({ project }) {
    const [isApplied, setApplied] = useState(false);
    const [isGrpOwner, setGrpOwner] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        setGrpOwner(project.is_owner);
        setApplied(project.is_applied);
    }, [project.is_owner, project.is_applied]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const getCategoryStyles = (category) => {
        switch (category) {
            case 'Hackathon': return 'bg-violet-50 text-violet-700 border-violet-200';
            case 'Side Project': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Open Source': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className={`group bg-white p-5 rounded-[20px] flex flex-col h-full transition-all duration-300 border relative cursor-pointer ${!project.status
                    ? 'opacity-70 hover:opacity-100 border-slate-200'
                    : 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-violet-200 border-slate-200 shadow-sm'
                    }`}>

                {/* Top Actions: Bookmark & Category */}
                <div className="flex justify-between items-start mb-3">
                    <div className={`px-2.5 py-1 rounded-md border ${getCategoryStyles(project.event_type)}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{project.event_type}</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
                        className={`p-1.5 rounded-full transition-colors ${isBookmarked ? 'bg-violet-50 text-violet-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                        <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Header: Title */}
                <div className="mb-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight">
                        {project.title}
                    </h3>
                </div>

                {/* Description */}
                <div className="mb-4">
                    <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
                        {project.description}
                    </p>
                </div>

                {/* Info Stats Row */}
                <div className="mb-4">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-violet-50 border border-violet-100">
                         <span className="flex items-center gap-1.5 text-[11px] font-bold text-violet-700 uppercase tracking-wide">
                             <Sparkles size={14} className="text-violet-500"/> Looking For
                         </span>
                         <span className="text-[13px] font-black text-violet-900">
                             {project.members_required === 0 || !project.members_required ? 'Any members can join' : `${project.members_required} members `}
                         </span>
                     </div>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                    {project.skills?.slice(0, 3).map((skill, idx) => (
                        <span
                            key={idx}
                            className={`bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-md text-[11px] font-medium`}
                        >
                            {skill}
                        </span>
                    ))}
                    {project.skills?.length > 3 && (
                        <span className="bg-slate-50 border border-slate-200 text-slate-500 px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                            +{project.skills.length - 3}
                        </span>
                    )}
                </div>

                {/* Footer section */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <ProfilePic uname={project.owner_name} custom_pic_url={project.owner_pic_url} className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-50" />
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className="text-[13px] font-bold text-slate-800 leading-none truncate max-w-[85px] hover:text-violet-600 transition-colors cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/user/${project.owner_user_name}/profile`, { replace: true }); }}
                                >
                                    {project.owner_name}
                                </span>
                                {!isGrpOwner && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/user/${project.owner_user_name}/profile`, { replace: true }); }}
                                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors shrink-0"
                                    >
                                        Connect
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center text-[10px] text-slate-500 font-medium mt-1">
                                {project.status ? (
                                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                        Open
                                    </span>
                                ) : (
                                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 inline-block"></span>
                                        Closed
                                    </span>
                                )}
                                <span className="mx-1.5 text-slate-300">•</span>
                                <span>{calculate_post_time(project.post_date)}</span>
                            </div>
                        </div>
                    </div>

                    {isGrpOwner ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/user/${localStorage.getItem("username")}/managepost/${project.id}`); }}
                            className="text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 bg-slate-100 hover:bg-slate-200 text-slate-800"
                        >
                            Manage
                        </button>
                    ) : (
                        project.status && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setApplied(true); handleJoinRequest(); }}
                                disabled={isApplied}
                                className={`text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-95 ${isApplied
                                    ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100'
                                    : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-500/20'
                                    }`}
                            >
                                {isApplied ? 'Applied' : 'Apply'}
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-md border ${getCategoryStyles(project.event_type)}`}>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{project.event_type}</span>
                                </div>
                                {project.status ? (
                                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-md uppercase border border-emerald-100 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span> Open</span>
                                ) : (
                                    <span className="bg-slate-50 text-slate-500 text-[11px] font-bold px-3 py-1 rounded-md uppercase border border-slate-200 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block"></span> Closed</span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-8">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-2">{project.title}</h2>
                                <p className="text-[13px] font-medium text-slate-500 flex items-center gap-1.5">
                                    <Calendar size={14} /> Posted {calculate_post_time(project.post_date)}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">About the Project</h4>
                                <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                {/* Left Side: Event Details */}
                                <div className="space-y-4">
                                    <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Event Details</h4>

                                    {project.start_date && (
                                        <div className="flex gap-3 text-[14px] text-slate-600">
                                            <Calendar size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium"><span className="font-bold text-slate-800">Starts:</span> {project.start_date} {project.start_time && `at ${project.start_time}`}</p>
                                                {project.end_date && (
                                                    <p className="font-medium mt-1"><span className="font-bold text-slate-800">Ends:</span> {project.end_date} {project.end_time && `at ${project.end_time}`}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {project.event_mode && (
                                        <div className="flex items-center gap-3 text-[14px] text-slate-600">
                                            <MapPin size={18} className="text-slate-400 shrink-0" />
                                            <p className="font-medium"><span className="font-bold text-slate-800">Mode:</span> {project.event_mode}</p>
                                        </div>
                                    )}

                                    {project.event_location && project.event_mode !== "Online" && (
                                        <div className="flex items-start gap-3 text-[14px] text-slate-600">
                                            <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                            <p className="font-medium"><span className="font-bold text-slate-800">Location:</span> {project.event_location}</p>
                                        </div>
                                    )}

                                    {project.event_url && (
                                        <div className="flex items-center gap-3 text-[14px] text-slate-600">
                                            <LinkIcon size={18} className="text-slate-400 shrink-0" />
                                            <a href={project.event_url} target="_blank" rel="noopener noreferrer" className="text-violet-600 font-bold hover:underline break-all">
                                                Event Website
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side: Team details */}
                                <div className="space-y-4">
                                    <h4 className="text-[12px] font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Team & Roles</h4>

                                    <div className="flex items-center gap-3 text-[14px] text-slate-600">
                                        <Users size={18} className="text-slate-400 shrink-0" />
                                        <p className="font-medium"><span className="font-bold text-slate-800">Team Size:</span> {project.team_size} members</p>
                                    </div>

                                    <div className="flex items-center gap-3 text-[14px] text-slate-700">
                                        <Sparkles size={18} className="text-violet-500 shrink-0" />
                                        <p className="font-medium"><span className="font-bold text-violet-600">Looking For:</span> {`${project.members_required} members`}</p>
                                    </div>

                                    <div className="flex items-start gap-3 text-[14px] text-slate-600">
                                        <Briefcase size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                        <div className="min-w-0">
                                            <span className="font-bold text-slate-800">Roles Needed:</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.roles?.map((role, idx) => (
                                                    <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1 rounded-md text-[12px] font-medium">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Needed */}
                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills?.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className={`bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-[13px] font-medium`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <ProfilePic uname={project.owner_name} custom_pic_url={project.owner_pic_url} className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white" />
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Posted by</span>
                                    <span
                                        className="text-[15px] font-bold text-slate-900 hover:text-violet-600 transition-colors cursor-pointer leading-none"
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
                                    className="text-[14px] font-bold px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95 bg-slate-200 hover:bg-slate-300 text-slate-800"
                                >
                                    Manage
                                </button>
                            ) : (
                                project.status && (
                                    <button
                                        onClick={() => { setApplied(true); handleJoinRequest(); }}
                                        disabled={isApplied}
                                        className={`text-[14px] font-bold px-8 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${isApplied
                                            ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100'
                                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30'
                                            }`}
                                    >
                                        {isApplied ? 'Applied' : 'Apply Now'}
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

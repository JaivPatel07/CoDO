import { useEffect, useState } from "react";
import ProfilePic from "./ProfilePic";
import calculate_post_time from "../reusable_methods/time_calculator";
import { Dot, X, Calendar, MapPin, Link as LinkIcon, Users, Briefcase } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { use } from "react";
import { make_join_request } from "../api/user_apis";
import { send_notification } from "../api/notification_apis";
import { notification_api } from "../api/axios";

export default function CollabrationPostCard({ project }) {
    // console.log(project)
    const [isApplied, setApplied] = useState(false)
    const [isGrpOwner, setGrpOwner] = useState(false) //if post owner it show Manage button else Join Button

    useEffect(() => {
        setGrpOwner(project.is_owner)
        setApplied(project.is_applied)
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Determine category style mimicking the reference tags
    const getCategoryStyles = (category) => {
        switch (category) {
            case 'Hackathon': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Side Project': return 'bg-violet-50 text-violet-700 border-violet-200';
            case 'Open Source': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const handleJoinRequest = async () => {
        if (!isApplied) {
            try {
                const response = await make_join_request({ post_id: project.id })
                if (response?.data?.message === "success") {

                    const notification_Data = {
                        notification_type: "Team Request",
                        notification_message: null,
                        reciver_name: project.owner_user_name,
                        event_id:project.id
                    }
                    const post_notification = await send_notification(notification_Data)
                    console.log(post_notification.data.message)

                }

            }
            catch (err) {
                console.log(err)
            }
        }
    }

    // Rotating colors for skill tags
    const skillColors = [
        'bg-blue-50/50 border-blue-200 text-blue-700',
        'bg-slate-50/50 border-slate-200 text-slate-700',
        'bg-violet-50/50 border-violet-200 text-violet-700'
    ];

    return (
        <>
            <div className="bg-white p-6 rounded-xl flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-blue-400 border border-slate-200 group shadow-sm relative">

                {/* Top Row: Title & Category Badge */}
                <div className="flex justify-between items-start mb-3 gap-4">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {project.title}
                    </h3>
                    <div className={`px-2.5 py-1 rounded-full border shrink-0 ${getCategoryStyles(project.event_type)}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{project.event_type}</span>
                    </div>
                </div>

                {/* Description & View Details */}
                <div className="mb-4">
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed inline">
                        {project.description}
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-600 text-sm font-semibold hover:underline ml-1 inline-block mt-1"
                    >
                        View details
                    </button>
                </div>

                {/* Skills / Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {project.skills?.map((skill, idx) => (
                        <span
                            key={idx}
                            className={`${skillColors[idx % skillColors.length]} border px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Stats Section (Border Separated) */}
                <div className="space-y-3 py-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-[18px]">engineering</span>
                            <span className="text-xs font-medium">Roles:</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-right truncate pl-2">
                            {project.roles?.join(', ')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-[18px]">person_search</span>
                            <span className="text-xs font-medium">Required:</span>
                        </div>
                        <span className="text-xs font-bold text-blue-600">{project.members_required} members</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-500">
                            <span className="material-symbols-outlined text-[18px]">groups</span>
                            <span className="text-xs font-medium">Team Size:</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">{project.team_size} current</span>
                    </div>
                </div>

                {/* Footer: User Profile & Join Button */}
                <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ProfilePic uname={project.owner_name} custom_pic_url={project.owner_pic_url} className="w-9 h-9" />
                        <div className="flex flex-col">
                            <span
                                style={{ cursor: 'pointer' }}
                                className="text-sm font-bold text-slate-800 leading-none mb-1 hover:text-blue-600 transition-colors"
                                onClick={() => navigate(`/user/${project.owner_user_name}/profile`, { replace: true })}
                            >
                                {project.owner_name}
                            </span>
                            <div className="flex items-center gap-2 text-slate-400">
                                <span className="material-symbols-outlined text-[14px]">
                                    {project.status ? <span className="text-success flex items-center"><Dot className="-ml-1" />open</span> : <span className="text-danger flex items-center"><Dot className="-ml-1" />closed</span>}
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider">{calculate_post_time(project.post_date)}</span>
                            </div>
                        </div>
                    </div>
                    {isGrpOwner ? (
                        <button onClick={() => { navigate(`/user/${localStorage.getItem("username")}/managepost/${project.id}`) }}
                            className="text-sm font-semibold px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        >
                            Manage
                        </button>
                    )
                        : (
                            project.status && (
                                <button
                                    onClick={() => { setApplied(true); handleJoinRequest() }}
                                    disabled={isApplied}
                                    className={`text-sm font-bold px-8 py-2.5 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${isApplied
                                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                                        : 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        }`}
                                >
                                    {project.applied_status}
                                </button>
                            )
                        )
                    }
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsModalOpen(false)}
                >
                    {/* Modal Content */}
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full border ${getCategoryStyles(project.event_type)}`}>
                                    <span className="text-xs font-bold uppercase tracking-wider">{project.event_type}</span>
                                </div>
                                {project.status ? (
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-green-200">Open</span>
                                ) : (
                                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-200">Closed</span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">{project.title}</h2>

                            {/* Description Section */}
                            <div className="mb-8">
                                <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">About the Project</h4>
                                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>

                            {/* Two Column Details Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

                                {/* Event Information */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">Event Details</h4>

                                    {project.start_date && (
                                        <div className="flex gap-3 text-sm text-slate-600">
                                            <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                                            <div>
                                                <p><span className="font-semibold text-slate-700">Starts:</span> {project.start_date} {project.start_time && `at ${project.start_time}`}</p>
                                                {project.end_date && (
                                                    <p><span className="font-semibold text-slate-700">Ends:</span> {project.end_date} {project.end_time && `at ${project.end_time}`}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {project.event_mode && (
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                            <p><span className="font-semibold text-slate-700">Mode:</span> {project.event_mode}</p>
                                        </div>
                                    )}

                                    {project.event_location && project.event_mode !== "Online" && (
                                        <div className="flex items-start gap-3 text-sm text-slate-600">
                                            <MapPin className="w-5 h-5 text-slate-400 shrink-0 opacity-0" /> {/* Spacer */}
                                            <p><span className="font-semibold text-slate-700">Location:</span> {project.event_location}</p>
                                        </div>
                                    )}

                                    {project.event_url && (
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <LinkIcon className="w-5 h-5 text-slate-400 shrink-0" />
                                            <a href={project.event_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                Event Link
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Team Requirements */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b pb-2">Team & Roles</h4>

                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Users className="w-5 h-5 text-slate-400 shrink-0" />
                                        <p><span className="font-semibold text-slate-700">Team Size:</span> {project.team_size} members currently</p>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Users className="w-5 h-5 text-blue-400 shrink-0" />
                                        <p><span className="font-semibold text-blue-600">Looking For:</span> {project.members_required} more members</p>
                                    </div>

                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <Briefcase className="w-5 h-5 text-slate-400 shrink-0" />
                                        <div>
                                            <span className="font-semibold text-slate-700">Roles Needed:</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.roles?.map((role, idx) => (
                                                    <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills?.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className={`${skillColors[idx % skillColors.length]} border px-3 py-1.5 rounded-md text-xs uppercase font-bold tracking-wide`}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer (Author Info & Join Button) */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0 rounded-b-2xl">
                            <div className="flex items-center gap-3">
                                <ProfilePic uname={project.owner_name} custom_pic_url={project.owner_pic_url} className="w-10 h-10" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-medium">Posted by</span>
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors"
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
                                <button onClick={() => { navigate(`/user/${localStorage.getItem("username")}/managepost/${project.id}`) }}
                                    className="text-sm font-semibold px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                >
                                    Manage
                                </button>
                            )
                                : (
                                    project.status && (
                                        <button
                                            onClick={() => { setApplied(true); handleJoinRequest() }}
                                            disabled={isApplied}
                                            className={`text-sm font-bold px-8 py-2.5 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${isApplied
                                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
                                                }`}
                                        >
                                            {project.applied_status}
                                        </button>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

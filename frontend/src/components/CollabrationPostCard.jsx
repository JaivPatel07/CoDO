import { useState } from "react";
import ProfilePic from "./ProfilePic";
import calculate_post_time from "../reusable_methods/time_calculator";

export default function CollabrationPostCard({ project }) {
    const [joined, setJoined] = useState(false);
    const [isactive,ChangeStatus] = useState(true)

    // Determine category style mimicking the reference tags
    const getCategoryStyles = (category) => {
        switch (category) {
            case 'Hackathon': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Side Project': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Open Source': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    // Rotating colors for skill tags to match the reference's colorful tags
    const skillColors = [
        'bg-blue-50/50 border-blue-200 text-blue-700',
        'bg-slate-50/50 border-slate-200 text-slate-700',
        'bg-emerald-50/50 border-emerald-200 text-emerald-700'
    ];

    return (
        <div className="bg-white p-6 rounded-xl flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:border-blue-400 border border-slate-200 group shadow-sm">

            {/* Top Row: Title & Category Badge */}
            <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {project.title}
                </h3>
                <div className={`px-2.5 py-1 rounded-full border shrink-0 ${getCategoryStyles(project.event_type)}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{project.event_type}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                {project.description}
            </p>

            {/* Skills / Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
                {project.skills.map((skill, idx) => (
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
                        {project.roles.join(', ')}
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
                        <span className="text-sm font-bold text-slate-800 leading-none mb-1">
                            {project.owner_name}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">{project.status}</span>
                            <span className="text-[10px] font-medium uppercase tracking-wider">{calculate_post_time(project.post_date)}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setJoined(true)}
                    disabled={joined}
                    className={`text-sm font-semibold px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 ${joined
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        }`}
                >
                    {joined ? 'Requested' : 'Join'}
                </button>
            </div>

        </div>
    );
}
import { useState, useRef, useEffect } from "react";
import {
    Heart,
    MessageCircle,
    Share2,
    Bookmark,
    MoreHorizontal,
    Flag,
    Copy,
    ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";
import ProfilePic from "./ProfilePic";
import calculate_post_time from "../reusable_methods/time_calculator";

export default function OrganizationPostCard({
    name,
    user_url,
    profileSrc,
    postSrc,
    postText,
    orgUrl,
    organizationText,
    likes = 0,
    comments = 0,
    time = "Just now",
}) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleSave = () => {
        setSaved((prev) => !prev);
        setMenuOpen(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
        } catch { }

        setMenuOpen(false);
    };

    const handleVisit = () => {
        if (orgUrl) {
            window.open(orgUrl, "_blank");
        }

        setMenuOpen(false);
    };

    const handleReport = () => {
        setMenuOpen(false);
    };

    return (
        <article className="bg-white border border-slate-200/80 rounded-[24px] shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden group">
            {/* ---------------- Header ---------------- */}
            <div className="px-6 pt-6 pb-3 flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="relative">
                        <ProfilePic
                            uname={name}
                            url={profileSrc}
                            className="w-12 h-12 rounded-xl ring-2 ring-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-violet-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <Link
                            to={user_url}
                            className="font-bold text-[15px] text-slate-900 hover:text-violet-600 transition-colors"
                        >
                            {name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium mt-0.5">
                            {orgUrl ? (
                                <a
                                    href={orgUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-violet-600 hover:text-violet-700 hover:underline decoration-violet-300 underline-offset-2 font-semibold"
                                >
                                    {organizationText}
                                </a>
                            ) : (
                                <span>{organizationText}</span>
                            )}
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{calculate_post_time(time)}</span>
                        </div>
                    </div>
                </div>

                {/* Three Dot Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    <div
                        className={`absolute right-0 top-11 w-56 bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden z-50 transition-all duration-200 origin-top-right ${menuOpen
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 pointer-events-none"
                            }`}
                    >
                        <div className="p-1.5 space-y-0.5">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 w-full text-left text-[13px] font-semibold text-slate-700 transition-colors"
                            >
                                <Bookmark size={16} fill={saved ? "currentColor" : "none"} className={saved ? "text-yellow-500" : "text-slate-400"} />
                                {saved ? "Remove from Saved" : "Save Post"}
                            </button>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 w-full text-left text-[13px] font-semibold text-slate-700 transition-colors"
                            >
                                <Copy size={16} className="text-slate-400" />
                                Copy Link
                            </button>
                            {orgUrl && (
                                <button
                                    onClick={handleVisit}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 w-full text-left text-[13px] font-semibold text-slate-700 transition-colors"
                                >
                                    <ExternalLink size={16} className="text-slate-400" />
                                    Visit Organization
                                </button>
                            )}
                        </div>
                        <div className="border-t border-slate-100 p-1.5">
                            <button
                                onClick={handleReport}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 w-full text-left text-[13px] font-semibold text-rose-600 transition-colors"
                            >
                                <Flag size={16} />
                                Report Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- Post Text ---------------- */}
            <div className="px-6 mb-4 mt-2">
                <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {postText}
                </p>
            </div>

            {/* ---------------- Image ---------------- */}
            {postSrc && (
                <div className="px-4 pb-4">
                    <div className="rounded-[18px] overflow-hidden border border-slate-100 bg-slate-50">
                        <img
                            src={postSrc}
                            alt="Post content"
                            className="w-full max-h-[450px] object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>
            )}

            {/* ---------------- Actions ---------------- */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100/80 bg-slate-50/30">
                <div className="flex gap-1.5">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-bold text-[13px] ${liked
                                ? "text-rose-500 bg-rose-50"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                    >
                        <Heart
                            size={18}
                            fill={liked ? "currentColor" : "none"}
                            className={liked ? "scale-110 transition-transform" : "transition-transform"}
                        />
                        <span>{liked ? likes + 1 : likes}</span>
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-300 font-bold text-[13px]">
                        <MessageCircle size={18} />
                        <span>{comments}</span>
                    </button>

                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-300 font-bold text-[13px]">
                        <Share2 size={18} />
                    </button>
                </div>
                
                <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-bold text-[13px] ${saved
                            ? "text-yellow-600 bg-yellow-50"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                >
                    <Bookmark
                        size={18}
                        fill={saved ? "currentColor" : "none"}
                        className={saved ? "scale-110 transition-transform" : "transition-transform"}
                    />
                </button>
            </div>
        </article>
    );
}
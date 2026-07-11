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
        <article className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

            {/* ---------------- Header ---------------- */}

            <div className="px-5 pt-5 pb-2 flex items-start justify-between">

                <div className="flex gap-2">

                    <ProfilePic
                        uname={name}
                        url={profileSrc}
                        className="w-12 h-12"
                    />

                    <div>

                        <Link
                            to={user_url}
                            className="font-semibold text-[16px] text-slate-900 hover:text-blue-600 transition"
                        >
                            {name}
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">

                            <a
                                href={orgUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-blue-600 hover:underline"
                            >
                                {organizationText}
                            </a>

                            <span>•</span>

                            <span>
                                {calculate_post_time(time)}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Three Dot Menu */}

                <div
                    className="relative"
                    ref={menuRef}
                >

                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="w-9 h-9 rounded-full hover:bg-slate-100 transition flex items-center justify-center"
                    >
                        <MoreHorizontal size={20} />
                    </button>

                    <div
                        className={`absolute right-0 top-11 w-56 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 transition-all duration-200 ${menuOpen
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 invisible"
                            }`}
                    >

                        <button
                            onClick={handleSave}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 w-full text-left"
                        >
                            <Bookmark
                                size={18}
                                fill={saved ? "currentColor" : "none"}
                            />

                            {saved ? "Remove Saved" : "Save Post"}
                        </button>

                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 w-full text-left"
                        >
                            <Copy size={18} />

                            Copy Link
                        </button>

                        <button
                            onClick={handleVisit}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 w-full text-left"
                        >
                            <ExternalLink size={18} />

                            Visit Organization
                        </button>

                        <div className="border-t" />

                        <button
                            onClick={handleReport}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 w-full text-left"
                        >
                            <Flag size={18} />

                            Report
                        </button>

                    </div>

                </div>

            </div>

            {/* ---------------- Post Text ---------------- */}

            <div className="px-5">

                <p className="text-[15px] leading-7 text-slate-700 whitespace-pre-wrap">
                    {postText}
                </p>

            </div>

            {/* ---------------- Image ---------------- */}

            {postSrc && (

                <div className="px-5 mt-4">

                    <img
                        src={postSrc}
                        alt="post"
                        className="w-full max-h-[300px] object-cover rounded-xl border border-slate-200"
                    />

                </div>

            )}

            {/* PART 2 STARTS HERE */}            {/* ---------------- Stats ---------------- */}

            <div className="mt-4 px-5 py-3 flex items-center justify-between text-sm text-slate-500 border-t border-slate-100">

                <div className="flex items-center gap-2">

                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <Heart
                            size={11}
                            fill="white"
                            className="text-white"
                        />
                    </div>

                    <span className="hover:underline cursor-pointer">
                        {liked ? likes + 1 : likes} Likes
                    </span>

                </div>

            </div>

            {/* ---------------- Actions ---------------- */}

            <div className="grid grid-cols-2 border-t border-slate-100">

                <button
                    onClick={() => setLiked(!liked)}
                    className={`h-12 flex items-center justify-center gap-2 transition font-medium text-sm ${liked
                            ? "text-red-500"
                            : "text-slate-600 hover:bg-slate-50 hover:text-red-500"
                        }`}
                >
                    <Heart
                        size={19}
                        fill={liked ? "currentColor" : "none"}
                    />

                    Like
                </button>

                <button
                    onClick={() => setSaved(!saved)}
                    className={`h-12 flex items-center justify-center gap-2 transition font-medium text-sm ${saved
                            ? "text-yellow-500"
                            : "text-slate-600 hover:bg-slate-50 hover:text-yellow-500"
                        }`}
                >
                    <Bookmark
                        size={19}
                        fill={saved ? "currentColor" : "none"}
                    />

                    Save
                </button>

            </div>

        </article>
    );
}
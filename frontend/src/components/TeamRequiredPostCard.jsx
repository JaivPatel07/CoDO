import { useState, useRef, useEffect } from "react";
import {
  Users,
  Share2,
  ExternalLink,
  ArrowRight,
  Building2,
  MoreHorizontal,
  Bookmark,
  Copy,
  Flag,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TeamPostCard({
  name,
  orgsrc,
  postSrc,
  posttext,
  orgUrl,
  organizationText,
  time = "Just now",
  total_applied,
}) {
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save Post
  const handleSave = () => {
    setSaved((prev) => !prev);
    setMenuOpen(false);

    // TODO: Save/Unsave API
  };

  // Copy Link
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Post link copied.");
    } catch {
      alert("Unable to copy link.");
    }

    setMenuOpen(false);
  };

  // Visit Organization
  const handleVisit = () => {
    if (orgUrl) {
      window.open(orgUrl, "_blank");
    }

    setMenuOpen(false);
  };

  // Report
  const handleReport = () => {
    // TODO: Report API

    alert("Report submitted.");

    setMenuOpen(false);
  };

return (
    <div className="bg-white rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 dark:bg-slate-900 dark:border-slate-800"> 
      {/* HEADER */}
      <div className="p-6 pb-1 flex justify-between">
        <div className="flex gap-4">
          <img
            src={orgsrc}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
          />

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{name}</h2>

            <Link
              to={orgUrl}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Building2 size={14} />
              {organizationText}
              <ExternalLink size={13} />
            </Link>

            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">{time}</p>
          </div>
        </div>

        {/* Three Dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 transition flex items-center justify-center dark:hover:bg-slate-800"
          >
            <MoreHorizontal size={22} className="text-slate-600 dark:text-slate-300" />
          </button>

          <div
            className={`absolute right-0 top-12 w-60 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden z-50 origin-top-right transition-all duration-200 dark:bg-slate-900 dark:border-slate-700 ${
              menuOpen
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-95 invisible"
            }`}
          >
            <button
              onClick={handleSave}
              className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50 transition dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Bookmark
                size={18}
                fill={saved ? "currentColor" : "none"}
              />

              {saved ? "Remove from Saved" : "Save Post"}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-3 w-full px-5 py-3 hover:bg-gray-50 transition dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Copy size={18} />
              Copy Post Link
            </button>

            <div className="border-t dark:border-slate-800" />

            <button
              onClick={handleReport}
              className="flex items-center gap-3 w-full px-5 py-3 text-red-500 hover:bg-red-50 transition dark:hover:bg-red-500/10"
            >
              <Flag size={18} />
              Report Post
            </button>
          </div>
        </div>
      </div>

      {/* POST TEXT */}
      <div className="px-6">
        <p className="text-slate-700 leading-8 text-lg dark:text-slate-300">{posttext}</p>
      </div>

      {/* IMAGE */}
      {postSrc && (
        <div className="mt-2 px-6">
          <img
            src={postSrc}
            alt="Project"
            className="rounded-2xl w-full h-[300px] object-cover"
          />
        </div>
      )}

      {/* APPLICANTS */}
      <div className="px-6 mt-2">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <div className="bg-blue-50 p-2 rounded-xl dark:bg-blue-500/10">
            <Users size={18} className="text-blue-600 dark:text-blue-400" />
          </div>

          <span className="font-semibold">
            {total_applied} Developers Applied
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-6">
        <button className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition text-white font-semibold flex items-center justify-center gap-3 shadow-lg">
          <Users size={20} />

          Join Engineering Team

          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import {
  Users,
  Share2,
  Bookmark,
  ArrowRight,
  Calendar,
  MapPin,
  Building2
} from "lucide-react";

export default function EventBoard() {
  const [activeTab, setActiveTab] = useState("explore"); // 'explore' or 'yours'

  // Dummy data tailored to full-stack & UI/UX
  const events = [
    {
      id: 1,
      type: "explore",
      title: "Global React Summit 2026",
      organizer: "React Community",
      date: "Aug 15, 2026 • 10:00 AM",
      location: "Online",
      description: "Join thousands of developers worldwide to discuss the future of React, Server Components, and the modern Node.js ecosystem.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
      total_applied: 1240,
      skills: "React, Node & UI/UX developers"
    },
    {
      id: 2,
      type: "yours",
      title: "Ahmedabad Tech Hackathon",
      organizer: "CoDO India",
      date: "Sep 05, 2026 • 09:00 AM",
      location: "Ahmedabad, Gujarat",
      description: "A 48-hour in-person hackathon focused on building open-source educational tools. Food, swag, and massive prizes included!",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200",
      total_applied: 312,
      skills: "Full-stack & Python developers"
    }
  ];

  const filteredEvents = events.filter(
    (event) => activeTab === "explore" || event.type === "yours"
  );

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      
      {/* Tabs Header */}
      <div className="flex items-center gap-6 border-b-2 border-slate-200 mb-8 px-2">
        <button
          onClick={() => setActiveTab("explore")}
          className={`pb-4 -mb-[2px] text-lg font-bold transition-colors ${
            activeTab === "explore"
              ? "text-slate-900 border-b-2 border-blue-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Explore Events
        </button>
        <button
          onClick={() => setActiveTab("yours")}
          className={`pb-4 -mb-[2px] text-lg font-bold transition-colors ${
            activeTab === "yours"
              ? "text-slate-900 border-b-2 border-blue-600"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Your Events
        </button>
      </div>

      {/* Event Feed */}
      <div className="space-y-8">
        {filteredEvents.map((event) => (
          <DetailedEventCard key={event.id} {...event} />
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No events found</h3>
            <p className="text-slate-500">You haven't joined any events yet.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}


function DetailedEventCard({
  title,
  organizer,
  date,
  location,
  description,
  image,
  total_applied,
  skills
}) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* ---------------- Event Header (Top Half) ---------------- */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                <Building2 size={16} className="text-blue-600" />
                {organizer}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {location}
              </span>
            </div>
          </div>
        </div>

        <p className="text-slate-700 leading-relaxed text-base mb-5">
          {description}
        </p>
      </div>

      {/* Event Image */}
      {image && (
        <div className="px-6 pb-2">
          <img
            src={image}
            alt={title}
            className="w-full h-[250px] object-cover rounded-2xl border border-slate-100"
          />
        </div>
      )}

      {/* ---------------- Applied Developers (Your Snippet) ---------------- */}
      <div className="mt-4 px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users size={20} className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              {total_applied} Developers Applied
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Looking for {skills}
            </p>
          </div>
        </div>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">
          View →
        </button>
      </div>

      {/* ---------------- Actions (Your Snippet) ---------------- */}
      <div className="grid grid-cols-3 border-t border-slate-100">
        <button className="h-14 flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition font-bold text-sm">
          <Users size={19} />
          Apply
        </button>

        <button className="h-14 flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 hover:text-green-600 transition font-bold text-sm border-x border-slate-100">
          <Share2 size={18} />
          Share
        </button>

        <button
          onClick={() => setSaved(!saved)}
          className={`h-14 flex items-center justify-center gap-2 transition font-bold text-sm ${
            saved
              ? "text-yellow-500 bg-yellow-50/30"
              : "text-slate-600 hover:bg-slate-50 hover:text-yellow-500"
          }`}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* ---------------- CTA (Your Snippet) ---------------- */}
      <div className="p-5 border-t border-slate-100">
        <button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
          <Users size={18} />
          Join Engineering Team
          <ArrowRight size={17} />
        </button>
      </div>

    </article>
  );
}
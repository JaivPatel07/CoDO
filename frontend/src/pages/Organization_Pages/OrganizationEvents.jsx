import { useState } from "react";
import {
    Users,
    Share2,
    Bookmark,
    Calendar,
    MapPin,
    Building2
} from "lucide-react";

// Dummy data for demonstration
const events = [
    {
        id: 1,
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

export default function OrganizationEvents({ organization }) {
    // In the future, you would fetch events for the specific organization.
    // For now, we filter the dummy data.
    const organizationEvents = events.filter(event => event.organizer === organization.username);

    if (organizationEvents.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Events Found</h3>
                <p className="text-slate-500">This organization hasn't posted any events yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {organizationEvents.map((event) => (
                <EventCard key={event.id} {...event} />
            ))}
        </div>
    );
};

function EventCard({ title, date, location, description, image, total_applied, skills }) {
    const [saved, setSaved] = useState(false);

    return (
        <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mt-2">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {location}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="h-9 w-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition">
                            <Share2 size={18} />
                        </button>
                        <button
                            onClick={() => setSaved(!saved)}
                            className={`h-9 w-9 flex items-center justify-center rounded-full transition ${saved ? "text-yellow-500 bg-yellow-50" : "text-slate-500 hover:bg-slate-100"}`}
                        >
                            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                        </button>
                    </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed my-4">{description}</p>

                {image && (
                    <img src={image} alt={title} className="w-full h-[200px] object-cover rounded-xl border border-slate-100 mb-4" />
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Users size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-800">{total_applied} Applied</p>
                            <p className="text-xs font-medium text-slate-500">Seeking: {skills}</p>
                        </div>
                    </div>
                    <button className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all">
                        Apply Now
                    </button>
                </div>
            </div>
        </article>
    );
}
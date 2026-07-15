import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    MapPin,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { fetch_events } from "../../api/events_apis";

export default function OrganizationEvents({ organization }) {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOrgEvents = async () => {
            if (!organization?.username) return;
            try {
                setLoading(true);
                const data = await fetch_events({ org: organization.username });
                setEvents(data);
                setError(null);
            } catch (err) {
                setError("Failed to load events for this organization.");
            } finally {
                setLoading(false);
            }
        };
        loadOrgEvents();
    }, [organization]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 flex items-center gap-2">
                <AlertCircle className="flex-shrink-0" size={16} />
                <p className="text-xs font-semibold">{error}</p>
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No Events Found</h3>
                <p className="text-slate-500 text-sm mt-1">This organization hasn't posted any events yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
                <article
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                                <span className="text-[10px] font-black text-violet-700 bg-violet-55 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                    {event.category}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors mt-2 line-clamp-1">
                                    {event.title}
                                </h3>
                            </div>
                        </div>

                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 my-3">
                            {event.short_description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {event.event_date}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                        </div>
                    </div>

                    <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Details</span>
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-violet-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </article>
            ))}
        </div>
    );
};
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarDays,
  Sparkles,
  ArrowUpRight,
  Eye,
  UserPlus,
  Megaphone,
  MapPin,
  Plus,
} from "lucide-react";
import { UserContext } from "../../contextAPI/userContext";

const Metric = ({ icon: Icon, label, value, change, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-500`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 font-semibold">
      <ArrowUpRight size={14} />
      <span>{change}</span>
    </div>
  </div>
);

const EventCard = ({ title, date, location, members, onClick }) => (
  <div className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-200/70 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer">
    <div>
      <h3 className="font-semibold text-sm text-slate-800">{title}</h3>
      <div className="flex gap-4 mt-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><CalendarDays size={13} />{date}</span>
        <span className="flex items-center gap-1.5"><MapPin size={13} />{location}</span>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-lg text-slate-800">{members}</p>
      <p className="text-xs text-slate-500">Joined</p>
    </div>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="w-full bg-white/10 p-4 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-200">
    <Icon size={18} />
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

export default function OrganizationDashboardPage() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);

  const handleCreateEvent = () => {
    navigate(`/organization/${userData.username}/create/event`);
  };

  const handleManageEvents = () => {
    navigate(`/organization/${userData.username}/events`);
  };

  return (
    <div className="max-w-7xl mx-auto py-2 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Good evening, {userData.organization_name || "Organization"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your community growth and event performance.
          </p>
        </div>
        <button
          onClick={handleCreateEvent}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-95 hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Metric icon={Eye} label="Profile Reach" value="24.8K" change="+18% this month" color="indigo" />
        <Metric icon={Users} label="Active Students" value="3,240" change="+12% this month" color="violet" />
        <Metric icon={CalendarDays} label="Events Hosted" value="28" change="+4 new events" color="sky" />
        <Metric icon={UserPlus} label="Registrations" value="8,921" change="+24% growth" color="emerald" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Analytics */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-7 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-slate-800">Community Analytics</h2>
              <p className="text-sm text-slate-500">Student engagement over last 30 days</p>
            </div>
            <Sparkles className="text-violet-500" />
          </div>
          <div className="h-72 mt-6 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
            <p className="text-slate-400 font-medium text-sm">Analytics Graph Area</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-slate-900 rounded-2xl p-7 text-white">
          <h2 className="text-lg font-bold">Quick Actions</h2>
          <div className="mt-5 space-y-3">
            <QuickActionButton icon={Plus} label="Create New Event" onClick={handleCreateEvent} />
            <QuickActionButton icon={CalendarDays} label="Manage All Events" onClick={handleManageEvents} />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8 bg-white border border-slate-200/70 rounded-2xl p-7 shadow-sm" onClick={handleManageEvents}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-800">Upcoming Events</h2>
          <button className="text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors">
            View all
          </button>
        </div>
        <div className="space-y-3">
          <EventCard title="AI Workshop 2026" date="Aug 12" location="LJ University" members="240" />
          <EventCard title="Hackathon Meetup" date="Aug 20" location="Ahmedabad" members="560" />
        </div>
      </div>
    </div>
  );
}
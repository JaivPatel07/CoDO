import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";
import { UserContext } from "../../contextAPI/userContext";
import { fetch_organization_dashboard_analytics } from "../../api/events_apis";

const metricTone = {
  indigo: "bg-indigo-50 text-indigo-600",
  violet: "bg-violet-50 text-violet-600",
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);

const Metric = ({ icon: Icon, label, value, change, color }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm hover:shadow-lg hover:border-violet-300 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{formatNumber(value)}</p>
      </div>
      <div className={`p-3 rounded-xl ${metricTone[color] || metricTone.indigo}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-3 text-xs text-violet-600 font-semibold">
      <ArrowUpRight size={14} />
      <span>{change}</span>
    </div>
  </div>
);

const EventCard = ({ title, date, location, registrations }) => (
  <div className="flex justify-between items-center p-4 rounded-xl bg-white border border-slate-200/70 hover:bg-slate-50/50 transition-all duration-200">
    <div>
      <h3 className="font-semibold text-sm text-slate-800">{title}</h3>
      <div className="flex gap-4 mt-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><CalendarDays size={13} />{date}</span>
        <span className="flex items-center gap-1.5"><MapPin size={13} />{location}</span>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-lg text-slate-800">{formatNumber(registrations)}</p>
      <p className="text-xs text-slate-500">Registrations</p>
    </div>
  </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
  <button onClick={onClick} className="w-full bg-white/10 p-4 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-200">
    <Icon size={18} />
    <span className="font-semibold text-sm">{label}</span>
  </button>
);

const seriesConfig = {
  profile_views: { label: "Profile Views", color: "#4f46e5" },
  followers: { label: "Followers", color: "#7c3aed" },
  registrations: { label: "Event Registrations", color: "#f59e0b" },
};

function AnalyticsChart({ data }) {
  const [visible, setVisible] = useState({
    profile_views: true,
    followers: true,
    registrations: true,
  });

  const activeKeys = Object.keys(visible).filter((key) => visible[key]);
  const maxValue = Math.max(1, ...data.flatMap((point) => activeKeys.map((key) => point[key] || 0)));
  const width = 900;
  const height = 300;
  const padding = { top: 24, right: 24, bottom: 46, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const pointsFor = (key) => data.map((point, index) => {
    const x = padding.left + (data.length === 1 ? 0 : (index / (data.length - 1)) * chartWidth);
    const y = padding.top + chartHeight - ((point[key] || 0) / maxValue) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(seriesConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
              visible[key] ? "border-slate-300 bg-white text-slate-800" : "border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
            {cfg.label}
          </button>
        ))}
      </div>

      <div className="mt-5 w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = padding.top + chartHeight - tick * chartHeight;
            return (
              <g key={tick}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e2e8f0" />
                <text x={padding.left - 12} y={y + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
                  {Math.round(maxValue * tick)}
                </text>
              </g>
            );
          })}

          {data.map((point, index) => {
            const x = padding.left + (data.length === 1 ? 0 : (index / (data.length - 1)) * chartWidth);
            const showLabel = index % 2 === 0 || index === data.length - 1;
            return showLabel ? (
              <text key={point.key} x={x} y={height - 18} textAnchor="middle" className="fill-slate-500 text-[11px]">
                {point.label.split(" ")[0]}
              </text>
            ) : null;
          })}

          {activeKeys.map((key) => (
            <polyline
              key={key}
              fill="none"
              stroke={seriesConfig[key].color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsFor(key)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function OrganizationDashboardPage() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleCreateEvent = () => {
    navigate(`/organization/${userData.username}/create/event`);
  };

  const handleManageEvents = () => {
    navigate(`/organization/${userData.username}/events`);
  };

  useEffect(() => {
    let isMounted = true;
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetch_organization_dashboard_analytics();
        if (isMounted) setAnalytics(data);
      } catch (err) {
        if (isMounted) setError(err.error || err.detail || "Failed to load dashboard analytics.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAnalytics();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = analytics?.cards;
  const upcomingEvents = analytics?.upcoming_events || [];
  const profileGrowth = cards?.profile_views?.monthly_growth_percent || 0;

  const metrics = useMemo(() => ([
    {
      icon: Eye,
      label: "Profile Views",
      value: cards?.profile_views?.total,
      change: `${profileGrowth >= 0 ? "+" : ""}${profileGrowth}% vs last month`,
      color: "indigo",
    },
    {
      icon: Users,
      label: "Followers",
      value: cards?.followers?.total,
      change: `+${formatNumber(cards?.followers?.current_month)} this month`,
      color: "violet",
    },
    {
      icon: CalendarDays,
      label: "Events Hosted",
      value: cards?.events_hosted?.total,
      change: `${formatNumber(cards?.events_hosted?.current_month)} created this month`,
      color: "sky",
    },
    {
      icon: UserPlus,
      label: "Registrations",
      value: cards?.registrations?.total,
      change: `+${formatNumber(cards?.registrations?.current_month)} this month`,
      color: "emerald",
    },
  ]), [cards, profileGrowth]);

  return (
    <div className="max-w-7xl mx-auto py-2 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Good evening, {userData.organization_name || userData.username || "Organization"}
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

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500">
          <RefreshCw size={16} className="animate-spin" />
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {metrics.map((metric) => <Metric key={metric.label} {...metric} />)}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 p-7 shadow-sm">
              <div>
                <h2 className="font-bold text-lg text-slate-800">Community Analytics</h2>
                <p className="text-sm text-slate-500">Profile views, followers, and registrations over the last 12 months</p>
              </div>
              <AnalyticsChart data={analytics?.chart || []} />
            </div>

            <div className="bg-slate-900 rounded-2xl p-7 text-white">
              <h2 className="text-lg font-bold">Quick Actions</h2>
              <div className="mt-5 space-y-3">
                <QuickActionButton icon={Plus} label="Create New Event" onClick={handleCreateEvent} />
                <QuickActionButton icon={CalendarDays} label="Manage All Events" onClick={handleManageEvents} />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white border border-slate-200/70 rounded-2xl p-7 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-slate-800">Upcoming Events</h2>
              <button onClick={handleManageEvents} className="text-sm font-bold text-violet-600 hover:text-violet-800 transition-colors">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    date={event.event_date}
                    location={event.location}
                    registrations={event.registration_link_clicks}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-500">
                  No upcoming events yet.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

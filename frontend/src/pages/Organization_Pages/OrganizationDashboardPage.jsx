import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Plus,
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
  Building2,
  ChevronRight,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { UserContext } from "../../contextAPI/userContext";
import { fetch_organization_dashboard_analytics, fetch_events } from "../../api/events_apis";
import AnalyticsChart from "../../components/AnalyticsChart";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const fmt = (v) => new Intl.NumberFormat("en-US").format(v || 0);

function formatDate(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getEventStatus(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${event.event_date}T00:00:00`);
  const end = event.end_date ? new Date(`${event.end_date}T00:00:00`) : start;
  if (start > today) return "Upcoming";
  if (start <= today && end >= today) return "Ongoing";
  return "Completed";
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
const statMeta = {
  total: {
    label: "Total Events",
    icon: Layers,
    bg: "bg-slate-50",
    iconColor: "text-slate-500",
    borderColor: "border-slate-200",
  },
  upcoming: {
    label: "Upcoming Events",
    icon: Clock,
    bg: "bg-violet-50",
    iconColor: "text-violet-500",
    borderColor: "border-violet-100",
  },
  completed: {
    label: "Completed Events",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    borderColor: "border-emerald-100",
  },
  registrations: {
    label: "Registrations",
    icon: UserPlus,
    bg: "bg-amber-50",
    iconColor: "text-amber-500",
    borderColor: "border-amber-100",
  },
};

const StatCard = ({ kind, value, hint }) => {
    const meta = statMeta[kind];
    const Icon = meta.icon;

    return ( 
        <div className={`group bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10 ${meta.borderColor}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{meta.label}</p>
                <div className={`h-8 w-8 flex items-center justify-center rounded-lg ${meta.bg} ${meta.iconColor}`}>
                    <Icon size={16} />
                </div>
            </div>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">{fmt(value)}</p>
            {hint && (
                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-violet-500 transition-colors">
                    <TrendingUp size={13} />
                    <span>{hint}</span>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Upcoming: "bg-violet-50 text-violet-600 border-violet-100",
    Ongoing: "bg-amber-50 text-amber-600 border-amber-100", 
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
      <span
       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
         map[status] || "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
       }`}
      >
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────
// THREE-DOT MENU
// ─────────────────────────────────────────────
function EventRowMenu({ onEdit, onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function h(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      > 
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_8px_24px_rgba(0,0,0,0.10)] py-1 z-20">
          {onView && (
            <button
              onClick={() => { onView(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              View details
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => { onEdit(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3.5 py-2 text-sm text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Edit event
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// RECENT EVENT ROW
// ─────────────────────────────────────────────
function RecentEventRow({ event, onManage, onEdit }) {
  const status = getEventStatus(event);

  return ( 
    <div className="group flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-all duration-200">
      {/* Color accent strip */}
      <div
        className={`w-1 self-stretch rounded-full shrink-0 ${
          status === "Upcoming"
            ? "bg-violet-400"
            : status === "Ongoing"
            ? "bg-amber-400"
            : "bg-emerald-400"
        }`}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
            {event.title}
          </p>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <CalendarDays size={11} className="shrink-0" />
            {formatDate(event.event_date)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1 truncate max-w-[160px]">
              <MapPin size={11} className="shrink-0" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0"> 
        <button
          onClick={onManage}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all shadow-sm"
        >
          Manage
          <ArrowRight size={12} />
        </button>
        <EventRowMenu
          onEdit={onEdit}
          onView={onManage}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QUICK ACTION BUTTON
// ─────────────────────────────────────────────
function QuickAction({ icon: Icon, label, description, onClick, primary }) {
  return (
    <button
      onClick={onClick} 
      className={`flex items-start gap-3 w-full p-4 rounded-xl border text-left transition-all duration-200 ${
        primary
          ? "bg-violet-600 border-violet-600 text-white hover:bg-violet-700 shadow-[0_4px_12px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-violet-200 hover:bg-violet-50 hover:-translate-y-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] active:scale-[0.98]"
      }`}
    >
      <div
        className={`p-2 rounded-lg shrink-0 $ 
          primary ? "bg-white/20" : "bg-violet-50"
        }`}
      >
        <Icon size={16} className={primary ? "text-white" : "text-violet-600"} />
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-bold leading-tight ${primary ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
          {label}
        </p>
        {description && (
          <p className={`text-xs mt-0.5 ${primary ? "text-violet-100" : "text-slate-500 dark:text-slate-400"}`}>
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl ${className}`} />
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Hero */}
            <div>
                <Skeleton className="h-9 w-80 mb-2" />
                <Skeleton className="h-4 w-56" />
            </div>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-16 mt-2" />
                    </div>
                ))}
            </div>
            {/* Two-col */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-14 w-full" />
                    ))}
                </div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[68px] w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function OrganizationDashboardPage() {
  const navigate = useNavigate();
  const { organization_name } = useParams();
  const { userData } = useContext(UserContext);

  const [analytics, setAnalytics] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const base = `/organization/${organization_name}`;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [analyticsData, eventsData] = await Promise.all([
          fetch_organization_dashboard_analytics(),
          fetch_events({ org: organization_name }),
        ]);
        if (mounted) {
          setAnalytics(analyticsData);
          // Sort by event_date descending, take most recent 5
          const sorted = (eventsData?.results || eventsData || [])
            .slice()
            .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
            .slice(0, 5);
          setEvents(sorted);
        }
      } catch (err) {
        if (mounted)
          setError(
            err?.error || err?.detail || "Failed to load dashboard data."
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [organization_name]);

  // Derive stat values
  const statValues = useMemo(() => {
    const allEvents = events;
    const total = analytics?.cards?.events_hosted?.total ?? allEvents.length;
    const upcoming = allEvents.filter(
      (e) => getEventStatus(e) === "Upcoming"
    ).length;
    const completed = allEvents.filter(
      (e) => getEventStatus(e) === "Completed"
    ).length;
    const registrations =
      analytics?.cards?.registrations?.total ?? 0;
    return { total, upcoming, completed, registrations };
  }, [analytics, events]);

  const orgDisplayName =
    userData?.organization_name ||
    userData?.username ||
    organization_name;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Error Banner ── */} 
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ── Hero Section ── */} 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-1">
            Organization Dashboard
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight dark:text-slate-100">
            Welcome back, {orgDisplayName} 👋
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 max-w-md dark:text-slate-400">
            Manage your events and organization from one place.
          </p>
        </div>
        <button
          id="dashboard-create-event-hero"
          onClick={() => navigate(`${base}/create/event`)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 self-start sm:self-auto whitespace-nowrap dark:bg-violet-600 dark:hover:bg-violet-700"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"> 
        <StatCard
          kind="total"
          value={statValues.total}
          hint={`${statValues.total} events hosted`}
        />
        <StatCard
          kind="upcoming"
          value={statValues.upcoming}
          hint="Scheduled ahead"
        />
        <StatCard
          kind="completed"
          value={statValues.completed}
          hint="Successfully concluded"
        />
        <StatCard
          kind="registrations"
          value={statValues.registrations}
          hint={`+${fmt(analytics?.cards?.registrations?.current_month ?? 0)} this month`}
        />
      </div>

      {/* ── Analytics Chart ── */} 
      <AnalyticsChart data={analytics?.chart || []} />

      {/* ── Main Grid: Events + Quick Actions ── */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* Recent Events Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recent Events
              </h2>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                Your most recently created events
              </p>
            </div>
            <button
              id="dashboard-view-all-events"
              onClick={() => navigate(`${base}/events`)}
              className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
            >
              View all
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Event Rows */}
          <div className="px-3 py-3"> 
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-14 w-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-3">
                  <Sparkles size={24} className="text-violet-400" />
                </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No events yet
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[220px]">
                  Create your first event to see it here.
                </p>
                <button
                  onClick={() => navigate(`${base}/create/event`)}
                  className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md hover:bg-violet-700 transition-colors"
                >
                  + Create Event
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {events.map((event) => (
                  <RecentEventRow
                    key={event.id}
                    event={event}
                    onManage={() => navigate(`${base}/events`)}
                    onEdit={() => navigate(`${base}/events/edit/${event.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3"> 
          {/* Quick Actions card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
            </div>
            <div className="p-3 space-y-2">
              <QuickAction
                icon={Plus}
                label="Create Event"
                description="Publish a new event"
                onClick={() => navigate(`${base}/create/event`)}
                primary
              />
              <QuickAction
                icon={CalendarDays}
                label="View All Events"
                description="Browse & manage events"
                onClick={() => navigate(`${base}/events`)}
              />
              <QuickAction
                icon={Building2}
                label="Edit Organization Profile"
                description="Update your public profile"
                onClick={() =>
                  navigate(`/organization/${organization_name}/profile`)
                }
              />
            </div>
          </div>

          {/* Mini analytics card */}
          {analytics?.cards && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
                Community Snapshot
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Profile Views",
                    value: analytics.cards.profile_views?.total,
                    sub: `+${analytics.cards.profile_views?.monthly_growth_percent ?? 0}% this month`,
                  },
                  {
                    label: "Followers",
                    value: analytics.cards.followers?.total,
                    sub: `+${fmt(analytics.cards.followers?.current_month)} new`,
                  },
                  {
                    label: "Registrations",
                    value: analytics.cards.registrations?.total,
                    sub: `+${fmt(analytics.cards.registrations?.current_month)} this month`,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.sub}</p>
                    </div>
                    <p className="text-base font-black text-slate-900 dark:text-slate-100">
                      {fmt(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Code2,
  Crown,
  Layers,
  MapPin,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

import { get_connection_suggestions } from "../../../api/networks_api";
import { fetch_dashboard } from "../../../api/dashboard_apis";
import { fetch_events, mark_event_interested, unmark_event_interested } from "../../../api/events_apis";
import { fetchOpenSourceProjects } from "../../../api/opensource_apis";
import { fetch_saved_items, save_item, unsave_item } from "../../../api/saved_apis";
import EventCard from "../../../components/cards/EventCard";
import OpenSourceProjectCard from "../../../components/cards/OpenSourceProjectCard";
import CollabrationPostCard from "../../../components/CollabrationPostCard";
import SuggestionCard from "../../Network/SuggestionCard";

const panel =
  "rounded-3xl border border-white/70 bg-white/75 dark:bg-slate-900/75 shadow-[0_12px_40px_rgba(76,29,149,0.08)] backdrop-blur-xl";

function SectionHeader({ title, subtitle, action = "View all", onAction }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-100">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-violet-600 transition hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/30"
        >
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function EmptyBlock({ message, actionLabel, onAction }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 py-10 text-center dark:bg-slate-900/70">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700 dark:hover:bg-violet-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function CardSkeleton({ height = "h-64" }) {
  return <div className={`${height} animate-pulse rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80`} />;
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 dark:border-slate-700/80 dark:bg-slate-800/80 px-3 py-2 shadow-sm">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
        <Icon size={15} />
      </span>
      <div className="leading-tight">
        <p className="text-sm font-black text-slate-900 dark:text-slate-100">{value}</p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}

function WelcomeCard({ dashboard, loading }) {
  if (loading) {
    return (
      <section className={`${panel} min-h-[220px] animate-pulse p-8`}>
        <div className="h-4 w-40 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-6 h-10 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-4 h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
      </section>
    );
  }

  const welcome = dashboard?.welcome;
  const stats = dashboard?.stats;
  const displayName = welcome?.firstname || welcome?.username || "there";

  return (
    <section className={`${panel} relative overflow-hidden p-8`}>
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Welcome back
          </p>

          <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-950 dark:text-slate-100 md:text-5xl">
            Hi {displayName},
            <br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
              your next build starts here.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {welcome?.hero_message || "Pick up where you left off, discover collaborators, and turn ideas into projects."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {welcome?.preferred_role && (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                {welcome.preferred_role}
              </span>
            )}
            {welcome?.college && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                {welcome.college}
              </span>
            )}
          </div>
        </div>

        {stats && (
          <div className="grid shrink-0 grid-cols-2 gap-3">
            <StatPill icon={Layers} label="Workspaces" value={stats.workspaces} />
            <StatPill icon={Users} label="Connections" value={stats.connections} />
            <StatPill icon={CalendarDays} label="Upcoming" value={stats.upcoming_events} />
            <StatPill icon={Bookmark} label="Saved" value={stats.saved_items} />
          </div>
        )}
      </div>

      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-violet-300/50 blur-3xl dark:bg-violet-500/20" />
      <div className="absolute -top-20 right-28 h-48 w-48 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-500/20" />
    </section>
  );
}

function formatWorkspaceDates(workspace) {
  if (!workspace.start_date) return "Dates not set";
  const options = { month: "short", day: "numeric" };
  const start = new Date(`${workspace.start_date}T00:00:00`).toLocaleDateString("en-US", options);
  if (!workspace.end_date || workspace.end_date === workspace.start_date) return start;
  const end = new Date(`${workspace.end_date}T00:00:00`).toLocaleDateString("en-US", options);
  return `${start} - ${end}`;
}

function WorkspaceCard({ workspace, userName }) {
  const navigate = useNavigate();
  const tags = [...(workspace.roles || []), ...(workspace.skills || [])];

  return (
    <article
      onClick={() =>
        workspace.event
          ? navigate(`/user/${userName}/managepost/${workspace.event}`)
          : navigate(`/user/${userName}/workspace/team/${workspace.id}`, { state: { receiver: workspace.workspace_id } })
      }
      className="group flex cursor-pointer flex-col rounded-2xl border border-slate-100 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 p-5 transition hover:-translate-y-1 hover:border-violet-200 dark:hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
            <Code2 size={20} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-400">{workspace.title}</h3>
            <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
              {workspace.event_type || "Team workspace"}
              {workspace.event_mode ? ` • ${workspace.event_mode}` : ""}
            </p>
          </div>
        </div>
        {workspace.is_leader && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <Crown size={11} />
            Leader
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={13} className="text-violet-500" />
          {formatWorkspaceDates(workspace)}
        </span>
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin size={13} className="text-violet-500" />
          <span className="truncate">{workspace.event_location || workspace.event_mode || "Not specified"}</span>
        </span>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md border border-violet-100 bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span className="text-slate-500 dark:text-slate-400">Team filled</span>
          <span className="text-violet-600">{workspace.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
            style={{ width: `${workspace.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-300">
          {workspace.members}
          {workspace.team_size ? `/${workspace.team_size}` : ""} members
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-violet-600 dark:text-violet-400">
          {workspace.event ? "View Post" : "Browse Collaborations"} 
          <ArrowRight size={15} />
        </span>
      </div>
    </article>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user_name } = useParams();
  const userName = user_name || localStorage.getItem("username");

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [interestBusyId, setInterestBusyId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [savedItems, setSavedItems] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);

  const [saveBusyId, setSaveBusyId] = useState(null);

  const loadDashboard = useCallback(async () => {
    try {
      setDashboard(await fetch_dashboard());
    } catch (error) {
      console.log(error);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const loadSuggestions = useCallback(async () => {
    try {
      const response = await get_connection_suggestions(4);
      setSuggestions(response.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const params = { sort: "most_interested", page: 1, page_size: 3 };
      const upcoming = await fetch_events({ ...params, status: "upcoming" });
      const results = upcoming.results?.length ? upcoming.results : (await fetch_events(params)).results;
      setEvents(results || []);
    } catch (error) {
      console.log(error);
    } finally {
      setEventsLoading(false);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const response = await fetchOpenSourceProjects();
      const list = Array.isArray(response.data) ? response.data : response.data?.results || [];
      setProjects(list.slice(0, 3));
    } catch (error) {
      console.log(error);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const loadSavedItems = useCallback(async () => {
    try {
      setSavedItems(await fetch_saved_items({ limit: 3 }));
    } catch (error) {
      console.log(error);
    } finally {
      setSavedLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
    loadSuggestions();
    loadEvents();
    loadProjects();
    loadSavedItems();
  }, [loadDashboard, loadSuggestions, loadEvents, loadProjects, loadSavedItems]);

  const handleToggleInterest = async (event, e) => {
    e.stopPropagation();
    if (interestBusyId === event.id) return;
    setInterestBusyId(event.id);
    try {
      const data = event.is_interested
        ? await unmark_event_interested(event.id)
        : await mark_event_interested(event.id);
      setEvents((current) =>
        current.map((item) =>
          item.id === event.id
            ? { ...item, is_interested: data.is_interested, interested_count: data.interested_count }
            : item
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setInterestBusyId(null);
    }
  };

  const toggleSave = async (itemType, item, nextSaved, applyLocal) => {
    setSaveBusyId(item.id);
    applyLocal(nextSaved);
    try {
      if (nextSaved) await save_item(itemType, item.id);
      else await unsave_item(itemType, item.id);
      loadSavedItems();
    } catch (error) {
      console.log(error);
      applyLocal(!nextSaved);
    } finally {
      setSaveBusyId(null);
    }
  };

  const handleToggleEventSave = (event, e) => {
    e.stopPropagation();
    if (saveBusyId === event.id) return;
    return toggleSave("event", event, !event.is_saved, (value) =>
      setEvents((current) => current.map((item) => (item.id === event.id ? { ...item, is_saved: value } : item)))
    );
  };

  const handleToggleProjectSave = (project, e) => {
    e.stopPropagation();
    if (saveBusyId === project.id) return;
    return toggleSave("project", project, !project.is_saved, (value) =>
      setProjects((current) => current.map((item) => (item.id === project.id ? { ...item, is_saved: value } : item)))
    );
  };

  const handleRemoveSaved = async (itemType, itemId) => {
    setSavedItems((current) =>
      current.filter((item) => !(item.item_type === itemType && item[itemType]?.id === itemId))
    );
    try {
      await unsave_item(itemType, itemId);
    } catch (error) {
      console.log(error);
    } finally {
      loadSavedItems();
      if (itemType === "event") {
        setEvents((current) => current.map((item) => (item.id === itemId ? { ...item, is_saved: false } : item)));
      }
      if (itemType === "project") {
        setProjects((current) => current.map((item) => (item.id === itemId ? { ...item, is_saved: false } : item)));
      }
    }
  };

  const renderSavedItem = (savedItem) => {
    if (savedItem.item_type === "event" && savedItem.event) {
      return (
        <EventCard
          key={`saved-event-${savedItem.id}`}
          event={savedItem.event}
          userName={userName}
          saveBusyId={saveBusyId}
          onToggleSave={(event, e) => {
            e.stopPropagation();
            handleRemoveSaved("event", event.id);
          }}
        />
      );
    }

    if (savedItem.item_type === "project" && savedItem.project) {
      return (
        <OpenSourceProjectCard
          key={`saved-project-${savedItem.id}`}
          project={savedItem.project}
          userName={userName}
          saveBusyId={saveBusyId}
          onToggleSave={(project, e) => {
            e.stopPropagation();
            handleRemoveSaved("project", project.id);
          }}
        />
      );
    }

    if (savedItem.item_type === "collabration" && savedItem.collabration) {
      return (
        <CollabrationPostCard
          key={`saved-collabration-${savedItem.id}`}
          project={savedItem.collabration}
          onUnsave={(post) => handleRemoveSaved("collabration", post.id)}
        />
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-48 top-20 h-[560px] w-[560px] rounded-full bg-blue-300/25 blur-[130px] dark:bg-blue-500/10" />
        <div className="absolute -right-40 top-0 h-[620px] w-[620px] rounded-full bg-violet-300/30 blur-[150px] dark:bg-violet-500/10" />
        <div className="absolute left-1/3 top-[48rem] h-[500px] w-[500px] rounded-full bg-indigo-200/30 blur-[140px] dark:bg-indigo-500/10" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-[1400px] space-y-7 px-4 py-8 md:px-8 md:py-10">
        <WelcomeCard dashboard={dashboard} loading={dashboardLoading} />

        <section className={`${panel} p-6`}>
          <SectionHeader
            title="Continue working"
            subtitle="Jump back into the teams you are building with"
            action="All workspaces"
            onAction={() => navigate(`/user/${userName}/collabrate`)}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboardLoading ? (
              Array.from({ length: 3 }).map((_, index) => <CardSkeleton key={index} height="h-72" />)
            ) : dashboard?.workspaces?.length ? (
              dashboard.workspaces.slice(0, 3).map((workspace) => (
                <WorkspaceCard key={workspace.id} workspace={workspace} userName={userName} />
              ))
            ) : (
              <EmptyBlock
                message="You are not part of any team workspace yet."
                actionLabel="Find a collaboration"
                onAction={() => navigate(`/user/${userName}/collabrate`)}
              />
            )}
          </div>
        </section>

        <section className={`${panel} p-6`}>
          <SectionHeader
            title="Suggested connections"
            subtitle="Students you can collaborate with"
            onAction={() => navigate(`/user/${userName}/suggestions`)}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {suggestionsLoading ? (
              Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} height="h-80" />)
            ) : suggestions.length ? (
              suggestions.slice(0, 4).map((person) => (
                <SuggestionCard key={person.username} user={person} onConnect={loadSuggestions} />
              ))
            ) : (
              <EmptyBlock message="No suggested connections right now." />
            )}
          </div>
        </section>

        <section className={`${panel} p-6`}>
          <SectionHeader
            title="Trending events"
            subtitle="Hackathons, workshops and meetups picked for you"
            onAction={() => navigate(`/user/${userName}/events`)}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {eventsLoading ? (
              Array.from({ length: 3 }).map((_, index) => <CardSkeleton key={index} height="h-[430px]" />)
            ) : events.length ? (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  userName={userName}
                  interestBusyId={interestBusyId}
                  saveBusyId={saveBusyId}
                  onToggleInterest={handleToggleInterest}
                  onToggleSave={handleToggleEventSave}
                />
              ))
            ) : (
              <EmptyBlock
                message="No upcoming events yet."
                actionLabel="Browse events"
                onAction={() => navigate(`/user/${userName}/events`)}
              />
            )}
          </div>
        </section>

        <section className={`${panel} p-6`}>
          <SectionHeader
            title="Recommended projects"
            subtitle="Open source repositories looking for contributors"
            onAction={() => navigate(`/user/${userName}/open-source`)}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectsLoading ? (
              Array.from({ length: 3 }).map((_, index) => <CardSkeleton key={index} height="h-[430px]" />)
            ) : projects.length ? (
              projects.map((project) => (
                <OpenSourceProjectCard
                  key={project.id}
                  project={project}
                  userName={userName}
                  saveBusyId={saveBusyId}
                  onToggleSave={handleToggleProjectSave}
                />
              ))
            ) : (
              <EmptyBlock
                message="No open source projects published yet."
                actionLabel="Explore open source"
                onAction={() => navigate(`/user/${userName}/open-source`)}
              />
            )}
          </div>
        </section>

        <section className={`${panel} p-6`}>
          <SectionHeader
            title="Saved items"
            subtitle="Events, projects and collaborations you bookmarked"
            onAction={() => navigate(`/user/${userName}/profile?tab=saved`)}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedLoading ? (
              Array.from({ length: 3 }).map((_, index) => <CardSkeleton key={index} height="h-[430px]" />)
            ) : savedItems.length ? (
              savedItems.map(renderSavedItem)
            ) : (
              <EmptyBlock
                message="Nothing saved yet — tap the bookmark icon on any event or project."
                actionLabel="Discover events"
                onAction={() => navigate(`/user/${userName}/events`)}
              />
            )}
          </div>
        </section>

<section className={`${panel} flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between`}>
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
              <Sparkles size={19} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">Looking for teammates?</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Post a collaboration and let the right people find you.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/user/${userName}/collabrate`)}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 dark:hover:bg-violet-500 shadow-lg shadow-violet-500/20"
            >
              <Users size={16} />
              Browse collaborations
            </button>
            <button 
              onClick={() => navigate(`/user/${userName}/suggestions`)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50 dark:hover:bg-slate-700"
            >
              <UserPlus size={16} />
              Grow your network
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

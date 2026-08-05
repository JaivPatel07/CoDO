import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Code2,
  Rocket,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  get_connection_suggestions,
  add_network_request,
} from "../../../api/networks_api";
import { GitCommitHorizontal } from "lucide-react";

import { fetch_dashboard } from "../../../api/dashboard_apis";
import {
  toggle_save_collab, // Keep this if CollabrationPostCard still needs it, otherwise remove
} from "../../../api/save_apis";
import CollabrationPostCard from "../../../components/CollabrationPostCard";

// Icon mapping for ActivityFeed
const iconMap = {
  Rocket: Rocket,
  Sparkles: Sparkles,
  Code2: Code2,
  GitCommitHorizontal: GitCommitHorizontal,
  Brain: Brain,
};

const panel =
  "rounded-3xl border border-white/70 bg-white/75 shadow-[0_12px_40px_rgba(76,29,149,0.08)] backdrop-blur-xl";

function SectionHeader({ title, subtitle, action = "View all", onActionClick }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {onActionClick && (
        <button onClick={onActionClick} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-violet-600 transition hover:bg-violet-50">
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

function WelcomeCard({ dashboard, loading }) {
  console.log(dashboard);
  if (loading) {
    return (
      <section
        className={`${panel} relative min-h-[244px] overflow-hidden p-8 lg:col-span-6`}
      >
        <p>Loading...</p>
      </section>
    );
  }

  const welcome = dashboard?.welcome;

  return (
    <section
      className={`${panel} relative min-h-[244px] overflow-hidden p-8 lg:col-span-6`}
    >
      <div className="relative z-10 flex h-full max-w-xl flex-col justify-center">
        <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          System Online • Session Active
        </p>

        <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-950 md:text-5xl">
          Welcome back, {welcome.firstname}.
          <br />
          <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent"> 
            Your next build starts here.
          </span>
        </h1>

        <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
          {/* Pick up where you left off, discover new collaborators, and turn your
          ideas into real projects. */}
          {welcome?.hero_message}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700"> 
            {welcome.preferred_role}
          </span>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {welcome.college}
          </span>
        </div>
      </div>

      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-violet-300/50 blur-3xl" />
      <div className="absolute -top-20 right-28 h-48 w-48 rounded-full bg-blue-200/50 blur-3xl" />
    </section>
  );
}

function WorkspaceCard({ workspace }) {
  const Icon = Code2;
  return ( 
    <article className="group rounded-2xl border border-slate-100 bg-white/85 p-5 transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <span
            // className={`grid h-11 w-11 place-items-center rounded-xl ${workspace.iconClass}`} // Original comment, keeping for reference
            className={`grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-600`}
          >
            <Icon size={20} />
          </span>
          <div>
            <h3 className="font-bold text-slate-900">{workspace.title}</h3>
            <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {workspace.type}
            </span>
          </div>
        </div> 

      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span className="text-slate-500">Sprint progress</span>
          <span className="text-violet-600">{workspace.progress || 0}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
            style={{ width: `${workspace.progress}%` }}
          />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-sm font-medium text-slate-500">
          {workspace.membersCount || 0} Members
        </div>
        <button className="inline-flex items-center gap-1 text-sm font-bold text-violet-600">
          Open <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

function ConnectionsCard({ suggestions, refreshSuggestions }) {
  const navigate = useNavigate();

  const handleConnect = async (username, e) => {
    e.stopPropagation();

    try {
      await add_network_request({ receiver_username: username });
      await refreshSuggestions();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={`${panel} p-6 lg:col-span-4`}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">
          Suggested Connections
        </h2>

        <button
          onClick={() =>
            navigate(`/user/${localStorage.getItem("username")}/suggestions`)
          }
          className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700"
        >
          View All
          <ArrowRight size={15} />
        </button>
      </div>
      <div className="space-y-2">
        {suggestions.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No suggested connections found.
          </div>
        ) : (
          suggestions.map((person) => (
            <article
              key={person.username}
              className="flex items-center justify-between gap-3 rounded-2xl p-3 transition hover:bg-white hover:shadow-sm"
            >
              <div
                onClick={() => navigate(`/user/${person.username}/profile`)}
                className="flex flex-1 cursor-pointer items-center gap-3"
              >
                <div className="relative">
                  {person.profile_pic ? (
                    <img
                      src={person.profile_pic}
                      alt={person.fullname}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {person.username?.charAt(0)}
                    </span>
                  )}
                  {/* {person.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              )} */}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <h3 className="truncate font-bold text-slate-900">
                      {/* {person.fullname} */}
                      {person.username}
                    </h3>
                    {/* <p className="text-xs text-slate-400">
                    @{person.username}
                  </p> */}
                    {/* <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {person.match}% match
                </span> */}
                    {/* <p className="truncate text-xs text-slate-500">
                  {person.skills?.slice(0, 3).join(" • ")}
                </p> */}
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {/* {person.skills?.slice(0, 3).join(" • ")} */}
                    {person.preferred_role}
                    {person.college && ` • ${person.college}`}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => handleConnect(person.username, e)}
                className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
              >
                Connect
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function MiniEventCard({ event }) {
  const navigate = useNavigate();
  return (
    <article
      key={event.id}
      onClick={() => navigate(`/user/${localStorage.getItem("username")}/event/${event.id}`)}
      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition hover:border-violet-200 hover:shadow-lg cursor-pointer"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600">
        <CalendarDays size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-slate-900 group-hover:text-violet-600">
          {event.title}
        </h3>
        <p className="mt-1 truncate text-xs text-slate-500">
          {event.date} • {event.type}
        </p>
      </div>
      <ArrowRight size={16} className="text-slate-400 group-hover:text-violet-600 transition-colors" />
    </article>
  );
}

function MiniProjectCard({ project }) {
  const navigate = useNavigate();
  const projectRoute = `/user/${localStorage.getItem("username")}/open-source/${project.id}`;

  return (
    <article
      key={project.id}
      onClick={() => navigate(projectRoute)}
      className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 transition hover:border-violet-200 hover:shadow-lg cursor-pointer"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
        <Code2 size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold text-slate-900 group-hover:text-blue-600">{project.title}</h3>
        <p className="mt-1 truncate text-xs text-slate-500">{project.skills?.slice(0, 2).join(" • ")}</p>
      </div>
      <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
    </article>
  );
}

function EventsSection({ events, loading }) {
  if (loading) {
    return <section className={`${panel} p-6 animate-pulse bg-slate-100 min-h-[300px]`} />;
  }

  return (
    <section className={`${panel} p-6`}>
      <SectionHeader
        title="Trending Events"
        subtitle="Hackathons, workshops, and meetups picked for you"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events?.length > 0 ? (
          events.map((event) => (
            <MiniEventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="col-span-3 py-10 text-center text-slate-500">No trending events found.</div>
        )}
      </div>
    </section>
  );
}

function RecommendedProjectsSection({ projects, loading }) {
  if (loading) {
    return <section className={`${panel} p-6 animate-pulse bg-slate-100 min-h-[300px]`} />;
  }
  return (
    <section className={`${panel} p-6`}>
      <SectionHeader title="Recommended Projects" subtitle="Teams looking for contributors" action="See more" />
      <div className="space-y-3">
        {projects?.length > 0 ? (
          projects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-slate-100 bg-white/80 p-4 transition hover:border-violet-100 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-slate-900">{project.title}</h3>
              <span className="shrink-0 rounded-full bg-violet-100 px-2 py-1 text-[10px] font-bold text-violet-700">
                {project.need}
              </span>
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500"
                >
                  {skill}
                </span>
              ))}
            </div>
          </article>
          ))
        ) : (
          <div className="py-10 text-center text-slate-500">No recommended projects found.</div>
        )}
      </div>
    </section>
  );
}

function SavedItemsSection() {
  // SavedItemsSection is now a dedicated page, this component is no longer needed here.
  return null;
}

export default function HomePage() { 
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => { 
    fetchSuggestions();
    // fetchDashboard();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await get_connection_suggestions(3);
      setSuggestions(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await fetch_dashboard();
        setDashboard(data);
      } catch (err) {
        console.log(err);
      } finally {
        setDashboardLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      {/* Navbar and footer stay in your existing layout. */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-48 top-20 h-[560px] w-[560px] rounded-full bg-blue-300/25 blur-[130px]" />
        <div className="absolute -right-40 top-0 h-[620px] w-[620px] rounded-full bg-violet-300/30 blur-[150px]" />
        <div className="absolute left-1/3 top-[48rem] h-[500px] w-[500px] rounded-full bg-indigo-200/30 blur-[140px]" />
      </div>
      <main className="relative z-10 mx-auto w-full max-w-[1400px] space-y-7 px-4 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <WelcomeCard dashboard={dashboard} loading={dashboardLoading} /> 
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <section className={`${panel} p-6 lg:col-span-8`}>
            <SectionHeader
              title="Continue working"
              subtitle="Jump back into your active workspaces"
              action="All projects"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard?.workspaces?.length > 0 ? (
                dashboard.workspaces.map((workspace) => ( 
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))
              ) : (
                <div className="col-span-2 py-10 text-center text-slate-500">
                  No active workspaces.
                </div>
              )}
            </div>
          </section>
          <ConnectionsCard
            suggestions={suggestions}
            refreshSuggestions={fetchSuggestions}
          />
        </div>
        {/* SavedItemsSection is now a dedicated page */}
        <EventsSection events={dashboard?.trending_events} loading={dashboardLoading} />
        <RecommendedProjectsSection projects={dashboard?.recommended_projects} loading={dashboardLoading} />
        
        </main>
    </div>
  );
}

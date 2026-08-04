import {
  ArrowRight,
  Brain,
  CalendarDays,
  Code2,
  GitCommitHorizontal,
  MoreHorizontal,
  Rocket,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  get_connection_suggestions,
  add_network_request,
} from "../../../api/networks_api";

import { fetch_dashboard } from "../../../api/dashboard_apis";

const DATA = {
  user: { name: "Alex", status: "System online Â· session active" },
  briefings: [
    {
      text: "Project Nebula needs your review on 2 PRs before staging.",
      color: "bg-amber-400",
    },
    {
      text: "Sarah K. sent 3 messages in Design Team chat.",
      color: "bg-blue-400",
    },
  ],
  workspaces: [
    {
      title: "Project Nebula",
      type: "Frontend",
      progress: 68,
      icon: Rocket,
      iconClass: "bg-orange-50 text-orange-500",
      members: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
      ],
    },
    {
      title: "API Gateway",
      type: "Backend",
      progress: 32,
      icon: Code2,
      iconClass: "bg-blue-50 text-blue-500",
      members: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=80&q=80",
      ],
    },
  ],
  events: [
    {
      type: "Hackathon",
      title: "Global AI Hack 2026",
      date: "Oct 15â€“17",
      meta: "500+ joined",
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      type: "Workshop",
      title: "Advanced React Patterns",
      date: "Oct 18 Â· 2 PM",
      meta: "Online",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      type: "Meetup",
      title: "Design Systems Deep Dive",
      date: "Oct 20 Â· 6 PM",
      meta: "Tech Hub",
      gradient: "from-orange-500 to-rose-500",
    },
  ],
  communities: [
    {
      name: "Google Developer Groups",
      initials: "GDG",
      members: "1.2k",
      discussions: 24,
      color: "bg-blue-50 text-blue-600",
    },
    {
      name: "AWS Cloud Club",
      initials: "AWS",
      members: "850",
      discussions: 3,
      color: "bg-amber-50 text-amber-600",
    },
  ],
  projects: [
    {
      title: "Campus Exchange App",
      description:
        "A marketplace for students to trade textbooks and electronics locally.",
      need: "Needs Frontend",
      skills: ["React Native", "Firebase"],
    },
    {
      title: "ML Study Buddy",
      description: "AI-powered flashcard generator using course syllabi.",
      need: "Needs UI/UX",
      skills: ["Python", "Figma"],
    },
  ],
  activity: [
    {
      person: "David Chen",
      action: "pushed 3 commits to",
      target: "api-gateway",
      time: "5 min ago",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80",
    },
    {
      person: "Sarah K.",
      action: "updated the design specs for",
      target: "Dashboard UI",
      time: "42 min ago",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9ce2d?auto=format&fit=crop&w=80&q=80",
    },
    {
      person: "Computer Science Club",
      action: "announced a new event:",
      target: "Tech Talk: AI in 2026",
      time: "3 hr ago",
      icon: Rocket,
    },
    {
      person: "Alex",
      action: "accepted your collaboration",
      target: "request",
      time: "3 hr ago",
      icon: Sparkles,
    },
  ],
};

const panel =
  "rounded-3xl border border-white/70 bg-white/75 shadow-[0_12px_40px_rgba(76,29,149,0.08)] backdrop-blur-xl";

function SectionHeader({ title, subtitle, action = "View all" }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-bold text-violet-600 transition hover:bg-violet-50">
        {action}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function AvatarStack({ members }) {
  return (
    <div className="flex -space-x-2">
      {members.map((src) => (
        <img
          key={src}
          src={src}
          alt="Team member"
          className="h-7 w-7 rounded-full border-2 border-white object-cover"
        />
      ))}
      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500">
        +3
      </span>
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

  const welcome = dashboard.welcome;

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
          {welcome.hero_message}
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

function BriefingCard() {
  return (
    <section className={`${panel} relative overflow-hidden p-5 lg:col-span-3`}>
      <Brain
        size={70}
        className="absolute -right-2 -top-2 text-violet-100"
        fill="currentColor"
      />
      <div className="relative">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles size={17} className="text-violet-600" />
          AI daily briefing
        </h2>
        <div className="space-y-3">
          {DATA.briefings.map(({ text, color }) => (
            <div
              key={text}
              className="rounded-xl border border-violet-100 bg-white/80 p-3 shadow-sm"
            >
              <p className="flex gap-2 text-sm leading-5 text-slate-700">
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${color}`}
                />
                {text}
              </p>
            </div>
          ))}
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-bold text-violet-600 hover:text-violet-800">
          Full briefing <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

function ActivityCard() {
  const heatmap = [
    0, 1, 0, 2, 4, 0, 0, 1, 3, 0, 1, 2, 1, 0, 2, 4, 1, 0, 3, 2, 1,
  ];
  const colors = [
    "bg-slate-100",
    "bg-lime-200",
    "bg-lime-400",
    "bg-emerald-500",
    "bg-emerald-800",
  ];
  return (
    <section
      className={`${panel} flex min-h-[244px] flex-col justify-between p-5 lg:col-span-3`}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Code2 size={14} />
          Dev activity
        </p>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
          Connected
        </span>
      </div>
      <div>
        <p className="text-4xl font-black text-slate-950">128</p>
        <p className="text-sm text-slate-500">Contributions this month</p>
      </div>
      <div className="grid w-fit grid-cols-7 gap-1">
        {heatmap.map((level, index) => (
          <span key={index} className={`h-3 w-3 rounded-sm ${colors[level]}`} />
        ))}
      </div>
      <p className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <GitCommitHorizontal size={14} className="text-slate-400" />
        <span className="truncate">fix: user auth middleware</span>
        <span className="ml-auto text-slate-400">2h ago</span>
      </p>
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
            // className={`grid h-11 w-11 place-items-center rounded-xl ${workspace.iconClass}`}
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
        <MoreHorizontal
          className="text-slate-300 group-hover:text-violet-500"
          size={20}
        />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span className="text-slate-500">Sprint progress</span>
          <span className="text-violet-600">{workspace.progress}%</span>
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
          {workspace.members} Members
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

function EventsSection() {
  return (
    <section className={`${panel} p-6`}>
      <SectionHeader
        title="Trending events"
        subtitle="Hackathons, workshops, and meetups picked for you"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {DATA.events.map((event) => (
          <article
            key={event.title}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-28 flex-col justify-between bg-gradient-to-br ${event.gradient} p-4`}
            >
              <span className="w-fit rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                {event.type}
              </span>
              <h3 className="text-lg font-bold text-white">{event.title}</h3>
            </div>
            <div className="p-4">
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={14} />
                {event.date}
                <span className="ml-auto">{event.meta}</span>
              </p>
              <button className="mt-4 w-full rounded-xl bg-violet-50 py-2.5 text-sm font-bold text-violet-600 transition hover:bg-violet-600 hover:text-white">
                Register now
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommunitiesSection() {
  return (
    <section className={`${panel} p-6`}>
      <SectionHeader
        title="Your communities"
        subtitle="Spaces you are active in"
        action="Browse"
      />
      <div className="space-y-3">
        {DATA.communities.map((community) => (
          <article
            key={community.name}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 p-4 transition hover:border-violet-100 hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl text-xs font-black ${community.color}`}
              >
                {community.initials}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{community.name}</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  <span className="font-bold text-emerald-600">
                    {community.discussions}
                  </span>{" "}
                  active discussions
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">{community.members}</p>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                members
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecommendedProjectsSection() {
  return (
    <section className={`${panel} p-6`}>
      <SectionHeader
        title="Recommended projects"
        subtitle="Teams looking for contributors"
        action="See more"
      />
      <div className="space-y-3">
        {DATA.projects.map((project) => (
          <article
            key={project.title}
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
        ))}
      </div>
    </section>
  );
}

function ActivityFeed() {
  return (
    <section className={`${panel} p-6`}>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
          Live activity network
        </h2>
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-emerald-600">Real-time</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {DATA.activity.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={`${item.person}-${item.target}`}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 p-4"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.person}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600">
                  <Icon size={17} />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-xs leading-4 text-slate-600">
                  <strong className="text-slate-900">{item.person}</strong>{" "}
                  {item.action}{" "}
                  <strong className="text-violet-600">{item.target}</strong>
                </p>
                <p className="mt-1 text-[10px] text-slate-400">{item.time}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
    fetchDashboard();
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

  const fetchDashboard = async () => {
    try {
      const data = await fetch_dashboard();
      setDashboard(data);
    } catch (err) {
      console.log(err);
    } finally {
      setDashboardLoading(false);
    }
  };

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
          <BriefingCard />
          <ActivityCard />
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <section className={`${panel} p-6 lg:col-span-8`}>
            <SectionHeader
              title="Continue working"
              subtitle="Jump back into your active workspaces"
              action="All projects"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {dashboard?.workspaces?.length ? (
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
        <EventsSection />
        <div className="grid gap-6 lg:grid-cols-2">
          <CommunitiesSection />
          <RecommendedProjectsSection />
        </div>
        <ActivityFeed />
      </main>
    </div>
  );
}

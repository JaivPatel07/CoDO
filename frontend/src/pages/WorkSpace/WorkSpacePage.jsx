import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Settings, Plus, MessageSquare, Users, GitPullRequest, GitCommit,
  AlertCircle, Send, CheckCircle2, Circle, BarChart3, ListTodo, Crown
} from 'lucide-react';
import { FaGithub as Github } from "react-icons/fa";
import { get_team_member } from '../../api/team_apis';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contextAPI/userContext';

// --- DUMMY DATA FOR OTHER TABS ---
const TASKS = {
  todo: [
    { id: 1, title: 'Update navigation routing bug', assignee: { name: 'Sarah Chen', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=0ea5e9&color=fff' }, priority: 'High', priorityColor: 'text-red-600 bg-red-50 border-red-200' },
    { id: 2, title: 'Implement new modal design system', assignee: { name: 'Preyans Patel', avatar: 'https://ui-avatars.com/api/?name=Preyans+Patel&background=4f46e5&color=fff' }, priority: 'Medium', priorityColor: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 3, title: 'Optimize initial load times', assignee: { name: 'Alex Kumar', avatar: 'https://ui-avatars.com/api/?name=Alex+Kumar&background=f59e0b&color=fff' }, priority: 'High', priorityColor: 'text-red-600 bg-red-50 border-red-200' },
    { id: 4, title: 'Write unit tests for Sidebar', assignee: { name: 'Sarah Chen', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=0ea5e9&color=fff' }, priority: 'Low', priorityColor: 'text-blue-600 bg-blue-50 border-blue-200' },
  ],
  completed: [
    { id: 5, title: 'Setup GitHub integration', assignee: { name: 'Preyans Patel', avatar: 'https://ui-avatars.com/api/?name=Preyans+Patel&background=4f46e5&color=fff' } },
    { id: 6, title: 'Design system token export', assignee: { name: 'Emily Davis', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff' } },
    { id: 7, title: 'Dark mode toggle implementation', assignee: { name: 'Alex Kumar', avatar: 'https://ui-avatars.com/api/?name=Alex+Kumar&background=f59e0b&color=fff' } },
  ]
};

const CONTRIBUTIONS = [
  { user: { name: 'Preyans Patel', avatar: 'https://ui-avatars.com/api/?name=Preyans+Patel&background=4f46e5&color=fff' }, commits: 145, prs: 12, color: 'bg-indigo-500' },
  { user: { name: 'Sarah Chen', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=0ea5e9&color=fff' }, commits: 112, prs: 18, color: 'bg-sky-500' },
  { user: { name: 'Alex Kumar', avatar: 'https://ui-avatars.com/api/?name=Alex+Kumar&background=f59e0b&color=fff' }, commits: 85, prs: 5, color: 'bg-amber-500' },
  { user: { name: 'Emily Davis', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff' }, commits: 34, prs: 1, color: 'bg-pink-500' },
];

const RECENT_PRS = [
  { title: 'Feature: Workspace Sidebar UI', author: 'Preyans', status: 'Open', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { title: 'Fix: Navigation routing bug', author: 'Sarah', status: 'Merged', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { title: 'Update: Dependency bump', author: 'Dependabot', status: 'Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

// --- COMPONENTS ---

// 1. Tasks Tab
const TabTasks = () => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
        <Circle size={16} className="text-orange-500" /> Tasks to Complete ({TASKS.todo.length})
      </h3>
      <div className="space-y-3">
        {TASKS.todo.map((task) => (
          <div key={task.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-300 transition-all cursor-pointer flex gap-3">
            <Circle size={18} className="text-slate-300 shrink-0 mt-0.5 hover:text-indigo-500 transition-colors" />
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-xs mb-2">{task.title}</h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <img src={task.assignee.avatar} alt="assignee" className="w-5 h-5 rounded-full" />
                  <span className="text-[10px] font-semibold text-slate-500">{task.assignee.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${task.priorityColor}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-white border border-slate-200 rounded-2xl p-5 opacity-80">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
        <CheckCircle2 size={16} className="text-emerald-500" /> Completed Tasks ({TASKS.completed.length})
      </h3>
      <div className="space-y-3">
        {TASKS.completed.map((task) => (
          <div key={task.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex gap-3">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-slate-500 line-through text-xs mb-2">{task.title}</h4>
              <div className="flex items-center gap-1.5">
                <img src={task.assignee.avatar} alt="assignee" className="w-5 h-5 rounded-full grayscale" />
                <span className="text-[10px] font-semibold text-slate-400">{task.assignee.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// 2. Contributions Tab
const TabContributions = () => {
  const maxCommits = Math.max(...CONTRIBUTIONS.map(c => c.commits));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BarChart3 size={16} className="text-indigo-600" /> Team Contribution History
        </h3>
        <div className="space-y-5 px-2">
          {CONTRIBUTIONS.map((stat) => (
            <div key={stat.user.name} className="flex items-center gap-4 group">
              <div className="relative shrink-0">
                <img src={stat.user.avatar} alt={stat.user.name} className="w-9 h-9 rounded-full shadow-sm" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="font-bold text-xs text-slate-800">{stat.user.name}</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {stat.commits} commits • {stat.prs} PRs
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stat.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${(stat.commits / maxCommits) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <GitPullRequest size={16} className="text-emerald-600" /> Recent Pull Requests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENT_PRS.map((pr, i) => (
            <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between h-24">
              <div>
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{pr.title}</h4>
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider shrink-0 ${pr.color}`}>
                    {pr.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <GitCommit size={12} className="text-slate-400" />
                <span className="text-[10px] text-slate-500 font-semibold">By {pr.author}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const TabChat = ({ leader, member }) => {
  const membersList = Array.isArray(member) ? member : [];
  const totalMembers = (leader ? 1 : 0) + membersList.length;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const { userData } = useContext(UserContext)

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchMessages = async () => {
    // Replace this with your API call
    // const res = await get_group_messages(teamId);

    const data = [
      {
        id: 1,
        messanger_username: "rahul",
        messanger_fullname: "Rahul Patel",
        message: "Hey everyone 👋",
        message_at: "2026-08-03T10:20:00",
      },
      {
        id: 2,
        messanger_username: "user1",
        messanger_fullname: "Preyans Patel",
        message: "Hi Rahul!",
        message_at: "2026-08-03T10:21:00",
      },
      {
        id: 3,
        messanger_username: "rahul",
        messanger_fullname: "Rahul Patel",
        message: "Let's complete today's task.",
        message_at: "2026-08-03T10:22:00",
      },
    ];

    setMessages(data);

    // if(res.status===200){
    //     setMessages(res.data)
    // }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      messanger_username: userData.username,
      messanger_fullname: "You",
      message: input,
      message_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    setInput("");

    // Later:
    // await sendMessage(...)
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">

      {/* Chat */}

      <div className="flex-[3] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}

        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">

          <div>
            <h2 className="font-bold flex items-center gap-2 text-slate-900">
              <MessageSquare
                size={18}
                className="text-indigo-600"
              />
              Team Chat
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Discuss tasks with your teammates
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
            {totalMembers} Members
          </span>

        </div>

        {/* Messages */}

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">

          <div className="space-y-5">

            {messages.map((msg) => {
              const isMe = msg.messanger_username === userData.username;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[75%] ${isMe ? "flex-row-reverse" : ""
                      }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-700"
                        }`}
                    >
                      {msg.messanger_fullname
                        ?.split(" ")
                        .map((i) => i[0])
                        .join("")
                        .substring(0, 2)}
                    </div>

                    {/* Message */}
                    <div
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">
                          {isMe ? "You" : msg.messanger_fullname}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.message_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div
                        className={`px-4 py-3 rounded-2xl max-w-md break-words ${isMe
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                          }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef}></div>

          </div>

        </div>

        {/* Input */}

        <div className="border-t border-slate-200 bg-white p-4">

          <div className="flex items-end gap-3">

            <textarea
              rows={1}
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center gap-2 font-semibold"
            >
              <Send size={16} />
              Send
            </button>

          </div>

        </div>

      </div>

      {/* Members */}

      <div className="flex-[1] bg-white border border-slate-200 rounded-2xl shadow-sm hidden lg:flex flex-col">

        <div className="p-4 border-b">
          <h3 className="font-semibold flex gap-2 items-center">
            <Users size={16} />
            Members
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {leader && (
            <div className="flex gap-3 items-center p-3 rounded-xl bg-indigo-50 border border-indigo-100">

              <div className="relative">

                <img
                  src={
                    leader.leader_pic_url ||
                    `https://ui-avatars.com/api/?name=${leader.leader_name}`
                  }
                  className="w-10 h-10 rounded-full"
                  alt=""
                />

                <span className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1 text-white">
                  <Crown size={10} />
                </span>

              </div>

              <div>

                <h4 className="font-semibold text-xs">
                  {leader.leader_name}
                </h4>

                <p className="text-[10px] text-indigo-600">
                  Leader
                </p>

              </div>

            </div>
          )}

          {membersList.map((m, index) => (
            <div
              key={index}
              className="flex gap-3 items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50"
            >

              <img
                src={
                  m.member_pic_url ||
                  `https://ui-avatars.com/api/?name=${m.member_name}`
                }
                className="w-10 h-10 rounded-full"
                alt=""
              />

              <div>

                <h4 className="font-semibold text-xs">
                  {m.member_name}
                </h4>

                <p className="text-[10px] text-slate-500">
                  {m.role || "Member"}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function WorkSpacePage() {
  const { team_id } = useParams()

  const [activeTab, setActiveTab] = useState('Tasks');
  const [grpLeader, setGrpLeader] = useState(null)
  const [grpMember, setGrpMember] = useState([])

  useEffect(() => {
    const fetch_members = async () => {
      try {
        const response = await get_team_member(team_id)
        console.log(response.data)
        // Assuming response.data[0] is the leader object, and response.data[1] is the members array
        setGrpLeader(response.data[0])
        setGrpMember(response.data[1])
      }
      catch (err) {
        console.log(err?.response)
      }
    }

    fetch_members()
  }, [team_id])

  const TabIcon = {
    Tasks: ListTodo,
    Contributions: BarChart3,
    'Group Chat': MessageSquare
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-2">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 mb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                FA
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-slate-900 leading-none tracking-tight">Frontend Architecture</h1>
                <span className="text-[10px] font-semibold text-slate-500">Public Workspace</span>
              </div>
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/50 overflow-x-auto hide-scrollbar">
              {['Tasks', 'Contributions', 'Group Chat'].map(tab => {
                const Icon = TabIcon[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all whitespace-nowrap ${isActive
                        ? 'text-indigo-700 bg-white shadow-sm border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
                      }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    {tab}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all">
                <Plus size={14} />
                <span className="hidden sm:inline">Invite</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
        {activeTab === 'Tasks' && <TabTasks />}
        {activeTab === 'Contributions' && <TabContributions />}
        {activeTab === 'Group Chat' && <TabChat leader={grpLeader} member={grpMember} />}
      </main>

    </div>
  );
}
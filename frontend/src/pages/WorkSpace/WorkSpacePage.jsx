import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Plus, MessageSquare, Users, GitPullRequest, GitCommit,
  AlertCircle, Send, CheckCircle2, Crown, XCircle, Loader2, RefreshCw
} from 'lucide-react';
import { FaGithub as Github } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Adjust these imports based on your actual file structure
import { UserContext } from '../../contextAPI/userContext';
import { get_team_member } from '../../api/team_apis';
import { delete_grp_message, get_grp_message, connect_workspace_repo, get_repo_issues, get_repo_commits, get_repo_pulls, get_workspace_repo } from '../../api/workspace_apis';

// --- TOAST NOTIFICATION COMPONENT ---
const Toast = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold text-white ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
        {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        {message}
      </div>
    </div>
  );
};

// --- TAB: CHAT ---
const TabChat = ({ leader, member, team_id, workspace_id, showToast }) => {
  const membersList = Array.isArray(member) ? member : [];
  const totalMembers = (leader ? 1 : 0) + membersList.length;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [menuMessage, setMenuMessage] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const bottomRef = useRef(null);
  const { userData } = useContext(UserContext) || { userData: { username: "Guest" } };
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await get_grp_message(team_id);
        setMessages(response.data);
      } catch (err) {
        console.log("Error fetching messages:", err?.response);
        showToast("Error loading chat messages", "error");
      }
    };
    fetchMessages();
  }, [team_id]);

  useEffect(() => {
    if (!workspace_id) return;
    try {
      const socket = new WebSocket(`ws://127.0.0.1:8000/ws/workshop_${workspace_id}/`);
      socketRef.current = socket;
      socket.onopen = () => console.log("Connected to workspace chat");
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "grp_message" || data.message) setMessages(prev => [...prev, data]);
        if (data.type === "delete_message") setMessages(prev => prev.filter(msg => msg.id !== data.message_id));
      };
      socket.onclose = () => console.log("Disconnected from workspace chat");
      return () => socket.close();
    } catch (err) {
      console.log("Socket connection failed", err);
    }
  }, [workspace_id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    try {
      socketRef.current.send(JSON.stringify({
        action: "send_message",
        team_id: team_id,
        message: input,
        messanger_user: userData.username
      }));
      setInput("");
    } catch (err) {
      showToast("Failed to send message", "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDoubleClick = (e, msg) => {
    e.preventDefault();
    setMenuMessage(msg);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuMessage(null);

  const handleDeleteForMe = async (messageId) => {
    try {
      await delete_grp_message(messageId, "me");
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      closeMenu();
      showToast("Message deleted for you", "success");
    } catch (err) {
      showToast("Failed to delete message", "error");
    }
  };

  const handleDeleteForEveryone = async (messageId) => {
    try {
      await delete_grp_message(messageId, "everyone");
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      closeMenu();
      showToast("Message deleted for everyone", "success");
    } catch (err) {
      showToast("Failed to delete message", "error");
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
      {menuMessage && (
        <>
          <div className="fixed inset-0 z-40 cursor-default" onClick={closeMenu}></div>
          <div className="fixed z-50 bg-white border border-slate-200 shadow-xl rounded-xl py-2 w-48 text-sm animate-in fade-in zoom-in-95 duration-100" style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px`, transform: 'translate(-50%, -100%)', marginTop: '-10px' }}>
            <button onClick={() => handleDeleteForMe(menuMessage.id)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2">
              <XCircle size={14} className="text-slate-400" /> Delete for me
            </button>
            {menuMessage.messanger_username === userData.username && (
              <button onClick={() => handleDeleteForEveryone(menuMessage.id)} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2">
                <XCircle size={14} className="text-red-500" /> Delete for everyone
              </button>
            )}
          </div>
        </>
      )}

      {/* Chat Area */}
      <div className="flex-[3] bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="font-bold flex items-center gap-2 text-slate-900">
              <MessageSquare size={18} className="text-indigo-600" />
              Team Chat
            </h2>
            <p className="text-xs text-slate-500 mt-1">Discuss tasks with your teammates</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
            {totalMembers} Members
          </span>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div className="space-y-5">
            {messages.map((msg) => {
              const isMe = msg.messanger_username === userData.username;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[75%] ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {msg.messanger_fullname?.split(" ").map((i) => i[0]).join("").substring(0, 2).toUpperCase() || "?"}
                    </div>
                    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-700">{isMe ? "You" : msg.messanger_fullname}</span>
                        <span className="text-[10px] text-slate-400">{msg.message_at ? new Date(msg.message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                      </div>
                      <div onDoubleClick={(e) => handleDoubleClick(e, msg)} className={`px-4 py-3 rounded-2xl max-w-md break-words cursor-pointer select-none transition-transform active:scale-[0.98] ${isMe ? "bg-indigo-600 text-white rounded-br-sm shadow-sm" : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"}`} title="Double-click for options">
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

        <div className="border-t border-slate-200 bg-white p-4 z-10">
          <div className="flex items-end gap-3">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className="h-[46px] px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center gap-2 font-semibold transition-colors shadow-sm"
            >
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="flex-[1] bg-white border border-slate-200 rounded-2xl shadow-sm hidden lg:flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h3 className="font-semibold flex gap-2 items-center text-slate-800">
            <Users size={16} className="text-indigo-600" /> Members
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {leader && (
            <div className="flex gap-3 items-center p-3 rounded-xl bg-indigo-50 border border-indigo-100">
              <div className="relative shrink-0">
                <img src={leader.leader_pic_url || `https://ui-avatars.com/api/?name=${leader.leader_name}&background=4f46e5&color=fff`} className="w-10 h-10 rounded-full shadow-sm" alt="" />
                <span className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-1 text-white border-2 border-white"><Crown size={10} /></span>
              </div>
              <div className="truncate">
                <h4 className="font-semibold text-xs text-slate-900 truncate">{leader.leader_name}</h4>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Leader</p>
              </div>
            </div>
          )}
          {membersList.map((m, index) => (
            <div key={index} className="flex gap-3 items-center p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
              <img src={m.member_pic_url || `https://ui-avatars.com/api/?name=${m.member_name}&background=f1f5f9&color=475569`} className="w-10 h-10 rounded-full shrink-0" alt="" />
              <div className="truncate">
                <h4 className="font-semibold text-xs text-slate-800 truncate">{m.member_name}</h4>
                <p className="text-[10px] text-slate-500 font-medium truncate">{m.role || "Member"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- TAB: OVERVIEW ---
const WorkspaceOverview = ({ leader, members, repo, onConnectRepo }) => {
  const MemberCard = ({ user, leaderCard }) => {
    const name = leaderCard ? user?.leader_name : user?.member_name;
    const pic = leaderCard ? user?.leader_pic_url : user?.member_pic_url;
    const github = user?.is_git_connected;

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <img src={pic || `https://ui-avatars.com/api/?name=${name}`} alt={name} className="w-12 h-12 rounded-full shadow-sm" />
          <div>
            <h3 className="font-bold text-slate-900">{name}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{leaderCard ? "Workspace Leader" : "Team Member"}</p>
          </div>
        </div>
        {github ? (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] uppercase font-bold tracking-wider">Git Connected</span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200 text-[10px] uppercase font-bold tracking-wider">No Git</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-lg flex items-center gap-2 text-slate-800"><Github className="text-slate-700"/> Repository Integration</h2>
        </div>
        <div className="p-6">
          {repo ? (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-extrabold text-2xl text-slate-900 tracking-tight">{repo.repo_name}</h2>
                  <p className="text-slate-500 font-medium mt-1">Owned by <span className="text-indigo-600">{repo.owner}</span></p>
                </div>
                <a href={repo.url} target="_blank" rel="noreferrer" className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2">
                  <Github /> View on GitHub
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Owner</p>
                  <h4 className="font-bold text-slate-800">{repo.owner}</h4>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Visibility</p>
                  <h4 className="font-bold text-slate-800 capitalize">{repo.private ? "Private" : "Public"}</h4>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Default Branch</p>
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <GitPullRequest size={14} className="text-indigo-500"/> {repo.default_branch}
                  </h4>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mx-auto mb-5">
                <Github size={36} className="text-slate-400" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800">No Repository Connected</h2>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">Track commits, pull requests, and manage issues directly from your workspace by linking a GitHub repository.</p>
              <button onClick={onConnectRepo} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5">
                Connect a Repository
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600"/> Team Members
          </h2>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-5">
          {leader && <MemberCard user={leader} leaderCard={true} />}
          {members.map((m, index) => (
            <MemberCard key={index} user={m} />
          ))}
        </div>
      </section>
    </div>
  );
};

// --- CONNECT REPO MODAL ---
const ConnectRepositoryModal = ({ open, onClose, onConnected, workspaceId, showToast }) => {
  const [repoName, setRepoName] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [createIfMissing, setCreateIfMissing] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConnect = async () => {
    if (!repoName.trim()) { showToast("Repository name required", "error"); return; }
    try {
      setLoading(true);
      const response = await connect_workspace_repo({
        workspace_id: workspaceId,
        repo_name: repoName,
        private: visibility === "private",
        create_if_missing: createIfMissing
      });
      showToast("Repository connected successfully", "success");
      onConnected(response.data.repository);
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.log || "Failed to connect repository", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Connect Repository</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">Link an existing repo or create a new one.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition"><XCircle size={20}/></button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Repository Name</label>
            <input
              value={repoName} onChange={(e) => setRepoName(e.target.value)}
              placeholder="e.g. frontend-architecture"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Visibility</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setVisibility("public")} className={`border rounded-xl py-3 transition font-bold flex items-center justify-center gap-2 ${visibility === "public" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                🌍 Public
              </button>
              <button onClick={() => setVisibility("private")} className={`border rounded-xl py-3 transition font-bold flex items-center justify-center gap-2 ${visibility === "private" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                🔒 Private
              </button>
            </div>
          </div>
          <label className="flex gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input type="checkbox" checked={createIfMissing} onChange={(e) => setCreateIfMissing(e.target.checked)} className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
            <div>
              <p className="font-bold text-slate-800 text-sm">Create if it doesn't exist</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Will automatically create a new repo on GitHub if no exact match is found.</p>
            </div>
          </label>
        </div>

        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
          <button disabled={loading} onClick={handleConnect} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 disabled:opacity-50 flex items-center gap-2 transition">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Connecting..." : "Connect Repository"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TAB: DEVELOPMENT ---
const Card = ({ icon, title, value, colorClass, bgClass }) => (
  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
    {/* Decorative background circle */}
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${colorClass} blur-2xl group-hover:opacity-40 transition-opacity`}></div>
    
    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-sm font-bold text-slate-500 mb-1">{title}</p>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h2>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgClass} ${colorClass} shadow-inner`}>
        {icon}
      </div>
    </div>
  </div>
);

const TabDevelopment = ({ repoStats, contributors, commits, pullRequests, issues, loading, fetchGithubData }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-5 animate-in fade-in duration-500">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Syncing Workspace</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Fetching latest commits, issues, and PRs...</p>
        </div>
      </div>
    );
  }

  const maxCommits = contributors && contributors.length > 0
    ? Math.max(...contributors.map(c => c.contributions))
    : 1;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Github size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Development Hub</h2>
            <p className="text-xs font-medium text-slate-500">Track your team's code activity</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchGithubData}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 font-bold text-sm transition-colors shadow-sm"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={() => { /* Add issue creation handler here */ }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 font-bold text-sm transition shadow-md shadow-indigo-200 transform hover:-translate-y-0.5"
          >
            <Plus size={16} /> Create Issue
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <Card icon={<GitCommit size={24} />} title="Total Commits" value={repoStats.commits} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        <Card icon={<GitPullRequest size={24} />} title="Pull Requests" value={repoStats.pulls} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
        <Card icon={<AlertCircle size={24} />} title="Open Issues" value={repoStats.issues} colorClass="text-rose-600" bgClass="bg-rose-50" />
        <Card icon={<Users size={24} />} title="Contributors" value={repoStats.contributors} colorClass="text-amber-600" bgClass="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Contribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Team Contributions</h2>
          </div>
          <div className="p-6 flex-1">
            {contributors && contributors.length > 0 ? (
              <div className="space-y-6">
                {contributors.map((user, index) => {
                  const percentage = (user.contributions / maxCommits) * 100;
                  return (
                    <div key={index} className="flex flex-col group">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                          <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=f1f5f9`} alt={user.username} className="w-6 h-6 rounded-full" />
                          <h3 className="font-bold text-sm text-slate-800">{user.username}</h3>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{user.contributions} commits</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2.5 w-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 relative"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        >
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
                <Users size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">No contribution data available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Open Issues Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 p-5 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-800">Open Issues</h2>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-lg">{issues.length} Open</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[420px] custom-scrollbar">
            {issues && issues.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {issues.map((issue, index) => {
                  const creatorName = issue?.user || "unknown";
                  const avatarUrl = issue.user?.avatar_url || `https://ui-avatars.com/api/?name=${creatorName}&background=f1f5f9`;
                  
                  return (
                    <div key={index} className="p-5 hover:bg-slate-50/80 transition-colors flex gap-4 group">
                      <img src={avatarUrl} alt={creatorName} className="w-9 h-9 rounded-full shadow-sm border border-slate-200" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {issue.title}
                          </h3>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-1">
                          <span className="text-slate-400">#{issue.number}</span> opened by <span className="font-bold text-slate-700">{creatorName}</span>
                        </p>
                        
                        {issue.labels && issue.labels.length > 0 && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {issue.labels.map(label => {
                              const labelName = typeof label === 'string' ? label : label.name;
                              return (
                                <span key={labelName} className="px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 border border-slate-200 uppercase tracking-wide">
                                  {labelName}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-slate-400">
                <CheckCircle2 size={48} className="mb-4 text-emerald-400 opacity-50" />
                <h3 className="font-bold text-slate-700 mb-1">All caught up!</h3>
                <p className="text-sm font-medium">There are no open issues right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {(!commits || commits.length === 0) && (
        <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitCommit size={36} className="text-indigo-300" />
          </div>
          <h2 className="font-extrabold text-xl text-slate-800">No commits found</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">Commit history will appear here once code is pushed.</p>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function WorkSpacePage() {
  const { team_id } = useParams();
  const location = useLocation();
  const receiver = location.state?.receiver;
  const navigate = useNavigate();

  if (!receiver) {
    navigate(-1);
  }

  const [activeTab, setActiveTab] = useState("Overview");
  const [grpLeader, setGrpLeader] = useState(null);
  const [grpMember, setGrpMember] = useState([]);
  const [WorkSpaceID, setWorkSpaceID] = useState(receiver);
  
  const [repo, setRepo] = useState(null);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Github states required for Development tab
  const [repoStats, setRepoStats] = useState({ commits: 0, pulls: 0, issues: 0, contributors: 0 });
  const [contributors, setContributors] = useState([]);
  const [commits, setCommits] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [issues, setIssues] = useState([]);
  const [githubLoading, setGithubLoading] = useState(false);

  const fetchGithubData = async () => {
    if (!WorkSpaceID) return;

    setGithubLoading(true);

    try {
      const [commitRes, pullRes, issueRes] = await Promise.all([
        get_repo_commits(WorkSpaceID),
        get_repo_pulls(WorkSpaceID),
        get_repo_issues(WorkSpaceID),
      ]);

      /* ---------------- Commits ---------------- */
      const commitData = Array.isArray(commitRes.data) ? commitRes.data : (commitRes.data?.commits || []);
      setCommits(commitData);

      /* ---------------- Pull Requests ---------------- */
      const pullData = Array.isArray(pullRes.data) ? pullRes.data : (pullRes.data?.pulls || []);
      setPullRequests(pullData);

      /* ---------------- Issues ---------------- */
      const issueData = Array.isArray(issueRes.data) ? issueRes.data : (issueRes.data?.issues || []);
      setIssues(issueData);

      /* ---------------- Contributors ---------------- */
      let contributorList = [];
      if (commitRes.data?.contributors && Object.keys(commitRes.data.contributors).length > 0) {
        contributorList = Object.entries(commitRes.data.contributors).map(([username, data]) => {
          // Handle case where contributors object might map to a nested object or primitive
          const contributions = typeof data === 'object' ? data.contributions : data;
          const avatar = typeof data === 'object' ? data.avatar_url : null;
          return { username, contributions, avatar };
        });
      } else if (commitData.length > 0) {
        // Fallback: manually calculate from commits if API didn't group them
        const userMap = {};
        commitData.forEach(c => {
          const author = c.author?.login || c.commit?.author?.name || c.author_name || "Unknown";
          const avatar = c.author?.avatar_url || null;
          if (!userMap[author]) userMap[author] = { username: author, contributions: 0, avatar };
          userMap[author].contributions += 1;
        });
        contributorList = Object.values(userMap);
      }

      contributorList.sort((a, b) => b.contributions - a.contributions);
      setContributors(contributorList);

      /* ---------------- Stats ---------------- */
      let actualCommitCount = commitData.length;
      if (commitRes.data?.total_commits) {
        actualCommitCount = commitRes.data.total_commits;
      } else if (contributorList.length > 0 && commitData.length === 0) {
        actualCommitCount = contributorList.reduce((acc, curr) => acc + curr.contributions, 0);
      }

      setRepoStats({
        commits: actualCommitCount,
        pulls: pullData.length,
        issues: issueData.length,
        contributors: contributorList.length,
      });

    } catch (err) {
      console.log(err?.response || err);
      showToast("Unable to fetch GitHub data", "error");
    } finally {
      setGithubLoading(false);
    }
  };
  useEffect(() => {
    const fetch_initial_repo = async () => {
      try {
        const response = await get_workspace_repo(WorkSpaceID)
        setRepo(response.data)
        console.log("sdfsf",response.data)
      }
      catch (err) {
        console.log(err?.response || err);
        showToast("Unable to fetch GitHub data", "error");
      }
    }
    fetch_initial_repo()
  },[])

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 2500);
  };

  useEffect(() => {
    const fetch_members = async () => {
      try {
        const response = await get_team_member(team_id);
        setGrpLeader(response.data[0]);
        setGrpMember(response.data[1] || []);
      } catch (err) {
        console.log(err?.response);
        showToast("Error fetching team members", "error");
      }
    };
    fetch_members();
  }, [team_id]);

  const TabIcon = { Overview: Users, Development: Github, "Group Chat": MessageSquare };

  useEffect(() => {
    if (activeTab === "Development") {
      fetchGithubData();
    }
  }, [activeTab, WorkSpaceID]);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-2 relative">
      {notification.show && <Toast message={notification.message} type={notification.type} />}

      <ConnectRepositoryModal
        open={showRepoModal}
        onClose={() => setShowRepoModal(false)}
        onConnected={(newRepo) => setRepo(newRepo)}
        workspaceId={WorkSpaceID}
        showToast={showToast}
      />

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-extrabold text-sm shadow-lg shadow-indigo-200">
                FA
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-extrabold text-slate-900 leading-tight tracking-tight">Frontend Architecture</h1>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Public Workspace</span>
              </div>
            </div>

            <div className="flex gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 overflow-x-auto hide-scrollbar">
              {['Overview', 'Development', 'Group Chat'].map(tab => {
                const Icon = TabIcon[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all whitespace-nowrap ${isActive ? 'text-indigo-700 bg-white shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'}`}
                  >
                    <Icon size={16} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => showToast("Invite link copied to clipboard", "success")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Invite Team</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 w-full pb-10">
        {activeTab === 'Overview' && (
          <WorkspaceOverview leader={grpLeader} members={grpMember} repo={repo} onConnectRepo={() => setShowRepoModal(true)} showToast={showToast} />
        )}

        {activeTab === 'Development' && (
          <TabDevelopment
            repoStats={repoStats}
            contributors={contributors}
            commits={commits}
            pullRequests={pullRequests}
            issues={issues}
            loading={githubLoading}
            fetchGithubData={fetchGithubData}
          />
        )}

        {activeTab === 'Group Chat' && (
          <TabChat leader={grpLeader} member={grpMember} team_id={team_id} workspace_id={WorkSpaceID} showToast={showToast} />
        )}
      </main>

      {/* Global styles for custom scrollbar and shimmer animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
import {
  Outlet,
  useNavigate,
  useParams,
  NavLink,
  useLocation,
} from "react-router-dom";
import { fetch_user, fetch_profile } from "../../api/user_apis";
import { retirve_notification } from "../../api/notification_apis";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "../../contextAPI/userContext";
import ProfileForm from "../../pages/User_Pages/ProfileForm/ProfileForm";
import ProfilePic from "../../components/ProfilePic";
import calculate_post_time from "../../reusable_methods/time_calculator";
import { useTheme } from "../../hooks/useTheme";
import {
  Home,
  CalendarDays,
  Users2,
  MessagesSquare,
  Bell,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  UserPlus,
  ChevronDown,
  Settings,
  SquareKanban,
  Code,
} from "lucide-react";
import Footer from "../../components/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, badge, onClick, end: isEnd = false, isCollapsed }) {
const base =
    `relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} w-full py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 cursor-pointer select-none`;
  const active =
    "bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.30)]";
  const inactive =
    "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${inactive}`} title={isCollapsed ? label : undefined}>
        <Icon size={17} strokeWidth={2} className="shrink-0 opacity-80" />
        {!isCollapsed && <span>{label}</span>}
        {!isCollapsed && badge ? (
          <span className="ml-auto flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : null}
        {isCollapsed && badge ? (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        ) : null}
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      end={isEnd}
      className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
      title={isCollapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={17}
            strokeWidth={2}
            className={`shrink-0 ${isActive ? "opacity-100" : "opacity-70"}`}
          />
          {!isCollapsed && <span className="flex-1">{label}</span>}
          {!isCollapsed && badge ? (
            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
              {badge > 99 ? "99+" : badge}
            </span>
          ) : null}
          {isCollapsed && badge ? (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          ) : null}
        </>
      )}
    </NavLink>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ userName, displayName, avatarUrl, unreadCount, onClose, mobileOpen, isCollapsed }) {
  const navigate = useNavigate();
  const {userData} = useContext(UserContext)
  const  user_name  = userData.username
  const base = `/user/${user_name}`;

  return (
    <aside className={`relative flex h-full ${isCollapsed ? 'w-[80px]' : 'w-[272px]'} shrink-0 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-[width] duration-300 ease-in-out`}>
      {/* Mobile close */}
      {mobileOpen && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3.5 z-10 p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
        >
          <X size={16} />
        </button>
      )}

      {/* ── Brand ── */}
      <div className={`pt-5 pb-4 ${isCollapsed ? 'flex justify-center px-0' : 'px-5'}`}>
        <div className="flex items-center gap-3 mb-2 justify-center">
          <img src="/coDO.svg" alt="CoDO" className="h-10 w-auto" />
          {!isCollapsed && <span className="text-xl mb-2 font-black tracking-tight text-slate-900 dark:text-slate-100 overflow-hidden whitespace-nowrap">CoDO</span>}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-3'} pb-3 space-y-0.5`}>
        {!isCollapsed ? (
          <p className="px-3.5 pt-1 pb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest overflow-hidden whitespace-nowrap">
            Main
          </p>
        ) : (
          <div className="flex justify-center py-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /></div>
        )}
        <NavItem to={base} icon={Home} label="Home" end isCollapsed={isCollapsed} />
        <NavItem to={`${base}/events`} icon={CalendarDays} label="Events" isCollapsed={isCollapsed} />
        <NavItem to={`${base}/collabrate`} icon={Users2} label="Collaborate" isCollapsed={isCollapsed} />
        <NavItem to={`${base}/chat`} icon={MessagesSquare} label="Chat" isCollapsed={isCollapsed} />
        <NavItem to={`${base}/workspaces`} icon={SquareKanban} label="WorkSpace" isCollapsed={isCollapsed} />

        <div className="mx-1 my-3 h-px bg-slate-100 dark:bg-slate-800" />

        {!isCollapsed ? (
          <p className="px-3.5 pb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest overflow-hidden whitespace-nowrap">
            Discover
          </p>
        ) : (
          <div className="flex justify-center py-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /></div>
        )}
        <NavItem to={`${base}/calendar`} icon={CalendarDays} label="Calendar" isCollapsed={isCollapsed} />
        <NavItem to={`${base}/open-source`} icon={Code} label="Open Source" isCollapsed={isCollapsed} />
        <NavItem
          to={`${base}/notification`}
          icon={Bell}
          label="Notifications"
          badge={unreadCount > 0 ? unreadCount : null}
          isCollapsed={isCollapsed}
        />
        <NavItem to={`${base}/suggestions`} icon={UserPlus} label="Network" isCollapsed={isCollapsed} />

        <div className="mx-1 my-3 h-px bg-slate-100 dark:bg-slate-800" />

        {!isCollapsed ? (
          <p className="px-3.5 pb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest overflow-hidden whitespace-nowrap">
            Account
          </p>
        ) : (
          <div className="flex justify-center py-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" /></div>
        )}
        <NavItem
          to={`/user/${user_name}/profile`}
          icon={User}
          label="My Profile"
          isCollapsed={isCollapsed}
        />
        <NavItem
          to={`/user/${user_name}/settings`}
          icon={Settings}
          label="Settings"
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* ── Footer / Logout ── */}
      <div className={`py-3 border-t border-slate-100 dark:border-slate-800 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <NavItem
          icon={LogOut}
          label="Logout"
          isCollapsed={isCollapsed}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        />
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOP NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({ pageTitle, userName, displayName, avatarUrl, notifications, unreadCount, onMenuClick, onToggleCollapse, theme, setTheme, appliedTheme, onBellOpen }) {
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const bellRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();
  const { user_name: user_name_param } = useParams();
  // Prefer the explicit prop (works even when this layout wraps non-/user routes)
  const safeUserName = userName || user_name_param;

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target))
        setBellOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target))
        setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getNotifLink = (notif) => {
    const type = notif.notification_type?.toLowerCase();
    if (type === "team join" || type === "team request")
      return `/user/${userName}/managepost/${notif.event_id}`;
    return `/user/${notif.senderusername}/profile`;
  };

  const recentNotifs = notifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-40 flex h-[68px] w-full items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 sm:px-7">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) onMenuClick();
            else onToggleCollapse();
          }}
          className="-ml-1 p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <Menu size={19} />
        </button>
        <div>
          <h1 className="text-[17px] font-bold text-slate-900 dark:text-slate-100 leading-none tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-none">
            CoDO Student
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">

        {/* Bell */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Notifications"
          >
            <Bell size={17} strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[320px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                  <button
                    onClick={() => {
                      navigate(`/user/${safeUserName}/notification`);
                      setBellOpen(false);
                    }}
                    className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
                  >
                    See all
                  </button>
                </div>
              </div>

              <div className="max-h-[320px] overflow-y-auto">
                {recentNotifs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-2">
                      <Bell size={18} className="text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">You're all caught up!</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">No new notifications.</p>
                  </div>
                ) : (
                  <div className="py-1.5 space-y-0.5 px-1.5">
                    {recentNotifs.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          navigate(getNotifLink(notif));
                          setBellOpen(false);
                        }}
                        className={`flex gap-3 w-full p-2.5 rounded-xl text-left transition-colors ${!notif.is_read
                          ? "bg-violet-50/60 dark:bg-violet-900/20 hover:bg-violet-100/60 dark:hover:bg-violet-900/40"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                      >
                        <div className="relative shrink-0">
                          {notif.user_pic_url ? (
                            <img
                              src={notif.user_pic_url}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                              {notif.senderfullname?.charAt(0) || "?"}
                            </div>
                          )}
                          {!notif.is_read && (
                            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-violet-600 border border-white" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{notif.senderfullname}</span> 
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">
                            {calculate_post_time(notif.created_at)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {appliedTheme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setAvatarOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 pl-1.5 pr-3 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all shadow-sm"
          >
            <ProfilePic
              uname={userName}
              custom_pic_url={avatarUrl}
              className="h-7 w-7 rounded-lg text-xs font-black"
            />
            <span className="hidden sm:block max-w-[120px] truncate text-[13px] font-semibold text-slate-800 dark:text-slate-200">
              {displayName || userName}
            </span>
            <ChevronDown
              size={13}
              strokeWidth={2.5}
              className={`text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-200 ${avatarOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown */}
          {avatarOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <ProfilePic
                  uname={userName}
                  custom_pic_url={avatarUrl}
                  className="h-8 w-8 rounded-lg text-sm font-black shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
                    {displayName || userName}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">
                    @{userName}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button
                  onClick={() => {
                    navigate(`/user/${safeUserName}/profile`);
                    setAvatarOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <User size={14} className="text-slate-400 dark:text-slate-500" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate(`/user/${safeUserName}/notification`);
                    setAvatarOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <Bell size={14} className="text-slate-400 dark:text-slate-500" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto text-[10px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    navigate(`/user/${safeUserName}/suggestions`);
                    setAvatarOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  <UserPlus size={14} className="text-slate-400 dark:text-slate-500" />
                  Network
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE TITLE FROM ROUTE
// ─────────────────────────────────────────────────────────────────────────────
function usePageTitle() {
  const { pathname } = useLocation();
  if (/\/profile/.test(pathname)) return "My Profile";
  if (/\/events$/.test(pathname)) return "Events";
  if (/\/event\//.test(pathname)) return "Event Details";
  if (/\/notification/.test(pathname)) return "Notifications";
  if (/\/settings/.test(pathname)) return "Settings";
  if (/\/calendar/.test(pathname)) return "Calendar";
  if (/\/collabrate/.test(pathname)) return "Collaborate";
  if (/\/createpost/.test(pathname)) return "Create Post";
  if (/\/managepost\//.test(pathname)) return "Manage Post";
  if (/\/chat/.test(pathname)) return "Chat";
  if (/\/workspaces/.test(pathname)) return "WorkSpace";
  if (/\/suggestions/.test(pathname)) return "Network";
  return "Home";
}

function LayoutSkeleton({ isCollapsed }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-sans">
      {/* Skeleton Sidebar */} 
      <div className={`relative flex h-full ${isCollapsed ? 'w-[80px]' : 'w-[272px]'} shrink-0 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-[width] duration-300 ease-in-out animate-pulse`}>
        <div className={`pt-5 pb-4 ${isCollapsed ? 'px-0' : 'px-5'}`}>
          <div className="flex items-center gap-3 mb-2 justify-center">
            <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
            {!isCollapsed && <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-700" />}
          </div>
        </div>
        <div className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} space-y-2`}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={`h-9 rounded-xl bg-slate-100 dark:bg-slate-800 ${isCollapsed ? 'w-11 mx-auto' : ''}`} />
          ))}
        </div>
        <div className={`py-3 border-t border-slate-100 dark:border-slate-800 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          <div className={`h-9 rounded-xl bg-slate-100 dark:bg-slate-800 ${isCollapsed ? 'w-11 mx-auto' : ''}`} />
        </div>
      </div>

      {/* Skeleton Main Area */} 
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Skeleton TopBar */}
        <header className="sticky top-0 z-40 flex h-[68px] w-full items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 sm:px-7 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-20 rounded-md bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-1.5 pl-1.5 pr-3">
              <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800" />
              <div className="h-4 w-20 rounded-md bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </header>

        {/* Skeleton Content */} 
        <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
          <div className="p-4 sm:p-6 lg:p-8 animate-pulse">
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export default function MainLayout({ children }) {
  const loggedInUser = localStorage.getItem("username");
  const accountType = localStorage.getItem("accountType");
  const user_name = localStorage.getItem('username')
  const navigate = useNavigate();
  const { theme, setTheme, appliedTheme } = useTheme();

  const { userData, setUserData, setProfileData, profileData } = useContext(UserContext);

  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLayoutLoading, setIsLayoutLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const location = useLocation();
  const isChatPage = location.pathname.includes('/chat');

  const pageTitle = usePageTitle();

  const displayName =
    profileData?.full_name ||
    userData?.full_name ||
    userData?.username ||
    loggedInUser;

  const avatarUrl = profileData?.profile_pic || userData?.profile_pic || null;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Fetch user + profile
  useEffect(() => {
    const initLayout = async () => {
      if (!userData) {
        setIsLayoutLoading(true);
      }
      try {
        const userRes = await fetch_user(loggedInUser);
        setUserData(userRes.data);

        if (accountType === "student" && (!user_name || loggedInUser === user_name)) {
          try {
            const profileRes = await fetch_profile(loggedInUser);
            setProfileData(profileRes.data);
          } catch (err) {
            const msg = err?.response?.data?.message || err?.response?.data?.detail || "";
            if (
              msg.toLowerCase().includes("not found") &&
              !window.location.pathname.startsWith(`/user/${loggedInUser}/profile`)
            ) {
              setIsProfileFormOpen(true);
              setIsCompulsory(true);
            }
          }
        }
      } catch {
        navigate("/*");
      } finally {
        setIsLayoutLoading(false);
      }
    };

    initLayout();
  }, [loggedInUser, user_name, accountType, navigate, setUserData, setProfileData]);

  // Fetch notifications + websocket
  useEffect(() => {
    if (!userData?.username) return;

    const fetchOldNotifs = async () => {
      try {
        const res = await retirve_notification();
        const lastReadAt = parseInt(
          localStorage.getItem("notifs_read_at") || "0",
          10
        );
        const processed = res.data.map((n) => ({
          ...n,
          is_read:
            n.is_read ||
            (lastReadAt > 0 &&
              new Date(n.created_at).getTime() <= lastReadAt),
        }));
        setNotifications(processed);
      } catch {
        // silent fail
      }
    };

    fetchOldNotifs();

    const safeUsername = userData.username
      ?.replace(/@/g, "_at_")
      ?.replace(/\+/g, "_plus_");
    const socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notification/user_${safeUsername}/`
    );
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [{ ...data, is_read: false }, ...prev]);
    };
    return () => socket.close();
  }, [userData?.username]);

  // Mark all read when bell opens (handled in TopBar inline)
  const markAllRead = useCallback(() => {
    localStorage.setItem("notifs_read_at", Date.now().toString());
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  if (isLayoutLoading) {
    return <LayoutSkeleton isCollapsed={isCollapsed} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && ( 
        <div
          className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[1px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-250 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar
          userName={loggedInUser}
          displayName={displayName}
          avatarUrl={avatarUrl}
          unreadCount={unreadCount}
          onClose={() => setSidebarOpen(false)}
          mobileOpen={sidebarOpen}
          isCollapsed={isCollapsed}
        />
      </div>

      {/* Main column */} 
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          pageTitle={pageTitle}
          userName={loggedInUser}
          displayName={displayName}
          avatarUrl={avatarUrl}
          notifications={notifications}
          unreadCount={unreadCount}
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={() => setIsCollapsed(prev => !prev)}
          theme={theme}
          setTheme={setTheme}
          appliedTheme={appliedTheme}
          onBellOpen={markAllRead}
        />

        <main className={`flex-1 ${isChatPage ? 'overflow-hidden' : 'overflow-y-auto'} bg-white dark:bg-slate-900`}> 
          <div className={`${isChatPage ? 'h-[calc(100vh-68px)]' : 'min-h-[calc(100vh-68px)]'} flex flex-col`}>
            {children ? children : <Outlet />}
            {!isChatPage && <Footer />}
          </div>
        </main>
      </div>

      {/* Profile setup modal */} 
      <ProfileForm
        isOpen={isProfileFormOpen}
        isCompulsory={isCompulsory}
        onClose={() => {
          if (!isCompulsory) setIsProfileFormOpen(false);
        }}
        onSuccess={(newProfile) => {
          setProfileData(newProfile);
          setIsProfileFormOpen(false);
          setIsCompulsory(false);
        }}
        initialData={
          profileData && Object.keys(profileData).length > 0
            ? profileData
            : null
        }
      />
    </div>
  );
}

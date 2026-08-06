import {
    Outlet,
    useNavigate,
    useParams,
    NavLink,
    useLocation,
    Navigate,
} from "react-router-dom";
import { fetch_user } from "../api/user_apis";
import { fetch_organization_profile } from "../api/public_apis";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "../contextAPI/userContext";
import OrganizationProfileForm from "../pages/Organization_Pages/OrganizationProfileForm";
import { retirve_notification } from "../api/notification_apis";
import calculate_post_time from "../reusable_methods/time_calculator";
import {
    LayoutDashboard,
    CalendarDays,
    Building2,
    Settings,
    LogOut,
    Plus,
    Bell,
    Moon,
    Sun,
    ShieldCheck,
    Menu,
    X,
    ChevronDown,
} from "lucide-react";
import ProfilePic from "../components/ProfilePic";
import MainLayout from "./mainlayout/MainLayout";

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, badge, onClick, end: isEnd = false, isCollapsed }) {
    const base =
        `relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3.5'} w-full py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-150 cursor-pointer select-none`;
    const active =
        "bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.30)]";
const inactive =
        "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200";

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${base} ${inactive}`}
                title={isCollapsed ? label : undefined}
            >
                <Icon size={17} strokeWidth={2} className="shrink-0 opacity-80" />
                {!isCollapsed && <span className="flex-1">{label}</span>}
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
function Sidebar({ orgDisplayName, onClose, mobileOpen, isCollapsed, unreadCount }) {
    const navigate = useNavigate();
    const { organization_name } = useParams();
    const base = `/organization/${organization_name}`;

    return (
<aside className={`relative flex h-full shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800 ${isCollapsed ? 'w-[80px]' : 'w-[272px]'}`}>
            {/* Mobile close */}
            {mobileOpen && (
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3.5 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden dark:hover:text-slate-300 dark:hover:bg-slate-800"
                >
                    <X size={16} />
                </button>
            )}

            {/* ── Brand ── */}
            <div className={`pt-5 pb-4 ${isCollapsed ? 'px-0 flex justify-center' : 'px-5'}`}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-2`}>
                    <img src="/coDO.svg" alt="CoDO" className="h-10 w-auto" />
                    {!isCollapsed && <span className="text-xl mb-2 font-black tracking-tight text-slate-900 dark:text-slate-100">CoDO</span>}
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5 overflow-x-hidden">
                {!isCollapsed ? (
                    <p className="px-3.5 pt-1 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Menu
                    </p>
                ) : (
                    <div className="h-6" /> // spacer
                )}
                <NavItem to={base} icon={LayoutDashboard} label="Dashboard" end isCollapsed={isCollapsed} />
                <NavItem
                    to={`${base}/events`}
                    icon={CalendarDays}
                    label="My Events"
                    isCollapsed={isCollapsed}
                />

                {/* Divider */}
                <div className="mx-1 my-3 h-px bg-slate-100 dark:bg-slate-800" />

                {/* New Event CTA */}
                <div className={isCollapsed ? "flex justify-center" : ""}>
                    <button
                        type="button"
                        onClick={() => navigate(`${base}/create/event`)}
                        title={isCollapsed ? "New Event" : undefined}
                        className={`flex items-center justify-center ${isCollapsed ? 'w-11 h-11 p-0' : 'gap-2 w-full py-2.5 px-4'} rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_2px_10px_rgba(109,40,217,0.35)] hover:shadow-[0_4px_16px_rgba(109,40,217,0.45)] hover:brightness-110 active:scale-[0.98] transition-all duration-150 whitespace-nowrap`}
                    >
                        <Plus size={isCollapsed ? 20 : 15} strokeWidth={2.5} className="shrink-0" />
                        {!isCollapsed && "New Event"}
                    </button>
                </div>

                <div className="mx-1 my-3 h-px bg-slate-100 dark:bg-slate-800" />

                {!isCollapsed ? (
                    <p className="px-3.5 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                        Manage
                    </p>
                ) : (
                    <div className="h-6" /> // spacer
                )}
                <NavItem
                    to={`/organization/${organization_name}/profile`}
                    icon={Building2}
                    label="Organization Profile"
                    isCollapsed={isCollapsed}
                />
                <NavItem
                    to={`${base}/settings`}
                    icon={Settings}
                    label="Settings"
                    isCollapsed={isCollapsed}
                />
            </nav>

            {/* ── Footer / Logout ── */}
            <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800">
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
// TOP HEADER / NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function TopBar({ pageTitle, orgDisplayName, onMenuClick, onToggleCollapse, isDark, setIsDark, notifications, unreadCount, onBellOpen }) {
    const { userData } = useContext(UserContext);
    const [bellOpen, setBellOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const bellRef = useRef(null);
    const avatarRef = useRef(null);
    const navigate = useNavigate();
    const { organization_name } = useParams();

    const displayName = orgDisplayName || userData?.username || "Organization";

    // Close dropdowns on outside click
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
            return `/organization/${organization_name}/managepost/${notif.event_id}`;
        if (type === "event")
            return `/organization/${organization_name}/event/${notif.event_id}`;
        // Default for other notification types
        return `/organization/${organization_name}/profile`;
    };

    const recentNotifs = notifications.slice(0, 5);

return (
        <header className="sticky top-0 z-40 flex h-[68px] w-full items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7 dark:border-slate-800 dark:bg-slate-900">
            {/* ── Left: hamburger (mobile) + page title ── */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => {
                        if (window.innerWidth < 1024) onMenuClick();
                        else onToggleCollapse();
                    }}
                    className="-ml-1 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                    <Menu size={19} />
                </button>

                <div>
                    <h1 className="text-[17px] font-bold text-slate-900 leading-none tracking-tight dark:text-slate-100">
                        {pageTitle}
                    </h1>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-none">
                        CoDO Organization
                    </p>
                </div>
            </div>

            {/* ── Right: actions ── */}
            <div className="flex items-center gap-1.5">

                {/* Divider */}
                <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />

                {/* Avatar + dropdown */}
                <div className="relative" ref={avatarRef}>
                    <button
                        onClick={() => setAvatarOpen((v) => !v)}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-600"
                    >
                        <ProfilePic
                            uname={displayName}
                            className="h-7 w-7 rounded-lg text-xs font-black"
                        />
                        <span className="hidden sm:block max-w-[120px] truncate text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                            {displayName}
                        </span>
                        <ChevronDown
                            size={13}
                            strokeWidth={2.5}
                            className={`text-slate-400 shrink-0 transition-transform duration-200 dark:text-slate-500 ${avatarOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Avatar dropdown */}
                    {avatarOpen && (
                        <div className="absolute right-0 top-[calc(100%+6px)] w-56 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">
                                    Signed in as
                                </p>
                                <p className="text-[13px] font-bold text-slate-900 truncate dark:text-slate-100">
                                    {displayName}
                                </p>
                            </div>

                            {/* Menu items */}
                            <div className="flex flex-col gap-1.5 py-2.5 border-b border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => {
                                        navigate(`/organization/${organization_name}/profile`);
                                        setAvatarOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                >
                                    <Building2 size={14} className="text-slate-400 dark:text-slate-500" />
                                    Organization Profile
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(`/organization/${organization_name}/settings`);
                                        setAvatarOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                                >
                                    <Settings size={14} className="text-slate-400 dark:text-slate-500" />
                                    Settings
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-slate-100 py-1.5 dark:border-slate-800">
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        navigate("/");
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 font-semibold hover:bg-red-50 transition-colors dark:hover:bg-red-500/10"
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
    if (/\/events\/edit\//.test(pathname)) return "Edit Event";
    if (/\/create\/event/.test(pathname)) return "Create Event";
    if (/\/events$/.test(pathname)) return "My Events";
    if (/\/profile/.test(pathname)) return "Organization Profile";
    if (/\/settings/.test(pathname)) return "Settings";
    if (/\/event\//.test(pathname)) return "Event Details";
    if (/\/calendar/.test(pathname)) return "Calendar";
    return "Dashboard";
}

function LayoutSkeleton({ isCollapsed }) {
    return (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans dark:bg-slate-950">
            {/* Skeleton Sidebar */}
            <div className={`relative flex h-full ${isCollapsed ? 'w-[80px]' : 'w-[272px]'} shrink-0 flex-col bg-white border-r border-slate-200 transition-[width] duration-300 ease-in-out animate-pulse dark:bg-slate-900 dark:border-slate-800`}>
                <div className={`pt-5 pb-4 ${isCollapsed ? 'px-0' : 'px-5'}`}>
                    <div className="flex items-center gap-3 mb-2 justify-center">
                        <div className="h-10 w-10 rounded-lg bg-slate-200" />
                        {!isCollapsed && <div className="h-6 w-24 rounded-md bg-slate-200" />}
                    </div>
                </div>
                <div className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} space-y-2`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`h-9 rounded-xl bg-slate-100 ${isCollapsed ? 'w-11 mx-auto' : ''}`} />
                    ))}
                    <div className="mx-1 my-3 h-px bg-slate-100" />
                    <div className={`h-11 rounded-xl bg-violet-100 ${isCollapsed ? 'w-11 mx-auto' : ''}`} />
                </div>
                <div className={`py-3 border-t border-slate-100 ${isCollapsed ? 'px-2' : 'px-3'}`}>
                    <div className={`h-9 rounded-xl bg-slate-100 ${isCollapsed ? 'w-11 mx-auto' : ''}`} />
                </div>
            </div>

            {/* Skeleton Main Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Skeleton TopBar */}
                <header className="sticky top-0 z-40 flex h-[68px] w-full items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7 animate-pulse dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100" />
                        <div className="space-y-1.5">
                            <div className="h-4 w-28 rounded-md bg-slate-200" />
                            <div className="h-3 w-20 rounded-md bg-slate-100" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-slate-100" />
                        <div className="h-9 w-9 rounded-xl bg-slate-100" />
                        <div className="h-5 w-px bg-slate-200 mx-1" />
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3">
                            <div className="h-7 w-7 rounded-lg bg-slate-100" />
                            <div className="h-4 w-20 rounded-md bg-slate-100" />
                        </div>
                    </div>
                </header>

                {/* Skeleton Content */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950">
                    <div className="p-4 sm:p-6 lg:p-8 animate-pulse">
                        <div className="h-10 bg-slate-100 rounded-2xl w-full mb-4" />
                        <div className="h-64 bg-slate-100 rounded-2xl" />
                    </div>
                </main>
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export default function OrganizationLayout() {
    const loggedInUser = localStorage.getItem("username");
    const accountType = localStorage.getItem("accountType");
    const { organization_name } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isLayoutLoading, setIsLayoutLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const pageTitle = usePageTitle();
    const orgDisplayName =
        userData?.organization_name || userData?.username || organization_name;

    useEffect(() => {
        const initLayout = async () => {
            if (!userData) {
                setIsLayoutLoading(true);
            }
            try {
                const res = await fetch_user(loggedInUser);
                setUserData(res.data);
            } catch {
                setIsLayoutLoading(false);
                navigate("/*");
            }
        };

        const getProfile = async () => {
            if (accountType !== "organization" || loggedInUser !== organization_name)
                return;
            try {
                const res = await fetch_organization_profile(loggedInUser);
                setProfileData(res);
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    err?.response?.data?.detail ||
                    err?.response?.data?.error ||
                    err?.detail ||
                    err?.error ||
                    "";
                const is404 =
                    err?.response?.status === 404 ||
                    msg.toLowerCase().includes("not found");
                const notOnProfilePage = !window.location.pathname.startsWith(
                    `/organization/${loggedInUser}/profile`
                );
                if (is404 && notOnProfilePage) {
                    setIsProfileFormOpen(true);
                    setIsCompulsory(true);
                }
            }
        };

        const run = async () => {
            await initLayout();
            await getProfile();
            setIsLayoutLoading(false);
        }
        run();
    }, [loggedInUser, organization_name, accountType, navigate, setUserData]);

    // Fetch notifications + websocket
    useEffect(() => {
        if (!userData?.username) return;

        const fetchOldNotifs = async () => {
            try {
                const res = await retirve_notification();
                const lastReadAt = parseInt(
                    localStorage.getItem("org_notifs_read_at") || "0", // Use a different key for org notifications
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
            .replace(/\+/g, "_plus_");
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
        localStorage.setItem("org_notifs_read_at", Date.now().toString()); // Use a different key
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }, []);
const unreadCount = notifications.filter((n) => !n.is_read).length;

    // ── AUTHORIZATION GUARD ──
    // Only the org owner (organization account & matching username) can access
    // management routes (dashboard, events management, settings, create event).
    // Any other user (student or another org) may only view the PUBLIC profile.
    const isOwner =
        accountType === "organization" &&
        !!loggedInUser &&
        loggedInUser === organization_name;
    const { pathname } = location;
    const orgBase = `/organization/${organization_name}`;
    const isPublicProfilePath =
        pathname === `${orgBase}/profile` ||
        pathname === orgBase ||
        // Public event detail pages (any viewer may see the event page)
        (pathname.startsWith(`${orgBase}/event/`) && pathname.split("/").length === 5);

    if (isLayoutLoading) {
        return <LayoutSkeleton isCollapsed={isCollapsed} />;
    }

// Non-owner visiting a management route → force redirect to the public profile
    if (!isOwner && !isPublicProfilePath) {
        return <Navigate to={`/organization/${organization_name}/profile`} replace />;
    }

    // ── PUBLIC LAYOUT (non-owner viewing a public org profile) ──
    // Students / other orgs must NOT see the org management sidebar or be able
    // to access the org dashboard.
    if (!isOwner) {
        // Logged-in visitors (students / other orgs) keep their OWN application
        // layout (sidebar + navbar). Only the main content area changes to show
        // the organization's public profile / public event page.
        if (loggedInUser) {
            return (
                <MainLayout>
                    <div className="flex-1 min-h-[calc(100vh-68px)]">
                        <Outlet />
                    </div>
                </MainLayout>
            );
        }

// Logged-out guests get a minimal public header with the page below.
        return (
            <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
                <header className="sticky top-0 z-40 flex h-[64px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <img src="/coDO.svg" alt="CoDO" className="h-8 w-auto" />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-700 transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-violet-500 dark:hover:text-violet-300"
                        >
                            Home
                        </button>
                    </div>
                </header>
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans dark:bg-slate-950">
            {/* Mobile sidebar overlay */}
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
                    orgDisplayName={orgDisplayName}
                    onClose={() => setSidebarOpen(false)}
                    mobileOpen={sidebarOpen}
                    unreadCount={unreadCount}
                    isCollapsed={isCollapsed}
                />
            </div>

            {/* Main column */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top navbar */}
                <TopBar
                    pageTitle={pageTitle}
                    orgDisplayName={orgDisplayName}
                    onMenuClick={() => setSidebarOpen(true)}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isDark={isDark}
                    setIsDark={setIsDark}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onBellOpen={markAllRead}
                />

                {/* Scrollable page content */}
                <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Profile setup modal */}
            <OrganizationProfileForm
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

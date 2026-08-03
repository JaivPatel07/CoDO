import {
    Outlet,
    useNavigate,
    useParams,
    NavLink,
    useLocation,
} from "react-router-dom";
import { fetch_user } from "../api/user_apis";
import { fetch_organization_profile } from "../api/public_apis";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contextAPI/userContext";
import OrganizationProfileForm from "../pages/Organization_Pages/OrganizationProfileForm";
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

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAV ITEM
// ─────────────────────────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, onClick, end: isEnd = false, isCollapsed }) {
    const base =
        `flex items-center ${isCollapsed ? 'justify-center w-11 h-11 mx-auto p-0' : 'gap-3 w-full px-3.5 py-2.5'} rounded-xl text-[13.5px] font-semibold transition-all duration-150 cursor-pointer select-none`;
    const active =
        "bg-violet-600 text-white shadow-[0_2px_8px_rgba(124,58,237,0.30)]";
    const inactive =
        "text-slate-500 hover:bg-slate-100 hover:text-slate-800";

    if (onClick) {
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${base} ${inactive}`}
                title={isCollapsed ? label : undefined}
            >
                <Icon size={17} strokeWidth={2} className="shrink-0 opacity-80" />
                {!isCollapsed && <span>{label}</span>}
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
                    {!isCollapsed && <span>{label}</span>}
                </>
            )}
        </NavLink>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function Sidebar({ orgDisplayName, onClose, mobileOpen, isCollapsed }) {
    const navigate = useNavigate();
    const { organization_name } = useParams();
    const base = `/organization/${organization_name}`;

    return (
        <aside className={`relative flex h-full shrink-0 flex-col bg-white border-r border-slate-200 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[272px]'}`}>
            {/* Mobile close */}
            {mobileOpen && (
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3.5 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
                >
                    <X size={16} />
                </button>
            )}

            {/* ── Brand ── */}
            <div className={`pt-5 pb-4 ${isCollapsed ? 'px-0 flex justify-center' : 'px-5'}`}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-2`}>
                    <img src="/coDO.svg" alt="CoDO" className="h-10 w-auto" />
                    {!isCollapsed && <span className="text-xl mb-2 font-black tracking-tight text-slate-900">CoDO</span>}
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
                <div className="mx-1 my-3 h-px bg-slate-100" />

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

                <div className="mx-1 my-3 h-px bg-slate-100" />

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
            <div className="px-3 py-3 border-t border-slate-100">
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
function TopBar({ pageTitle, orgDisplayName, onMenuClick, onToggleCollapse, isDark, setIsDark }) {
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

    return (
        <header className="sticky top-0 z-40 flex h-[68px] w-full items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-7">
            {/* ── Left: hamburger (mobile) + page title ── */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden -ml-1 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                    <Menu size={19} />
                </button>
                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:block -ml-1 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                    <Menu size={19} />
                </button>

                <div>
                    <h1 className="text-[17px] font-bold text-slate-900 leading-none tracking-tight">
                        {pageTitle}
                    </h1>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-none">
                        CoDO Organization
                    </p>
                </div>
            </div>

            {/* ── Right: actions ── */}
            <div className="flex items-center gap-1.5">

                {/* Bell */}
                <div className="relative" ref={bellRef}>
                    <button
                        onClick={() => setBellOpen((v) => !v)}
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        title="Notifications"
                    >
                        <Bell size={17} strokeWidth={2.2} />
                        {/* unread dot */}
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-white" />
                    </button>

                    {bellOpen && (
                        <div className="absolute right-0 top-[calc(100%+6px)] w-[300px] rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <span className="text-sm font-bold text-slate-900">Notifications</span>
                                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                                    0 new
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-2">
                                    <Bell size={18} className="text-slate-300" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">
                                    You're all caught up!
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    No new notifications right now.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dark mode toggle */}
                <button
                    onClick={() => setIsDark((d) => !d)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    title={isDark ? "Light mode" : "Dark mode"}
                >
                    {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </button>

                {/* Divider */}
                <div className="mx-1 h-5 w-px bg-slate-200" />

                {/* Avatar + dropdown */}
                <div className="relative" ref={avatarRef}>
                    <button
                        onClick={() => setAvatarOpen((v) => !v)}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <ProfilePic
                            uname={displayName}
                            className="h-7 w-7 rounded-lg text-xs font-black"
                        />
                        <span className="hidden sm:block max-w-[120px] truncate text-[13px] font-semibold text-slate-800">
                            {displayName}
                        </span>
                        <ChevronDown
                            size={13}
                            strokeWidth={2.5}
                            className={`text-slate-400 shrink-0 transition-transform duration-200 ${avatarOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {/* Avatar dropdown */}
                    {avatarOpen && (
                        <div className="absolute right-0 top-[calc(100%+6px)] w-56 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)] z-50 overflow-hidden">
                            {/* User info */}
                            <div className="px-4 py-3 border-b border-slate-100">
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">
                                    Signed in as
                                </p>
                                <p className="text-[13px] font-bold text-slate-900 truncate">
                                    {displayName}
                                </p>
                            </div>

                            {/* Menu items */}
                            <div className="py-1.5">
                                <button
                                    onClick={() => {
                                        navigate(`/organization/${organization_name}/profile`);
                                        setAvatarOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <Building2 size={14} className="text-slate-400" />
                                    Organization Profile
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(`/organization/${organization_name}/settings`);
                                        setAvatarOpen(false);
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <Settings size={14} className="text-slate-400" />
                                    Settings
                                </button>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-slate-100 py-1.5">
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        navigate("/");
                                    }}
                                    className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-500 font-semibold hover:bg-red-50 transition-colors"
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

// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export default function OrganizationLayout() {
    const loggedInUser = localStorage.getItem("username");
    const accountType = localStorage.getItem("accountType");
    const { organization_name } = useParams();
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDark, setIsDark] = useState(false);

    const pageTitle = usePageTitle();
    const orgDisplayName =
        userData?.organization_name || userData?.username || organization_name;

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch_user(loggedInUser);
                setUserData(res.data);
            } catch {
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

        getUser();
        getProfile();
    }, [loggedInUser, organization_name, accountType, navigate, setUserData]);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8F9FB] font-sans">
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
                />

                {/* Scrollable page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-5 py-7 sm:px-7 sm:py-8">
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
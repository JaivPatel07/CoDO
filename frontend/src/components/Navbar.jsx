import { useState, useRef, useEffect, useContext } from "react";
import { Code2, Search, Bell, LogOut, User, ChevronDown, Settings, Moon, Plus, Briefcase, MessagesSquare, Sun } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../contextAPI/userContext";
import ProfilePic from "./ProfilePic";
import { motion, AnimatePresence } from "framer-motion";
import { retirve_notification } from "../api/notification_apis";
import calculate_post_time from "../reusable_methods/time_calculator";



export default function Navbar({ location }) {
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { userData } = useContext(UserContext);
    const curr_user_name = localStorage.getItem('username')

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [notifications, setNotifications] = useState([]);
    const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
    const notifDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutsideNotif(event) {
            if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
                setIsNotifDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutsideNotif);
        return () => document.removeEventListener("mousedown", handleClickOutsideNotif);
    }, []);

    useEffect(() => {
        if (!userData?.username) return;
        const fetch_oldnotification = async () => {
            try {
                const res = await retirve_notification();
                const lastReadAt = parseInt(localStorage.getItem('notifs_read_at') || '0', 10);
                const processed = res.data.map(n => ({
                    ...n,
                    is_read: n.is_read || (lastReadAt > 0 && new Date(n.created_at).getTime() <= lastReadAt)
                }));
                setNotifications(processed);
            } catch (err) {
                console.log("Notif fetch err", err);
            }
        };
        fetch_oldnotification();
        const safeUsername = userData.username?.replace(/@/g, '_at_').replace(/\+/g, '_plus_') || 'undefined';
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notification/user_${safeUsername}/`);
        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            const newNotification = { ...data, is_read: data.is_read !== undefined ? data.is_read : false };
            setNotifications(prev => [newNotification, ...prev]);
        };
        return () => socket.close();
    }, [userData?.username]);

    const hasUnread = notifications.some(n => !n.is_read);
    const recentNotifs = notifications.slice(0, 4);

    const getNotificationLink = (notif) => {
        const type = notif.notification_type?.toLowerCase();
        if (type === 'team join' || type === 'team request') {
            return `/user/${userData.username}/managepost/${notif.event_id}`;
        }
        return `/user/${notif.senderusername}/profile`;
    };

    return (
<header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-xl dark:border-zinc-800 dark:bg-slate-900/80">
            <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* ---------------- Left: Logo ---------------- */}
                <Link to="/" className="flex items-center gap-2.5 cursor-pointer select-none group transition-transform duration-300">
                    <img src="/coDO.svg" alt="CoDO Logo" className="h-15 transition-transform duration-300 group-hover:scale-105" />
                </Link>

                {/* ---------------- Right Side Items ---------------- */}
                {location === "landing" ?
                    (<div className="flex items-center gap-4">
<Link
                            to="/login"
                            className="rounded-xl px-5 py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors dark:text-zinc-300 dark:hover:text-white"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5"
                        >
                            Get Started
                        </Link>
                    </div>)
                    : location === "user" ?
                        (
                            <div className="flex items-center gap-4 md:gap-5">

                                {/* Search Bar */}
                                <div className="hidden md:flex relative w-full max-w-[260px] group">
                                    <Search
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-all duration-300 group-focus-within:text-violet-500"
                                        size={16}
                                    />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search CoDO..."
                                        className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2 pl-10 pr-4 text-sm text-zinc-700 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10 shadow-sm"
                                    />
                                </div>

                                {/* Bell Icon & Dropdown */}
                                <div className="relative inline-block" ref={notifDropdownRef}>
                                    <button
                                        onClick={() => {
                                            const opening = !isNotifDropdownOpen;
                                            setIsNotifDropdownOpen(opening);
                                            if (opening) {
                                                // Persist the read timestamp so it survives re-fetches
                                                localStorage.setItem('notifs_read_at', Date.now().toString());
                                                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                                            }
                                        }}
                                        className="relative rounded-full p-2.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-zinc-900 active:scale-95 group"
                                    >
                                        <Bell size={18} strokeWidth={2.2} className="group-hover:animate-swing" />
                                        {hasUnread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>}
                                    </button>

                                    <AnimatePresence>
                                        {isNotifDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-[calc(100%+8px)] w-80 origin-top-right rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.08)] z-50"
                                            >
                                                <div className="flex justify-between items-center px-3 py-2 border-b border-zinc-100 mb-2">
                                                    <span className="font-bold text-sm text-zinc-900">Notifications</span>
                                                    <Link to={`/user/${userData.username}/notification`} onClick={() => setIsNotifDropdownOpen(false)} className="text-[11px] font-bold text-violet-600 hover:text-violet-700">See all</Link>
                                                </div>
                                                <div className="max-h-80 overflow-y-auto space-y-1 pb-1">
                                                    {recentNotifs.length === 0 ? (
                                                        <div className="py-6 text-center text-sm text-zinc-500 font-medium">No new notifications</div>
                                                    ) : (
                                                        recentNotifs.map(notif => (
                                                            <Link
                                                                key={notif.id}
                                                                to={getNotificationLink(notif)}
                                                                onClick={() => setIsNotifDropdownOpen(false)}
                                                                className={`flex gap-3 p-2.5 rounded-xl transition-all block ${!notif.is_read ? 'bg-violet-50/50 hover:bg-violet-100/50' : 'hover:bg-zinc-50'}`}
                                                            >
                                                                <div className="relative shrink-0">
                                                                    {notif.user_pic_url ? (
                                                                        <img src={notif.user_pic_url} alt="user" className="w-9 h-9 rounded-full object-cover" />
                                                                    ) : (
                                                                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs">🔔</div>
                                                                    )}
                                                                    {!notif.is_read && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-violet-600 rounded-full border-2 border-white"></div>}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[12px] text-zinc-700 leading-tight">
                                                                        <span className="font-bold text-zinc-900">{notif.senderfullname}</span> {notif.message}
                                                                    </p>
                                                                    <p className="text-[10px] text-zinc-400 mt-1 font-semibold">{calculate_post_time(notif.created_at)}</p>
                                                                </div>
                                                            </Link>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* User Profile & Dropdown */}
                                <div className="relative inline-block" ref={dropdownRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center h-10 pl-1 pr-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
                                    >
                                        <ProfilePic
                                            uname={userData.username}
                                            className="h-8 w-8 rounded-full shrink-0"
                                        />
                                        <span className="hidden sm:block text-sm font-semibold text-zinc-900 ml-2 max-w-[120px] truncate">
                                            {userData.firstname || userData.username}
                                        </span>
                                        <ChevronDown
                                            size={14}
                                            className={`text-zinc-500 ml-1.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-[calc(100%+8px)] w-60 origin-top-right rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.08)] z-50"
                                            >
                                                <div className="flex items-center gap-3 p-3 mb-1 border-b border-zinc-100">
                                                    <ProfilePic uname={userData.username} className="h-10 w-10 shrink-0 ring-2 ring-zinc-50" />
                                                    <div className="flex flex-col justify-center min-w-0">
                                                        <span className="text-sm font-bold text-zinc-900 truncate">
                                                            {userData.firstname || userData.username}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Student</span>
                                                    </div>
                                                </div>

                                                <div className="py-1">
                                                    {[
                                                        { label: "Profile", icon: User, path: `/user/${userData.username}/profile` },
                                                        { label: "Notifications", icon: Bell, path: `/user/${userData.username}/notification` },
                                                        { label: "Settings", icon: Settings, path: `/user/${userData.username}/settings` }
                                                    ].map(item => (
                                                        <Link
                                                            key={item.label}
                                                            to={item.path}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                                                        >
                                                            <item.icon size={16} className="text-zinc-400" />
                                                            {item.label}
                                                            {item.label === 'Notifications' && <span className="ml-auto text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">New</span>}
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="my-1 h-px w-full bg-zinc-100"></div>

                                                <Link
                                                    to='/logout'
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                                >
                                                    <LogOut size={16} />
                                                    Log out
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )
                        : location === "organization" ?
                            (
                                <div className="flex items-center gap-3 md:gap-5">
                                    <div className="hidden lg:flex relative w-full max-w-[240px] group">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-all duration-300 group-focus-within:text-violet-500" size={16} />
                                        <input
                                            placeholder="Search Events..."
                                            className="w-full rounded-full border border-zinc-200 bg-zinc-50/50 py-2 pl-10 pr-4 text-sm text-zinc-700 outline-none transition-all duration-300 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10 shadow-sm"
                                        />
                                    </div>
                                    <Link to={`/organization/${userData.username}/create/event`} className="hidden sm:flex items-center gap-2 bg-violet-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm hover:bg-violet-700 active:scale-95">
                                        <Plus size={14} /> Create Event
                                    </Link>

                                    <div className="relative inline-block" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex items-center h-10 pl-1 pr-2.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
                                        >
                                            <ProfilePic
                                                uname={userData.username}
                                                className="h-8 w-8 rounded-full shrink-0"
                                            />
                                            <span className="hidden sm:block text-sm font-semibold text-zinc-900 ml-2 max-w-[120px] truncate">
                                                {userData.organization_name || userData.username}
                                            </span>
                                            <ChevronDown
                                                size={14}
                                                className={`text-zinc-500 ml-1.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute right-0 top-[calc(100%+8px)] w-60 origin-top-right rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_12px_32px_rgba(0,0,0,0.08)] z-50"
                                                >
                                                    <div className="flex items-center gap-3 p-3 mb-1 border-b border-zinc-100">
                                                        <ProfilePic uname={userData.username} className="h-10 w-10 shrink-0 ring-2 ring-zinc-50" />
                                                        <div className="flex flex-col justify-center min-w-0">
                                                            <span className="text-sm font-bold text-zinc-900 truncate">
                                                                {userData.organization_name || userData.username}
                                                            </span>
                                                            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">Organization</span>
                                                        </div>
                                                    </div>

                                                    <div className="py-1">
                                                        {[
                                                            { label: "Profile", icon: Briefcase, path: `/organization/${userData.username}/profile` },
                                                            { label: "Manage Events", icon: Plus, path: `/organization/${userData.username}/create/event` },
                                                            { label: "Settings", icon: Settings, path: '#' },
                                                        ].map(item => (
                                                            <Link
                                                                key={item.label}
                                                                to={item.path}
                                                                onClick={() => setIsDropdownOpen(false)}
                                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                                                            >
                                                                <item.icon size={16} className="text-zinc-400" />
                                                                {item.label}
                                                            </Link>
                                                        ))}
                                                    </div>

                                                    <div className="my-1 h-px w-full bg-zinc-100"></div>

                                                    <Link
                                                        to='/logout'
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                                    >
                                                        <LogOut size={16} />
                                                        Log out
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )
                            : null
                }
            </div>
        </header>
    );
}

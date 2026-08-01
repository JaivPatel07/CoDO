import { useState, useRef, useEffect, useContext } from "react";
import { Code2, Search, Bell, LogOut, User, ChevronDown, Settings, Moon, Plus, Briefcase } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../contextAPI/userContext";
import ProfilePic from "./ProfilePic";

export default function Navbar({ location }) {
    // console.log(location)
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { userData } = useContext(UserContext)

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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/75 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-4 sm:px-8">

                {/* ---------------- Left: Logo ---------------- */}
                <div className="flex items-center gap-2 cursor-pointer select-none group transition-transform duration-300 hover:scale-105">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20 transition-transform duration-300 group-hover:rotate-6">
                        <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="mt-2 text-xl font-black tracking-tight">
                            <span className="text-slate-900">Co</span>
                            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                DO
                            </span>
                        </h3>
                    </div>
                </div>

                {/* ===> this will set according to variant */}
                {/* ---------------- Right Side Items ---------------- */}

                {location === "landing" ?
                    (<div className="flex items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login" 
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 hover:-translate-y-0.5"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup" 
                                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>)
                    : location === "user" ?
                        (
                            <div className="flex items-center gap-4 md:gap-6">

                                {/* Responsive Search Bar (Hidden on smaller screens) */}
                                <div className="hidden md:flex relative w-full max-w-[240px] lg:max-w-xs group">
                                    <Search 
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-violet-500 group-focus-within:rotate-90"
                                        size={16} 
                                    />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search people, events, skills..."
                                        className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/70 shadow-sm focus:shadow-md"
                                    />
                                </div>

                                {/* Bell Icon */}
                                <button className="relative rounded-full p-2 text-slate-500 transition-all hover:bg-violet-50 hover:text-violet-600 active:scale-95 group">
                                    <Bell size={20} strokeWidth={2} />
                                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                                </button>

                                {/* User Profile & Dropdown */}
                                <div className="relative   inline-block" ref={dropdownRef}>
                                    {/* Clickable Trigger Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        aria-expanded={isDropdownOpen}
                                        className="flex items-center h-12 px-2.5 pr-3 rounded-xl border border-slate-100  bg-white shadow-[0_4px_12px_rgba(0,0,0,.06)] hover:shadow-md hover:border-violet-200 transition-all"
                                    >
                                        <ProfilePic
                                            uname={userData.username} 
                                            className="h-9 w-9 shrink-0"
                                        />

                                        {/* Username (Hidden on mobile, visible on small screens and up) */}
                                        <div className="hidden sm:flex flex-col justify-center leading-tight ml-2">
                                            <span className="text-sm font-semibold text-slate-900">
                                                {userData.firstname || userData.username}
                                            </span>
                                            <span className="text-[11px] text-slate-500">Student</span>
                                        </div>

                                        {/* Dropdown Arrow Indicator */}
                                        <ChevronDown
                                            size={18}
                                            className={`hidden sm:block text-slate-400 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                                            {/* User Info Header */}
                                            <div className="flex items-center gap-2.5 p-2 mb-1 border-b border-slate-100">
                                                <ProfilePic uname={userData.username} className="h-10 w-10 shrink-0" />
                                                <div className="flex flex-col justify-center leading-tight">
                                                    <span className="text-sm font-semibold text-slate-900 truncate">
                                                        {userData.firstname || userData.username}
                                                    </span>
                                                    <span className="text-xs text-slate-500">Student</span>
                                                </div>
                                            </div>

                                            <div className="py-1">
                                                {[
                                                    { label: "User Profile", icon: User, path: `/user/${userData.username}/profile` },
                                                    { label: "Notifications", icon: Bell, path: `/user/${userData.username}/inbox` },
                                                    { label: "Settings", icon: Settings, path: '#' },
                                                    { label: "Dark Mode", icon: Moon, path: '#' },
                                                ].map(item => (
                                                    <Link
                                                        key={item.label}
                                                        to={item.path}
                                                        onClick={() => setIsDropdownOpen(false)}
                                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-violet-50 hover:text-violet-700 hover:translate-x-1 focus:bg-violet-50 focus:outline-none"
                                                    >
                                                        <item.icon size={16} className="text-slate-400" />
                                                        {item.label}
                                                        {item.label === 'Notifications' && <span className="ml-auto text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">3</span>}
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="my-1 h-px w-full bg-slate-100"></div>

                                            {/* Logout Link */}
                                            <Link
                                                to='/logout'
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700 hover:translate-x-1 focus:bg-red-50 focus:outline-none"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                        : location === "organization" ?
                            (
                                <div className="flex items-center gap-2 md:gap-4">
                                    {/* Search Bar for Org */}
                                    <div className="hidden lg:flex relative w-full max-w-[240px] group">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-violet-500" size={16} />
                                        <input
                                            placeholder="Search Events..."
                                            className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-200/70 shadow-sm focus:shadow-md"
                                        />
                                    </div>
                                    <Link to={`/organization/${userData.username}/create/event`} className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-4 py-2 rounded-full text-xs transition-all shadow-md shadow-violet-500/30 hover:shadow-lg hover:shadow-violet-500/40 hover:scale-105 active:scale-95 hover:-translate-y-0.5">
                                        <Plus size={14} /> Create Event
                                    </Link>
                                    {/* User Profile & Dropdown */}
                                    <div className="relative inline-block" ref={dropdownRef}>
                                        {/* Clickable Trigger Button */}
                                        <button
                                            type="button" 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            aria-expanded={isDropdownOpen}
                                            className="flex items-center h-12 px-2.5 pr-3 rounded-xl border border-slate-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,.06)] hover:shadow-md hover:border-violet-200 transition-all"
                                        >
                                            <ProfilePic
                                                uname={userData.username} 
                                                 className="h-9 w-9 shrink-0"
                                            />

                                            <div className="hidden sm:flex flex-col justify-center leading-tight ml-2">
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {userData.organization_name || userData.username}
                                                </span>
                                                <span className="text-[11px] text-slate-500">Organization</span>
                                            </div>

                                            {/* Dropdown Arrow Indicator */}
                                            <ChevronDown
                                                size={18}
                                                className={`hidden sm:block text-slate-400 ml-1 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {/* Dropdown Menu */}
                                        {isDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                                                {/* User Info Header */}
                                                <div className="flex items-center gap-2.5 p-2 mb-1 border-b border-slate-100">
                                                    <ProfilePic uname={userData.username} className="h-10 w-10 shrink-0" />
                                                    <div className="flex flex-col justify-center leading-tight">
                                                        <span className="text-sm font-semibold text-slate-900 truncate">
                                                            {userData.organization_name || userData.username}
                                                        </span>
                                                        <span className="text-xs text-slate-500">Organization</span>
                                                    </div>
                                                </div>

                                                <div className="py-1">
                                                    {[
                                                        { label: "Org Profile", icon: Briefcase, path: `/organization/${userData.username}/profile` },
                                                        { label: "Manage Events", icon: Plus, path: `/organization/${userData.username}/create/event` },
                                                        { label: "Settings", icon: Settings, path: '#' },
                                                    ].map(item => (
                                                        <Link
                                                            key={item.label}
                                                            to={item.path}
                                                            onClick={() => setIsDropdownOpen(false)}
                                                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-violet-50 hover:text-violet-700 hover:translate-x-1 focus:bg-violet-50 focus:outline-none"
                                                        >
                                                            <item.icon size={16} className="text-slate-400" />
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                </div>

                                                <div className="my-1 h-px w-full bg-slate-100"></div>

                                                {/* Logout Link */}
                                                <Link
                                                    to='/logout'
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:text-red-700 hover:translate-x-1 focus:bg-red-50 focus:outline-none"
                                                >
                                                    <LogOut size={16} />
                                                    Logout
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                            : null
                }
            </div>
        </header>
    );
}


import {
    House,
    CalendarDays,
    SquarePlus,
    Calendar,
    Compass,
    Users
} from "lucide-react";


const navItems = {
    user: [
        { name: "home", icon: House, path: "user" },
        { name: "events", icon: Compass, path: "events" },
        { name: "calendar", icon: CalendarDays, path: "calendar" },
        { name: "collabrate", icon: Users, path: "collabrate" },
        { name: "notifications", icon: Bell, path: "inbox" },
        { name: "profile", icon: User, path: 'profile' },
    ],

    organization: [
        { name: "home", icon: House, path: "organization" },
        { name: "events Hub", icon: Compass, path: "events" },
        { name: "calendar", icon: CalendarDays, path: "calendar" },
        { name: "manage Events", icon: SquarePlus, path: "create/event" },
        { name: "profile", icon: User, path: 'profile' },
    ]
};
export function BottomDock({ location }) {
    const { userData } = useContext(UserContext);

    let current_bottom_nav = []
    if (location === "user") {
        current_bottom_nav = navItems.user;
    } else if (location === "organization") {
        current_bottom_nav = navItems.organization;
    }
    if (location === "landing" || current_bottom_nav.length === 0) return null;

    return (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-md">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl">

                {current_bottom_nav.map((item) => {
                    const Icon = item.icon;
                    const isCreateEvent = item.path === "create/event";
                    let path = "";
                    if (item.name === "home") {
                        path = location === "user" ? `/user/${userData.username}` : `/organization/${userData.username}`;
                    } else if (item.name === "profile") {
                        path = location === "user" ? `/user/${userData.username}/profile` : `/organization/${userData.username}/profile`;
                    } else {
                        path = location === "user" ? `/user/${userData.username}/${item.path}` : `/organization/${userData.username}/${item.path}`;
                    }                    
                    return (
                        <NavLink
                            key={item.name}
                            to={path}
                            end={item.name === "home"}
                            className={({ isActive }) =>
                                `group flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ease-in-out
                                ${
                                    isActive
                                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30"
                                        : isCreateEvent
                                            ? "bg-slate-800 text-white opacity-70 hover:bg-slate-900 hover:text-white hover:-translate-y-1 hover:shadow-md hover:opacity-100"
                                            : "text-slate-500 opacity-70 hover:-translate-y-1 hover:bg-white hover:text-violet-600 hover:shadow-md hover:opacity-100"
                                }`
                            }
                        >
                            <Icon // Icon is now directly rendered, no conditional text
                                size={22} 
                                strokeWidth={2.2}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />                            
                        </NavLink>
                    );
                })}
            </div>
        </div >
    );
}
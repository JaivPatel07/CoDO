import { useState, useRef, useEffect, useContext } from "react";
import { Code2, Search, Bell, LogOut, User, ChevronDown } from "lucide-react";
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
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xs">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* ---------------- Left: Logo ---------------- */}
                <div className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
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
                                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
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
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-violet-500"
                                        size={16}
                                    />
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search CoDO..."
                                        className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:w-[105%] focus:-ml-[2.5%] focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 shadow-inner"
                                    />
                                </div>

                                {/* Bell Icon */}
                                <button className="relative rounded-full p-2 text-slate-500 transition-all hover:bg-violet-50 hover:text-violet-600 active:scale-95">
                                    <Bell size={20} strokeWidth={2} />
                                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                                </button>

                                {/* User Profile & Dropdown */}
                                <div className="relative inline-block border rounded-2xl" ref={dropdownRef}>
                                    {/* Clickable Trigger Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        aria-expanded={isDropdownOpen}
                                        className="flex items-center gap-2 rounded border border-gray-200 bg-white px-2 p-1 pr-3 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1"
                                    >
                                        <ProfilePic
                                            uname={userData.username}
                                            className="h-8 w-8"
                                        />

                                        {/* Username (Hidden on mobile, visible on small screens and up) */}
                                        <span className="hidden mb-1 sm:block text-base font-medium text-gray-700">
                                            {userData.username}
                                        </span>

                                        {/* Dropdown Arrow Indicator */}
                                        <ChevronDown
                                            size={16}
                                            className={`hidden sm:block text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                                            {/* Mobile-only User Info Header */}
                                            <div className="block sm:hidden px-3 py-2 mb-1 border-b border-gray-100">
                                                <p className="text-xs text-gray-500">Signed in as</p>
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {userData.username}
                                                </p>
                                            </div>

                                            {/* Profile Link */}
                                            <Link
                                                to={`/user/profile/${userData.username}`}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:outline-none"
                                            >
                                                <User size={18} />
                                                Profile
                                            </Link>

                                            <div className="my-1 h-px w-full bg-gray-100"></div>

                                            {/* Logout Link */}
                                            <Link
                                                to='/logout'
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:outline-none"
                                            >
                                                <LogOut size={18} />
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                        : location === "organization" ?
                            (
                                <div className="flex items-center gap-4 md:gap-6">

                                    {/* User Profile & Dropdown */}
                                    <div className="relative inline-block border rounded-2xl" ref={dropdownRef}>
                                        {/* Clickable Trigger Button */}
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            aria-expanded={isDropdownOpen}
                                            className="flex items-center gap-2 rounded border border-gray-200 bg-white px-2 p-1 pr-3 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1"
                                        >
                                            <ProfilePic
                                                uname={userData.username}
                                                className="h-8 w-8"
                                            />

                                            {/* Username (Hidden on mobile, visible on small screens and up) */}
                                            <span className="hidden mb-1 sm:block text-base font-medium text-gray-700">
                                                {userData.username}
                                            </span>

                                            {/* Dropdown Arrow Indicator */}
                                            <ChevronDown
                                                size={16}
                                                className={`hidden sm:block text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>

                                        {/* Dropdown Menu */}
                                        {isDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                                                {/* Mobile-only User Info Header */}
                                                <div className="block sm:hidden px-3 py-2 mb-1 border-b border-gray-100">
                                                    <p className="text-xs text-gray-500">Signed in as</p>
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {userData.username}
                                                    </p>
                                                </div>

                                                {/* Profile Link */}
                                                <Link
                                                    to={`/organization/profile/${userData.username}`}
                                                    onClick={() => setIsDropdownOpen(false)}                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:outline-none"
                                                >
                                                    <User size={18} />
                                                    Profile
                                                </Link>

                                                <div className="my-1 h-px w-full bg-gray-100"></div>

                                                {/* Logout Link */}
                                                <Link
                                                    to='/logout'
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:outline-none"
                                                >
                                                    <LogOut size={18} />
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
    Compass
} from "lucide-react";


const navItems = {
  user: [
    { name: "Home", icon: House, path: "/user" },
    { name: "Events", icon: Compass, path: "/events" },
    { name: "Calendar", icon: CalendarDays, path: "/calendar" },
    { name: "Search", icon: Search, path: "/user/search" },
    { name: "Notifications", icon: Bell, path: "/user/inbox" },
    { name: "Profile", icon: User },
  ],

  organization: [
    { name: "Home", icon: House, path: "/organization" },
    { name: "Events Hub", icon: Compass, path: "/events" },
    { name: "Calendar", icon: CalendarDays, path: "/calendar" },
    { name: "Manage Events", icon: SquarePlus, path: "/organization/events" },
    { name: "Profile", icon: User },
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
        <div className="fixed bottom-4 left-3 right-3 z-50 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div
                className="flex items-center justify-between rounded-full border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.15)] px-3 py-2 transition-all duration-300"
            >
                
                {current_bottom_nav.map((item) => {
                    const Icon = item.icon;
                    const profilePath = location === "user" ? `/user/profile/${userData.username}` : `/organization/profile/${userData.username}`;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.name === "Profile" && userData?.username ? profilePath : item.path}
                            className={({ isActive }) =>
                                `group relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300
                                ${isActive
                                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 scale-110"
                                    : "text-slate-500 hover:bg-white/80 hover:text-violet-600 hover:-translate-y-1 hover:scale-105 active:scale-95"
                                }`
                            }
                        >
                            <Icon
                                size={22}
                                strokeWidth={2.2}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />

                            {/* Tooltip */}
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    -top-11
                                    rounded-lg
                                    bg-slate-900
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-medium
                                    text-white
                                    opacity-0
                                    shadow-lg
                                    transition-all
                                    duration-300
                                    group-hover:-translate-y-1
                                    group-hover:opacity-100
                                    whitespace-nowrap
                                    hidden sm:block
                                "
                            >
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}
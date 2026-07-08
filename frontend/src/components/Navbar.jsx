import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../contextAPI/userContext";
import ProfilePic from "./ProfilePic";

// ─────────────────────────────────────────────────────────────────────────────
// Shared logout helper
// ─────────────────────────────────────────────────────────────────────────────
function logout() {
    localStorage.clear();
    window.location.href = "/login";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Header NavBar  (default export)
// Supports three variants:
//   "landing"  → public landing page bar (no auth, Login / Get Started)
//   "app"      → authenticated bar, auto-adapts for student vs organisation
// ─────────────────────────────────────────────────────────────────────────────
export default function NavBar({ variant = "app" }) {
    const { userData } = useContext(UserContext);

    /* ── Landing variant ── */
    if (variant === "landing") {
        return (
            <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
                <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">

                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-base font-black text-white shadow-lg transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                            C
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">CoDO</span>
                    </Link>

                    {/* Nav Actions */}
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
                </nav>
            </header>
        );
    }

    /* ── Authenticated "app" variant ── */
    const accountType = localStorage.getItem("accountType");
    const isOrg = accountType === "organization";

    const homeTarget = isOrg ? "/organization" : "/user";
    const profileTarget = isOrg ? "/organization/profile" : "/user/profile";
    const username = userData?.username || "User";

    // Accent color that flips per account type
    const logoColor = isOrg
        ? "bg-gradient-to-br from-emerald-500 to-teal-600"
        : "bg-gradient-to-br from-indigo-500 to-violet-600";

    return (
        <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-7">

            {/* Logo */}
            <NavLink className="flex items-center gap-2.5 text-xl font-black text-slate-950" to={homeTarget}>
                <span className={`grid h-8 w-8 place-items-center rounded-lg text-white font-black transition-all ${logoColor}`}>
                    C
                </span>
                <span>CODO</span>
            </NavLink>

            {/* Right side: Profile + Logout */}
            <div className="flex items-center gap-3">
                {/* Profile Link */}
                <NavLink
                    to={profileTarget}
                    className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all ${
                            isActive
                                ? isOrg
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-indigo-50 text-indigo-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`
                    }
                >
                    {/* >>>>>>>alert<<<<<<< */}
                    {/* !!! do not change ProfilePic component — only change className from here */}
                    <ProfilePic uname={username} className="w-8 h-8 text-xs" />
                    <span className="hidden sm:block">{username}</span>
                </NavLink>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="text-xs font-bold text-slate-500 hover:text-red-600 px-3 py-1.5 border border-slate-200 rounded-lg hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified SideBar — dynamically renders student OR organisation nav links
// ─────────────────────────────────────────────────────────────────────────────
const studentLinks = [
    { to: "/user", label: "Home", end: true },
    { to: "/user/profile", label: "Profile" },     //do not write / before any other child link --> it will works as /user/profile
];

const orgLinks = [
    { to: "/organization", label: "Dashboard", end: true },
    { to: "/organization/profile", label: "Profile" },
];

export function SideBar() {
    const accountType = localStorage.getItem("accountType");
    const isOrg = accountType === "organization";

    const links = isOrg ? orgLinks : studentLinks;

    const activeClass = isOrg
        ? "bg-emerald-50 text-emerald-700"
        : "bg-indigo-50 text-indigo-700";

    const actionBtnClass = isOrg
        ? "rounded-lg bg-emerald-600 p-3 text-center font-bold text-white transition hover:bg-emerald-700 sm:mt-auto"
        : "rounded-lg bg-indigo-600 p-3 text-center font-bold text-white transition hover:bg-indigo-700 sm:mt-auto";

    return (
        <aside className="flex w-full flex-col gap-6 border-b border-slate-200 bg-white p-4 sm:w-56 sm:border-b-0 sm:border-r sm:p-5">
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            `rounded-lg px-3 py-3 text-sm font-semibold transition ${
                                isActive
                                    ? activeClass
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Action button: "Create Post" for students, nothing needed for orgs right now */}
            {!isOrg && (
                <NavLink className={actionBtnClass} to="/user/create-post">
                    Create Post
                </NavLink>
            )}

            {/* Logout at the bottom of sidebar (desktop only) */}
            <button
                onClick={logout}
                className="mt-auto hidden sm:block w-full py-2.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50/50 text-slate-600 hover:text-red-600 text-sm font-semibold transition cursor-pointer"
            >
                Log Out
            </button>
        </aside>
    );
}

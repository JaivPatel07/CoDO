import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../contextAPI/userContext";
import ProfilePic from "./ProfilePic";

const links = [
    { to: "", label: "Home", end: true },
    { to: "profile", label: "Profile" }  //do not write / before any other child link --> it will works as /user/profile
];

export default function NavBar({ variant = "app" }) {

    const { userData } = useContext(UserContext)

    if (variant === "landing") {
        return (
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
                <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link className="flex items-center gap-3 text-xl font-bold text-slate-950" to="/">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">C</span>
                        <span>CoDO</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            to="/login"
                        >
                            Login
                        </Link>
                        <Link
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </header>
        )
    }

    return (
        <header className="flex h-auto items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:h-[72px] sm:px-7 sm:py-0">
            <NavLink className="flex items-center gap-3 text-xl font-bold text-slate-950" to="">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">C</span>
                <span>CODO</span>
            </NavLink>

            <div className="flex items-center gap-3">
                <NavLink className="flex items-center gap-3 text-slate-950" to="profile">
                    <span className="hidden text-right sm:grid">
                        <strong>{userData.username}</strong>

                        {/* user Profile hoy to ana display kara or user na name nu first letter display kara  */}
                        {/* className will be give as per necessativy and it goes to Profilpic component*/}


                        {/* >>>>>>alert<<<<<<  */}
                        {/* !!! do not change ProfilePic component  just change it from here className */}
                        <ProfilePic uname={userData.username} className="w-10 h-10 text-sm"/>                   
                    </span>
                </NavLink>
            </div>
        </header>
    )
}

export function SideBar() {
    return (
        <aside className="flex w-full flex-col gap-6 border-b border-slate-200 bg-white p-4 sm:w-56 sm:border-b-0 sm:border-r sm:p-5">
            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={`/user${link.to === "/" ? "" : link.to}`}
                        end={link.end}
                        className={({ isActive }) =>
                            `rounded-lg px-3 py-3 text-sm font-semibold transition ${isActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                            }`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <NavLink className="rounded-lg bg-indigo-600 p-3 text-center font-bold text-white transition hover:bg-indigo-700 sm:mt-auto" to="/user/create-post">Create Post</NavLink>
        </aside>
    )
}

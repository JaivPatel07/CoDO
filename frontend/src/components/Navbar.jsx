import { NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Home", end: true },
    { to: "/discover", label: "Discover" },
    { to: "/events", label: "Events" },
    { to: "/teams", label: "Teams" },
    { to: "/messages", label: "Messages" },
    { to: "/connections", label: "Connections" },
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
];

export default function NavBar() {
    return (
        <header className="top-navbar">
            <NavLink className="brand" to="/">
                <span className="brand-mark">C</span>
                <span>CODO</span>
            </NavLink>

            <div className="navbar-actions">
                <NavLink className="profile-mini" to="/profile">
                    <span>
                        <strong>Aditya Sharma</strong>
                        
                    </span>
                    <span className="avatar">AS</span>
                </NavLink>
            </div>
        </header>
    )
}

export function SideBar() {
    return (
        <aside className="sidebar">
            <nav className="nav-links">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <NavLink className="create-button" to="/create-post">Create Post</NavLink>
        </aside>
    )
}

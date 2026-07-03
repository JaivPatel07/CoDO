import { NavLink } from "react-router-dom";

const links = [
    { to: "/user", label: "Home", end: true },
    { to: "profile", label: "Profile" }  //do not write / before any other child link --> it will works as /user/profile
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

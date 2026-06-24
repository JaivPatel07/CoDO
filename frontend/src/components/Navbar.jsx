import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <div style={{display:"flex",justifyContent:"space-between",background:'grey',fontSize:'x-large'}}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/profile">Profile</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">SignUp</NavLink>
        </div>
    )
}
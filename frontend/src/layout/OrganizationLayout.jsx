import { Outlet, useNavigate } from "react-router-dom";
import NavBar from '../components/Navbar' // Assuming a shared Navbar
import { useEffect } from "react";

export default function OrganizationLayout() {
    const navigate = useNavigate()

    useEffect(() => {
        const accountType = localStorage.getItem("accountType");
        const accessToken = localStorage.getItem("access");

        if (!accessToken || accountType !== "organization") {
            navigate('/login/organization');
        }
    }, [navigate])


    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
            {/* A simple navbar can be used here. You might want a different one for organizations. */}
            <NavBar />
            <div className="flex flex-1 flex-col sm:flex-row">
                <main className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
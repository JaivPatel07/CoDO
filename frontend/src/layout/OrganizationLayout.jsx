import { Outlet, useNavigate } from "react-router-dom";
import NavBar, { BottomDock } from '../components/Navbar';
import { fetch_user } from "../api/user_apis";
import { useContext, useEffect } from "react";
import { UserContext } from "../contextAPI/userContext";
import Footer from '../components/Footer';

export default function OrganizationLayout() {
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        const getUser = async () => {
            try {
                // fetch_user is generic and works for any authenticated user
                const response = await fetch_user();
                setUserData(response.data);
            } catch (err) {
                // Do not redirect if we are on the public profile route
                if (!window.location.pathname.startsWith('/organization/profile/')) {
                    navigate('/login');
                }
            }
        };

        // Only fetch if userData is not already loaded
        if (!userData?.username) {
            getUser();
        }
    }, [userData, setUserData, navigate]);

    const isLogged = !!userData?.username;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
            <NavBar location={isLogged ? "organization" : "landing"} username={userData?.username} />

            <main className="flex-1 p-4 sm:p-8">
                <Outlet />
            </main>

            {isLogged && <BottomDock location={"organization"} username={userData?.username} />}
            <Footer />
        </div>
    );
}
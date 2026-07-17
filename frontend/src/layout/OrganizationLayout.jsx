import { Outlet, useNavigate, useParams } from "react-router-dom";
import NavBar, { BottomDock } from '../components/Navbar';
import { fetch_user } from "../api/user_apis";
import { useContext, useEffect } from "react";
import { UserContext } from "../contextAPI/userContext";
import Footer from '../components/Footer';

export default function OrganizationLayout() {
    const organization_name = localStorage.getItem('username')
    console.log("orglayout",organization_name)
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        const getUser = async() => {
            try {
                const response = await fetch_user(organization_name)
                setUserData(response.data)
            }
            catch (err) {
                navigate('/*')
                return null
            }
        }
        getUser()
    }, []);

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
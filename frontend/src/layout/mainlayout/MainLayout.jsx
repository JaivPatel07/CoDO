import { Outlet, useNavigate } from "react-router-dom";
import NavBar, { BottomDock } from '../../components/Navbar'
import { fetch_profile, fetch_user } from "../../api/user_apis";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contextAPI/userContext";
import Footer from '../../components/Footer'
import ProfileForm from "../../pages/User_Pages/ProfileForm/ProfileForm";

export default function MainLayout() {
    const navigate = useNavigate()
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);

    const { userData, setUserData, setProfileData, profileData } = useContext(UserContext)
    // this methoh will check wheather the user has jwt token or not 
    // if token not found then redirest it to landing page (for now only after we will change)

    useEffect(() => {
        const getUser = async() => {
            try {
                const response = await fetch_user()
                setUserData(response.data)
            }
            catch (err) {
                if (!window.location.pathname.startsWith('/user/profile/')) {
                    navigate('/login')
                }
            }
        }
        const getProfile = async() => {
            try {
                const response = await fetch_profile()
                setProfileData(response.data)
            }
            catch (err) {
                const msg = err?.response?.data?.message || err?.response?.data?.detail || "";
                if (msg.toLowerCase().includes("not found") && !window.location.pathname.startsWith('/user/profile/')) {
                    setIsProfileFormOpen(true);
                    setIsCompulsory(true);
                }
            }
        }
        getUser()
        getProfile()
    },[])

    const isLogged = !!userData?.username;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
            <NavBar location={isLogged ? "user" : "landing"} username={userData?.username} />

            <div className="flex flex-1 flex-col sm:flex-row">
                <main className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>

            {isLogged && <BottomDock location={"user"} username={userData?.username} />}

            <ProfileForm
                isOpen={isProfileFormOpen}
                isCompulsory={isCompulsory}
                onClose={() => {
                    if (!isCompulsory) setIsProfileFormOpen(false);
                }}
                onSuccess={(newProfile) => {
                    setProfileData(newProfile);
                    setIsProfileFormOpen(false);
                    setIsCompulsory(false);
                }}
                initialData={profileData && Object.keys(profileData).length > 0 ? profileData : null}
            />
            <Footer />
        </div>
    )
}

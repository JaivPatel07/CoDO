import { Outlet, useNavigate, useParams } from "react-router-dom";
import NavBar, { BottomDock } from '../components/Navbar';
import { fetch_user } from "../api/user_apis";
import { fetch_organization_profile } from "../api/public_apis";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contextAPI/userContext";
import Footer from '../components/Footer';
import OrganizationProfileForm from "../pages/Organization_Pages/OrganizationProfileForm";

export default function OrganizationLayout() {
    const loggedInUser = localStorage.getItem('username');
    const accountType = localStorage.getItem('accountType');
    const { organization_name } = useParams();
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);
    
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
    const [isCompulsory, setIsCompulsory] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const getUser = async() => {
            try {
                const response = await fetch_user(loggedInUser)
                setUserData(response.data)
            }
            catch (err) {
                navigate('/*')
                return null
            }
        }
        
        const getProfile = async() => {
            if (accountType !== 'organization' || loggedInUser !== organization_name) {
                return;
            }
            try {
                const response = await fetch_organization_profile(loggedInUser)
                setProfileData(response)
            }
            catch (err) {
                const msg = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data?.error || err?.detail || err?.error || "";
                if ((err?.response?.status === 404 || msg.toLowerCase().includes("not found")) && !window.location.pathname.startsWith(`/organization/${loggedInUser}/profile`)) {
                    setIsProfileFormOpen(true);
                    setIsCompulsory(true);
                }
            }
        }
        
        getUser()
        getProfile()
    }, [loggedInUser, organization_name, accountType, navigate]);

    const isLogged = !!userData?.username;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
            <NavBar location={isLogged ? (accountType === 'student' ? 'user' : 'organization') : "landing"} username={userData?.username} />

            <main className="flex-1 p-4 sm:p-8">
                <Outlet />
            </main>

            {isLogged && <BottomDock location={accountType === 'student' ? 'user' : 'organization'} username={userData?.username} />}
            
            <OrganizationProfileForm
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
    );
}
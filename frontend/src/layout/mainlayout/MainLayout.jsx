import { Outlet, useNavigate } from "react-router-dom";
import NavBar, { SideBar } from '../../components/Navbar'
import { fetch_profile, fetch_user } from "../../api/user_apis";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contextAPI/userContext";

export default function MainLayout() {
    const navigate = useNavigate()

    const {setUserData,setProfileData} = useContext(UserContext)
    // this methoh will check wheather the user has jwt token or not 
    // if token not found then redirest it to landing page (for now only after we will change)

    useEffect(() => {
        const getUser = async() => {
            try {
                const response = await fetch_user()
                setUserData(response.data)
                // console.log(response)
            }
            catch (err) {
                navigate('/login')
            }
        }
        const getProfile = async() => {
            try {
                const response = await fetch_profile()
                setProfileData(response.data)
                // console.log(response.data)
            }
            catch (err) {
                console.log(err.response.data)
            }
        }
        getUser()
        getProfile()
    },[])


    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
            <NavBar />
            <div className="flex flex-1 flex-col sm:flex-row">
                <SideBar />
                <main className="flex-1 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

import { Outlet } from "react-router-dom";
import NavBar, { SideBar } from '../../components/Navbar'

export default function MainLayout() {

    // this methoh will check wheather the user has jwt token or not 
    // if token not found then redirest it to landing page (for now only after we will change)

    


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

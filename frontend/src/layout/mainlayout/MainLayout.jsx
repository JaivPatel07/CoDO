import { Outlet } from "react-router-dom";
import NavBar, { SideBar } from '../../components/Navbar'

export default function MainLayout() {

    // this methoh will check wheather the user has jwt token or not 
    // if token not found then redirest it to landing page (for now only after we will change)

    


    return (
        <div className="app-shell">
            <NavBar />
            <div className="body-shell">
                <SideBar />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

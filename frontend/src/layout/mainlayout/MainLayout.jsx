import { Outlet } from "react-router-dom";
import NavBar, { SideBar } from '../../components/Navbar'

export default function MainLayout() {
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

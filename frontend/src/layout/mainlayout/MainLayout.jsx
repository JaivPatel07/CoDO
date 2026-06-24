import { Outlet } from "react-router-dom";
import NavBar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function MainLayout() {
    return (
        <div>

        <NavBar />

        {/* outlet j pan url child url par request ava and ama combine karin n mokla  */}
        <Outlet />
        <Footer />

        </div>
    )
}
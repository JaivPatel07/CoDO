import { Route, Routes } from "react-router-dom";
import MainLayout from '../layout/mainlayout/MainLayout'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import LandingPage from "../pages/LandingPage/LandingPage";
import ProfileForm from "../pages/ProfileForm/ProfileForm";

function ComingSoonPage({ title }) {
  return (
    <section className="page-panel">
      <p className="eyebrow">CODE</p>
      <h1>{title}</h1>
      <p>Coming soon.</p>
    </section>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />



      <Route path="user" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profileform" element={<ProfileForm />} />
      </Route>

      <Route path="/organization" element={<h1>Avaliable Soonnn!!!!</h1>} />
    </Routes>
  )
}

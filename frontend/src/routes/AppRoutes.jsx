import { Route, Routes } from "react-router-dom";
import MainLayout from '../layout/mainlayout/MainLayout'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage, { SignupChoicePage } from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import LandingPage from "../pages/LandingPage/LandingPage";

function ComingSoonPage({ title }) {
  return (
    <section className="min-h-[420px] rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="mb-2 text-sm font-bold uppercase text-indigo-600">CoDO</p>
      <h1 className="mb-3 text-3xl font-bold text-slate-950">{title}</h1>
      <p className="text-slate-600">Coming soon.</p>
    </section>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupChoicePage />} />
      <Route path="/signup/student" element={<SignupPage />} />

      <Route path="/user" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<ComingSoonPage title="Discover" />} />
        <Route path="events" element={<ComingSoonPage title="Events" />} />
        <Route path="teams" element={<ComingSoonPage title="Teams" />} />
        <Route path="messages" element={<ComingSoonPage title="Messages" />} />
        <Route path="connections" element={<ComingSoonPage title="Connections" />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<ComingSoonPage title="Settings" />} />
        <Route path="create-post" element={<ComingSoonPage title="Create Post" />} />
      </Route>

      <Route path="/organization" element={<ComingSoonPage title="Organization Signup" />} />
    </Routes>
  )
}

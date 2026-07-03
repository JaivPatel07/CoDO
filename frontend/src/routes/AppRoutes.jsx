import { Route, Routes } from "react-router-dom";
import MainLayout from '../layout/mainlayout/MainLayout'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Auth/LoginPage'
import OrganizationLoginPage from '../pages/Auth/OrganizationLoginPage'
import SignupPage, { OrganizationSignupPage, SignupChoicePage } from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/UserProfile/ProfilePage'
import LandingPage from "../pages/LandingPage/LandingPage";
import ProfileForm from "../pages/ProfileForm/ProfileForm";

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
      <Route path="/login/organization" element={<OrganizationLoginPage />} />
      <Route path="/signup" element={<SignupChoicePage />} />
      <Route path="/signup/student" element={<SignupPage />} />
      <Route path="/signup/organization" element={<OrganizationSignupPage />} />



      <Route path="user" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profileform" element={<ProfileForm />} />
      </Route>

      {/* <Route path="organization" element={}>

        <Route path="/organization" element={<OrganizationLoginPage />} />
        <Route path="/organization/profile" element={<ComingSoonPage title="Organization Profile" />} />
      </Route> */}
    </Routes>
  )
}

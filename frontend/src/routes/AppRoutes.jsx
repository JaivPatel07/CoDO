import { Route, Routes } from "react-router-dom";
import MainLayout from '../layout/mainlayout/MainLayout'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage, { OrganizationSignupPage, SignupChoicePage } from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/User_Pages/UserProfile/ProfilePage'
import LandingPage from "../pages/LandingPage/LandingPage";
import ProfileForm from "../pages/User_Pages/ProfileForm/ProfileForm";
import OrganizationLayout from "../layout/OrganizationLayout";
import OrganizationProfilePage from "../pages/Organization_Pages/OrganizationProfilePage";
import Logout from "../pages/User_Pages/Logout";
import { Flag } from "lucide-react";
import HomePage from "../pages/User_Pages/Home/HomePage";
import PageNotFound from "../pages/Page_not_found";
import PublicProfilePage from "../pages/User_Pages/PublicProfile";

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
      <Route path="/logout" element={<Logout />} />
      <Route path="/signup/student" element={<SignupPage />} />
      <Route path="/signup/organization" element={<OrganizationSignupPage />} />
      <Route path="/u/profile/:uname" element={<PublicProfilePage />} />


      <Route path="/user" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<PageNotFound />}/>
      </Route>

      <Route path="organization" element={<OrganizationLayout />}>
        <Route index element={<ComingSoonPage title="Organization Dashboard" />} />
        <Route path="dashboard" element={<ComingSoonPage title="Organization Dashboard" />} />
        <Route path="profile" element={<OrganizationProfilePage />} />
        <Route path="*" element={<PageNotFound />}/>
      </Route>


      <Route path="*" element={<PageNotFound />}/>
    </Routes>
  )
}

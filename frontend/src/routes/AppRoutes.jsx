import { Route, Routes, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../contextAPI/userContext";
import NavBar, { BottomDock } from '../components/Navbar';
import Footer from '../components/Footer';
import { fetch_user } from "../api/user_apis";

import MainLayout from '../layout/mainlayout/MainLayout'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage, { OrganizationSignupPage, SignupChoicePage } from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/User_Pages/UserProfile/ProfilePage'
import LandingPage from "../pages/LandingPage/LandingPage";
import ProfileForm from "../pages/User_Pages/ProfileForm/ProfileForm";
import OrganizationLayout from "../layout/OrganizationLayout";
import OrganizationProfilePage from "../pages/Organization_Pages/OrganizationProfilePage";
import Logout from "../pages/User_Pages/Logout";
import HomePage from "../pages/User_Pages/Home/HomePage";
import PageNotFound from "../pages/Page_not_found";

import EventsPage from "../pages/Events/EventsPage";
import EventDetailsPage from "../pages/Events/EventDetailsPage";
import CalendarPage from "../pages/Events/CalendarPage";
import EventFormPage from "../pages/Organization_Pages/EventFormPage";
import OrganizationEventsPage from "../pages/Organization_Pages/OrganizationEventsPage";
import CollaborationHomePage from "../pages/User_Pages/collabration/CollabrationHomePage";
import OrganizationDashboardPage from "../pages/Organization_Pages/OrganizationDashboardPage";
import UserPostForm from "../pages/User_Pages/UserPostForm";
import SettingsPage from "../pages/User_Pages/SettingsPage";
import NotificationPage from "../pages/User_Pages/NotificationPage";
import PostManagePage from "../pages/User_Pages/PostManagePage";
import ChatPage from "../pages/ChatPages/ChatPage";
import Suggestions from "../pages/Network/Suggestions";
import GithubCallback from "../pages/Auth/GitHub/githublogin";
import { WorkSpaceHomePage } from "../pages/WorkSpace/WorkSpaceHomePage";
import WorkSpacePage from "../pages/WorkSpace/WorkSpacePage";


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
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupChoicePage />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/signup/student" element={<SignupPage />} />
      <Route path="/signup/organization" element={<OrganizationSignupPage />} />





      {/* Organization */}
      <Route path="/organization/:organization_name" element={<OrganizationLayout />}>
        <Route index element={<OrganizationDashboardPage />} />


        {/* org public+private Profiles */}
        <Route path="/organization/:organization_name/profile" element={<OrganizationProfilePage />} />


        {/* Real Events Management Routes */}
        <Route path="events" element={<OrganizationEventsPage />} />
        <Route path="create/event" element={<EventFormPage />} />
        <Route path="events/edit/:id" element={<EventFormPage />} />
        <Route path="event/:event_id" element={<EventDetailsPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* <Route path="profile" element={<OrganizationProfilePage />} /> */}
        <Route path="*" element={<PageNotFound />} />
      </Route>


      {/* github path  */}
      {/* ---> do not change it   */}
      <Route path="/github/callback" element={<GithubCallback />}/>

      {/* student public+ private profile  */}

      {/* Student */}
      <Route path="/user/:user_name" element={<MainLayout />}>
        <Route path="/user/:user_name/profile" element={<ProfilePage />} />
        <Route index element={<HomePage />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* --> show all event  */}
        <Route path="events" element={<EventsPage />} />

        {/* --> to open particular event details page  */}
        <Route path="event/:event_id" element={<EventDetailsPage />} />

        <Route path="notification" element={<NotificationPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="collabrate" element={<CollaborationHomePage />} />
        <Route path="createpost" element={<UserPostForm />} />
        <Route path="managepost/:postId" element={<PostManagePage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="workspaces" element={<WorkSpaceHomePage />} />
        <Route path="workspace/team/:team_id" element={<WorkSpacePage />} />
        <Route path="*" element={<PageNotFound />} />


        <Route path="suggestions" element={<Suggestions />} />

      </Route>

      <Route path="*" element={<PageNotFound />} />

    </Routes>
  )
}

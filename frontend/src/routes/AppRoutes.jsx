import { Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

import MainLayout from "../layout/mainlayout/MainLayout";
import OrganizationLayout from "../layout/OrganizationLayout";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/Auth/LoginPage";
import Logout from "../pages/User_Pages/Logout";
import HomePage from "../pages/User_Pages/Home/HomePage";
import ProfilePage from "../pages/User_Pages/UserProfile/ProfilePage";
import PageNotFound from "../pages/Page_not_found";

// ── Code splitting ───────────────────────────────────────────────────────────
// Everything below is only needed once the user is past the landing page, so it
// is fetched on demand. This keeps the initial bundle small and the first
// paint fast.
const SignupPage = lazy(() => import("../pages/Auth/SignupPage"));
const OrganizationSignupPage = lazy(() =>
  import("../pages/Auth/SignupPage").then((m) => ({
    default: m.OrganizationSignupPage,
  }))
);
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("../pages/TermsOfService"));
const ForgotPasswordPage = lazy(() =>
  import("../pages/Auth/ForgotPassword/ForgotPasswordPage")
);
const VerifyOTPPage = lazy(() =>
  import("../pages/Auth/ForgotPassword/VerifyOTPPage")
);
const ResetPasswordPage = lazy(() =>
  import("../pages/Auth/ForgotPassword/ResetPasswordPage")
);
const GithubCallback = lazy(() => import("../pages/Auth/GitHub/githublogin"));
const OrganizationProfilePage = lazy(() =>
  import("../pages/Organization_Pages/OrganizationProfilePage")
);
const EventsPage = lazy(() => import("../pages/Events/EventsPage"));
const EventDetailsPage = lazy(() => import("../pages/Events/EventDetailsPage"));
const CalendarPage = lazy(() => import("../pages/Events/CalendarPage"));
const EventFormPage = lazy(() =>
  import("../pages/Organization_Pages/EventFormPage")
);
const OrganizationEventsPage = lazy(() =>
  import("../pages/Organization_Pages/OrganizationEventsPage")
);
const OrganizationDashboardPage = lazy(() =>
  import("../pages/Organization_Pages/OrganizationDashboardPage")
);
const CollaborationHomePage = lazy(() =>
  import("../pages/User_Pages/collabration/CollabrationHomePage")
);
const UserPostForm = lazy(() => import("../pages/User_Pages/UserPostForm"));
const SettingsPage = lazy(() => import("../pages/User_Pages/SettingsPage"));
const NotificationPage = lazy(() =>
  import("../pages/User_Pages/NotificationPage")
);
const PostManagePage = lazy(() => import("../pages/User_Pages/PostManagePage"));
const ChatPage = lazy(() => import("../pages/ChatPages/ChatPage"));
const Suggestions = lazy(() => import("../pages/Network/Suggestions"));
const WorkSpaceHomePage = lazy(() =>
  import("../pages/WorkSpace/WorkSpaceHomePage")
);
const WorkSpacePage = lazy(() => import("../pages/WorkSpace/WorkSpacePage"));
const TeamInvite = lazy(() => import("../pages/User_Pages/TeamInvite"));
const OpenSourceCollaborationPage = lazy(() =>
  import("../pages/User_Pages/OpenSourceCollaborationPage")
);
const OpenSourceProjectDetailsPage = lazy(() =>
  import("../pages/User_Pages/OpenSourceProjectDetailsPage")
);

/** Fallback shown while a lazily-loaded route chunk is downloading. */
function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
          aria-hidden="true"
        />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
          Loading…
        </p>
      </div>
    </div>
  );
}

/** Reset scroll position on navigation (React Router does not do this itself). */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/student" element={<SignupPage />} />
          <Route
            path="/signup/organization"
            element={<OrganizationSignupPage />}
          />

          <Route path="/logout" element={<Logout />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />

          <Route path="/team/invite/:invite_link" element={<TeamInvite />} />

          {/* Organization */}
          <Route
            path="/organization/:organization_name"
            element={<OrganizationLayout />}
          >
            <Route index element={<OrganizationDashboardPage />} />

            {/* org public + private profile */}
            <Route path="profile" element={<OrganizationProfilePage />} />

            {/* Events management */}
            <Route path="events" element={<OrganizationEventsPage />} />
            <Route path="create/event" element={<EventFormPage />} />
            <Route path="events/edit/:id" element={<EventFormPage />} />
            <Route path="event/:event_id" element={<EventDetailsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="settings" element={<SettingsPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* GitHub OAuth callback — do not change this path */}
          <Route path="/github/callback" element={<GithubCallback />} />

          {/* Student */}
          <Route path="/user/:user_name" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* list all events */}
            <Route path="events" element={<EventsPage />} />

            {/* a particular event's details page */}
            <Route path="event/:event_id" element={<EventDetailsPage />} />

            <Route path="notification" element={<NotificationPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="collabrate" element={<CollaborationHomePage />} />
            <Route
              path="open-source"
              element={<OpenSourceCollaborationPage />}
            />
            <Route
              path="open-source/:id"
              element={<OpenSourceProjectDetailsPage />}
            />
            <Route path="createpost" element={<UserPostForm />} />
            <Route path="managepost/:postId" element={<PostManagePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="workspaces" element={<WorkSpaceHomePage />} />
            <Route
              path="workspace/team/:team_id"
              element={<WorkSpacePage />}
            />
            <Route path="suggestions" element={<Suggestions />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

import { Route, Routes } from "react-router-dom";
import MainLayout from '../layout/mainlayout/MainLayout'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/Profile/ProfilePage'

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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route path="/" element={<MainLayout />}>
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
    </Routes>
  )
}

import { Route, Routes } from "react-router-dom";
import MainLayout from '../layout/mainlayout/MainLayout'
import HomePage from '../pages/Home/HomePage'
import LoginPage from '../pages/Auth/LoginPage'
import SignupPage from '../pages/Auth/SignupPage'
import ProfilePage from '../pages/Profile/ProfilePage'

export default function AppRoutes() {
  return (
    <div>

      <Routes>

        {/* for public routes ========= */}
        {/* for non login or non signup user  */}
        <Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>


        {/* for main user routes protected routes===========  */}
        {/* to access mainlayout user needs jwt token and valid login or logout */}
        
        <Route path="/" element={<MainLayout />}>

          {/* index -> a page n defalut open kara on url => "/" */}
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* etc.........  */}
        </Route>


      </Routes>

    </div>
  )
}
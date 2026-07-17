import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_organization_signup, submit_student_signup } from "../../api/auth_apis";
import {
  FaBuilding,
  FaUserGraduate,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaInfoCircle,
} from "react-icons/fa";

function getErrorMessage(err) {
  const data = err.response?.data;

  if (!data) {
    return "Unable to create account. Please check your connection and try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.join(" ");
  }

  return Object.values(data).flat().join(" ") || "Unable to create account. Please try again.";
}

export function SignupChoicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-emerald-50/50 px-4 py-10 text-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Glowing Backdrop Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-indigo-200/50 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-emerald-100/60 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center z-10">
        {/* Logo */}
        <Link
          to="/"
          className="mb-8 flex items-center gap-2.5 text-2xl font-black text-indigo-600 transition-transform duration-300 hover:scale-105"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </span>
          <span className="text-slate-900">CoDO</span>
        </Link>

        <h1 className="text-4xl font-black text-slate-900 sm:text-5xl tracking-tight">
          How do you want to join?
        </h1>
        <p className="mt-3 text-slate-500 max-w-md text-sm sm:text-base font-medium">
          Create an account to start collaborating, publishing opportunities, or building your portfolio.
        </p>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-2">
          {/* Student Card */}
          <Link
            to="/signup/student"
            className="group relative flex flex-col items-start rounded-2xl border border-white/60 bg-white/80 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-indigo-50 text-3xl text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
              <FaUserGraduate />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Student</h2>
            <p className="mt-3 leading-relaxed text-slate-500 text-left text-sm">
              Discover teams, projects, internships, hackathons, and build your
              professional profile within a supportive community.
            </p>
            <div className="mt-8 flex items-center font-bold text-indigo-700 bg-indigo-50/50 border border-indigo-100 rounded-xl px-5 py-2.5 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600">
              Continue as Student <span className="ml-2 transition-transform group-hover:translate-x-1">-&gt;</span>
            </div>
          </Link>

          {/* Organization Card */}
          <Link
            to="/signup/organization"
            className="group relative flex flex-col items-start rounded-2xl border border-white/60 bg-white/80 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5"
          >
            <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              RECRUITMENT READY
            </span>
            <div className="mb-6 grid h-14 w-14 place-items-center rounded-xl bg-emerald-50 text-3xl text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
              <FaBuilding />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Organization</h2>
            <p className="mt-3 leading-relaxed text-slate-500 text-left text-sm">
              Post opportunities, host events, and connect with talented
              students using your organization account.
            </p>
            <div className="mt-8 flex items-center font-bold text-emerald-700 bg-emerald-50/50 border border-emerald-100 rounded-xl px-5 py-2.5 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600">
              Continue as Organization <span className="ml-2 transition-transform group-hover:translate-x-1">-&gt;</span>
            </div>
          </Link>
        </div>

        <p className="mt-12 text-sm font-semibold text-slate-500">
          Already have an account?
          <Link to="/login" className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export function StudentSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { username, email, password, confirmPassword } = e.target.elements;

    if (password.value !== confirmPassword.value) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const formData = {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    try {
      const response = await submit_student_signup(formData);
      console.log(response)
      localStorage.setItem("access", response.data.token.access);
      localStorage.setItem("refresh", response.data.token.refresh);
      localStorage.setItem("accountType", "student");
      localStorage.setItem("username", response.data.user.username);
      
      navigate(`/user/${response.data.userdata.username}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-cyan-50/30 px-4 py-8 text-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Glowing Backdrop Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-indigo-200/50 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-cyan-100/60 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 z-10">
        <section className="hidden md:block rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-indigo-50 text-3xl text-indigo-600">
            <FaUserGraduate />
          </div>
          <h1 className="mt-6 text-3xl font-black leading-tight text-slate-900">
            Build your student profile and find your next team.
          </h1>
          <p className="mt-3 leading-relaxed text-slate-500 text-sm">
            Student accounts help you discover projects, events, teammates, internships, and communities built around your skills.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-4">
              <p className="font-bold text-slate-800 text-sm sm:text-base">Project profile</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">Show your skills, education, interests, links, and availability.</p>
            </div>
            <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-4">
              <p className="font-bold text-slate-800 text-sm sm:text-base">Student opportunities</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">Join hackathons, teams, internships, and collaboration spaces.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <Link to="/" className="mb-6 flex items-center gap-2.5 text-2xl font-black text-indigo-600">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm">C</span>
            <span className="text-slate-900">CoDO</span>
          </Link>

          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Student Signup</p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900">Create account</h2>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700 border border-red-100 text-sm">
              <FaInfoCircle className="flex-shrink-0" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Username</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe_dev"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="student@university.edu"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 outline-none transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Confirm Password
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 outline-none transition-all duration-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="!mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            Already have an account?
            <Link to="/login" className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export function OrganizationSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { username, email, password, confirmPassword } = e.target.elements;

    if (password.value !== confirmPassword.value) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const formData = {
      username: username.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    try {
      const response = await submit_organization_signup(formData);
      localStorage.setItem("access", response.data.token.access);
      localStorage.setItem("refresh", response.data.token.refresh);
      localStorage.setItem("accountType", "organization");
      navigate(`/user/${response.data.userdata.username}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-slate-50 to-teal-50/30 px-4 py-8 text-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Glowing Backdrop Blobs */}
      <div className="absolute top-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-emerald-200/50 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-teal-100/60 blur-[100px] pointer-events-none"></div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 z-10">
        <section className="hidden md:block rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-emerald-50 text-3xl text-emerald-600">
            <FaBuilding />
          </div>
          <h1 className="mt-8 text-3xl font-black leading-tight text-slate-900">
            Create your organization workspace.
          </h1>
          <p className="mt-3 leading-relaxed text-slate-500 text-sm">
            Organization accounts can post opportunities, host events, and connect with student talent.
          </p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-4">
              <p className="font-bold text-slate-800 text-sm sm:text-base">Partner profile</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">Set up your organization identity and contact email.</p>
            </div>
            <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-4">
              <p className="font-bold text-slate-800 text-sm sm:text-base">Hiring activity</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">Share roles, projects, internships, and events with students.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <Link to="/" className="mb-6 flex items-center gap-2.5 text-2xl font-black text-emerald-600">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">C</span>
            <span className="text-slate-900">CoDO</span>
          </Link>

          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Organization Signup</p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-black text-slate-900">Create account</h2>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700 border border-red-100 text-sm">
              <FaInfoCircle className="flex-shrink-0" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Organization Name</label>
              <div className="relative group">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  name="username"
                  placeholder="CoDO Labs"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Organization Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Confirm Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 outline-none transition-all duration-300 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="!mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Organization"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            Already have an account?
            <Link to="/login" className="ml-2 font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default StudentSignupPage;

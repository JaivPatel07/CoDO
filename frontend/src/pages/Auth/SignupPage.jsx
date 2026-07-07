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
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Logo */}
        <Link
          to="/"
          className="mb-12 flex items-center gap-2 text-2xl font-black text-indigo-600"
        >
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </span>
          <span>CoDO</span>
        </Link>
        <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">
          How do you want to join?
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Choose the account type that fits you. Student signup is ready now, and
          organization access is coming soon.
        </p>
        <div className="mt-12 grid w-full gap-6 md:grid-cols-2">
          {/* Student Card */}
          <Link
            to="/signup/student"
            className="group relative flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-500 hover:shadow-lg"
          >
            <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-4xl text-indigo-600">
              <FaUserGraduate />
            </div>
            <h2 className="text-2xl font-bold">Student</h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Discover teams, projects, internships, hackathons, and build your
              professional profile within a supportive community.
            </p>
            <div className="mt-8 flex items-center font-bold text-indigo-600 transition-all group-hover:gap-2">
              Continue as Student <span className="ml-1">-&gt;</span>
            </div>
          </Link>
          {/* Organization Card */}
          <div className="group relative flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              LOGIN READY
            </span>
            <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-4xl text-emerald-600">
              <FaBuilding />
            </div>
            <h2 className="text-2xl font-bold text-slate-950">
              Organization
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Post opportunities, host events, and connect with talented
              students using your organization account.
            </p>
            <Link
              to="/signup/organization"
              className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Continue as Organization
            </Link>
          </div>
        </div>
        <p className="mt-12 text-slate-600">
          Already have an account?
          <Link to="/login" className="ml-2 font-bold text-indigo-600 hover:underline">
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
      localStorage.setItem("access", response.data.token.access);
      localStorage.setItem("refresh", response.data.token.refresh);
      localStorage.setItem("accountType", "student");
      navigate("/user");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2">
        <section className="hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:block">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-3xl text-indigo-600">
            <FaUserGraduate />
          </div>
          <h1 className="mt-6 text-3xl font-black leading-tight">
            Build your student profile and find your next team.
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            Student accounts help you discover projects, events, teammates, internships, and communities built around your skills.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-bold">Project profile</p>
              <p className="mt-1 text-sm text-slate-600">Show your skills, education, interests, links, and availability.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-bold">Student opportunities</p>
              <p className="mt-1 text-sm text-slate-600">Join hackathons, teams, internships, and collaboration spaces.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link to="/" className="mb-6 flex items-center gap-3 text-2xl font-black text-indigo-600">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-600 text-white">C</span>
            <span>CoDO</span>
          </Link>

          <p className="text-sm font-bold uppercase text-indigo-600">Student Signup</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Create account</h2>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <FaInfoCircle className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-bold">Username</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe_dev"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="student@university.edu"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-12 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-12 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="!mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-lg font-bold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account ->"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?
            <Link to="/login" className="ml-2 font-bold text-indigo-600 hover:underline">
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
      navigate("/organization/profile");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2">
        <section className="hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:block">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
            <FaBuilding />
          </div>
          <h1 className="mt-8 text-3xl font-black leading-tight">
            Create your organization workspace.
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            Organization accounts can post opportunities, host events, and connect with student talent.
          </p>
          <div className="mt-8 grid gap-4">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-bold">Partner profile</p>
              <p className="mt-1 text-sm text-slate-600">Set up your organization identity and contact email.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="font-bold">Hiring activity</p>
              <p className="mt-1 text-sm text-slate-600">Share roles, projects, internships, and events with students.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link to="/" className="mb-6 flex items-center gap-3 text-2xl font-black text-emerald-600">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">C</span>
            <span>CoDO</span>
          </Link>

          <p className="text-sm font-bold uppercase text-emerald-600">Organization Signup</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Create account</h2>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <FaInfoCircle className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-bold">Organization Name</label>
              <div className="relative">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="username"
                  placeholder="CoDO Labs"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Organization Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-12 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Confirm Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-12 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="!mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-lg font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Organization ->"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            Already have an account?
            <Link to="/login/organization" className="ml-2 font-bold text-emerald-600 hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default StudentSignupPage;

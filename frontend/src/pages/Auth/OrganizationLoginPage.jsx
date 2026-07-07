import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_login } from "../../api/auth_apis";
import { FaBuilding, FaEnvelope, FaEye, FaEyeSlash, FaInfoCircle, FaLock } from "react-icons/fa";

function getErrorMessage(err) {
  const data = err.response?.data;

  if (!data) {
    return "Unable to login. Please check your connection and try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.join(" ");
  }

  return Object.values(data).flat().join(" ") || "Invalid organization credentials.";
}

export default function OrganizationLoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password } = e.target.elements;

    try {
      const response = await submit_login({
        email: email.value.trim(),
        password: password.value,
      });

      localStorage.setItem("access", response.data.token.access);
      localStorage.setItem("refresh", response.data.token.refresh);
      localStorage.setItem("accountType", "organization");
      navigate("/organization/profile/create");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:block">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
            <FaBuilding />
          </div>
          <h1 className="mt-8 text-4xl font-black leading-tight">
            Manage opportunities for student talent.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Organization accounts can post openings, host events, review student profiles, and keep hiring activity organized.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-bold">Company profile</p>
              <p className="mt-1 text-sm text-slate-600">Keep organization details and contact information ready for students.</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="font-bold">Events and roles</p>
              <p className="mt-1 text-sm text-slate-600">Publish internships, hackathons, projects, and hiring updates.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Link to="/" className="mb-8 flex items-center gap-3 text-2xl font-black text-emerald-600">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">C</span>
            <span>CoDO</span>
          </Link>

          <p className="text-sm font-bold uppercase text-emerald-600">Organization Login</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Welcome back</h2>
          <p className="mt-2 text-slate-600">Login with your organization email to continue.</p>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-red-700">
              <FaInfoCircle className="flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-bold">Organization Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-4 pl-12 pr-12 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Logging In..." : "Login as Organization"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an organization account?
            <Link to="/signup/organization" className="ml-2 font-bold text-emerald-600 hover:underline">
              Sign up
            </Link>
          </p>

          <p className="mt-2 text-center text-sm text-slate-600">
            Are you a student?
            <Link to="/login" className="ml-2 font-bold text-emerald-600 hover:underline">
              Login here
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

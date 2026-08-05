import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_organization_signup, submit_student_signup } from "../../api/auth_apis";
import ErrorBanner from "../../components/ErrorBanner";
import {
  FaBuilding,
  FaUserGraduate,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function getErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return "Unable to create account. Please check your connection and try again.";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(" ");
  return Object.values(data).flat().join(" ") || "Unable to create account. Please try again.";
}

export function SignupChoicePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[100] flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm border border-slate-200/80 transition-all hover:-translate-x-1 hover:bg-white hover:text-slate-900 hover:shadow-md"
      >
        <FaArrowLeft /> Back to Home
      </Link>
      {/* Premium Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none"></div>

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center z-10">
        
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/" className="mb-8 flex items-center gap-2.5 text-2xl font-black transition-transform duration-300 hover:scale-105">
            <img src="/coDO.svg" alt="CoDO Logo" className="h-10 w-10 drop-shadow-md" />
            <span className="text-zinc-900 tracking-tight">CoDO</span>
          </Link>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-black text-zinc-900 sm:text-5xl tracking-tight"
        >
          How do you want to join?
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-zinc-500 max-w-md text-sm sm:text-base font-medium"
        >
          Create an account to start collaborating, publishing opportunities, or building your professional portfolio.
        </motion.p>

        <div className="mt-12 grid w-full gap-6 md:grid-cols-2">
          
          {/* Student Card */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Link
              to="/signup/student"
              className="group relative flex flex-col items-start rounded-[32px] border border-zinc-200/60 bg-white/80 p-8 text-left shadow-xl shadow-zinc-200/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10 h-full overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[32px]"></div>
              
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-zinc-50 border border-zinc-100 text-2xl text-zinc-600 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 relative z-10">
                <FaUserGraduate />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 relative z-10">Student</h2>
              <p className="mt-3 leading-relaxed text-zinc-500 text-left text-sm relative z-10 flex-1">
                Discover teams, projects, internships, hackathons, and build your professional profile within a supportive community.
              </p>
              
              <div className="mt-8 flex items-center font-bold text-violet-700 bg-violet-50/80 border border-violet-100 rounded-xl px-5 py-3 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 relative z-10 w-full justify-between">
                <span>Continue as Student</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" size={14} />
              </div>
            </Link>
          </motion.div>

          {/* Organization Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Link
              to="/signup/organization"
              className="group relative flex flex-col items-start rounded-[32px] border border-zinc-200/60 bg-white/80 p-8 text-left shadow-xl shadow-zinc-200/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10 h-full overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[32px]"></div>

              <span className="absolute right-6 top-6 rounded-full bg-zinc-900 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase z-10">
                Recruitment
              </span>
              
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-zinc-50 border border-zinc-100 text-2xl text-zinc-600 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 relative z-10">
                <FaBuilding />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 relative z-10">Organization</h2>
              <p className="mt-3 leading-relaxed text-zinc-500 text-left text-sm relative z-10 flex-1">
                Publish opportunities, share events, and connect with talented students through your organization account.
              </p>
              
              <div className="mt-8 flex items-center font-bold text-violet-700 bg-violet-50/80 border border-violet-100 rounded-xl px-5 py-3 transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 relative z-10 w-full justify-between">
                <span>Continue as Organization</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" size={14} />
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-sm font-semibold text-zinc-500"
        >
          Already have an account?
          <Link to="/login" className="ml-2 font-bold text-violet-600 hover:text-violet-800 transition-colors">
            Log in
          </Link>
        </motion.p>
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
      localStorage.setItem("username", response.data.userdata.username);
      
      navigate(`/user/${response.data.userdata.username}`,{replace:true});
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/signup" 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[100] flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm border border-slate-200/80 transition-all hover:-translate-x-1 hover:bg-white hover:text-slate-900 hover:shadow-md"
      >
        <FaArrowLeft /> Back
      </Link>
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-zinc-200/60 bg-white/80 shadow-2xl shadow-zinc-200/50 backdrop-blur-xl md:grid-cols-2 z-10"
      >
        <section className="hidden md:flex flex-col justify-center border-r border-zinc-200/60 bg-gradient-to-br from-violet-50/50 to-transparent p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FaUserGraduate size={200} />
          </div>
          <div className="relative z-10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-500/30">
              <FaUserGraduate />
            </div>
            <h1 className="mt-8 text-3xl font-black leading-tight text-zinc-900 tracking-tight">
              Build your student profile and find your next team.
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-500 text-sm font-medium">
              Student accounts help you discover projects, events, teammates, internships, and communities built around your skills.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm">
                <p className="font-bold text-zinc-900 text-sm">Project Profile</p>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-medium">Showcase your tech stack, education, interests, links, and availability to potential collaborators.</p>
              </div>
              <div className="rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm">
                <p className="font-bold text-zinc-900 text-sm">Student Opportunities</p>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-medium">Join hackathons, form dynamic teams, secure internships, and engage in collaboration spaces.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md p-8 sm:p-10 flex flex-col justify-center">
          <Link to="/" className="mb-8 flex items-center gap-2.5 text-2xl font-black">
            <img src="/coDO.svg" alt="CoDO Logo" className="h-8 w-8 drop-shadow-sm" />
            <span className="text-zinc-900 tracking-tight">CoDO</span>
          </Link>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-1">Student Portal</p>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Create account</h2>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                <ErrorBanner message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Username</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe_dev"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="student@university.edu"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-12 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-600 transition-colors p-1"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Confirm Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-12 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="!mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-zinc-500">
            Already have an account?
            <Link to="/login" state={{ accountType: 'student' }} className="ml-1.5 font-bold text-zinc-900 hover:text-violet-600 transition-colors">
              Log in
            </Link>
          </p>
        </section>
      </motion.div>
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
      localStorage.setItem("username", response.data.userdata.username);
      navigate(`/organization/${response.data.userdata.username}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* Back Button */}
      <Link 
        to="/signup" 
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[100] flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm border border-slate-200/80 transition-all hover:-translate-x-1 hover:bg-white hover:text-slate-900 hover:shadow-md"
      >
        <FaArrowLeft /> Back
      </Link>
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-zinc-200/60 bg-white/80 shadow-2xl shadow-zinc-200/50 backdrop-blur-xl md:grid-cols-2 z-10"
      >
        <section className="hidden md:flex flex-col justify-center border-r border-zinc-200/60 bg-gradient-to-br from-violet-50/50 to-transparent p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FaBuilding size={200} />
          </div>
          <div className="relative z-10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-500/30">
              <FaBuilding />
            </div>
            <h1 className="mt-8 text-3xl font-black leading-tight text-zinc-900 tracking-tight">
              Create your organization workspace.
            </h1>
            <p className="mt-4 leading-relaxed text-zinc-500 text-sm font-medium">
              Organization accounts can publish opportunities, share events, and directly connect with top student talent.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm">
                <p className="font-bold text-zinc-900 text-sm">Partner Profile</p>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-medium">Set up your official corporate identity and designate contact representatives for students.</p>
              </div>
              <div className="rounded-2xl bg-white border border-zinc-100 p-5 shadow-sm">
                <p className="font-bold text-zinc-900 text-sm">Hiring Activity</p>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed font-medium">Seamlessly share new roles, collaborative projects, internships, and networking events.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md p-8 sm:p-10 flex flex-col justify-center">
          <Link to="/" className="mb-8 flex items-center gap-2.5 text-2xl font-black">
            <img src="/coDO.svg" alt="CoDO Logo" className="h-8 w-8 drop-shadow-sm" />
            <span className="text-zinc-900 tracking-tight">CoDO</span>
          </Link>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-violet-600 mb-1">Recruitment Portal</p>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Create account</h2>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6">
                <ErrorBanner message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Organization Name</label>
              <div className="relative group">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type="text"
                  name="username"
                  placeholder="Acme Corp"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Organization Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-12 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-600 transition-colors p-1"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Confirm Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-3.5 pl-11 pr-12 text-sm font-medium outline-none transition-all duration-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 placeholder:text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-600 transition-colors p-1"
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="!mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Organization"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-zinc-500">
            Already have an account?
            <Link to="/login" state={{ accountType: 'organization' }} className="ml-1.5 font-bold text-zinc-900 hover:text-violet-600 transition-colors">
              Log in
            </Link>
          </p>
        </section>
      </motion.div>
    </main>
  );
}

export default StudentSignupPage;

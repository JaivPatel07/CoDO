import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { submit_login } from "../../api/auth_apis";
import {
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaGraduationCap,
  FaBuilding,
  FaCalendarAlt,
  FaUsers,
  FaProjectDiagram,
  FaBriefcase,
  FaBullhorn,
  FaChartLine,
  FaLayerGroup,
} from "react-icons/fa";
import { UserContext } from "../../contextAPI/userContext";
import ThemeToggle from "../../components/ThemeToggle";

function getErrorMessage(err) {
  if (!err) return null;

  if (!err.response) {
    return "Network connection issue. Please check your internet connectivity and try again.";
  }

  const data = err.response.data;

  if (!data) {
    return "Unable to authenticate. Please check your inputs and try again.";
  }

  if (typeof data === "string") {
    if (data.includes("<html") || data.includes("<!DOCTYPE")) {
      return "A server error occurred. Please try again later.";
    }
    return data;
  }

  if (data.detail) return data.detail;
  if (data.error) return data.error;

  if (data.non_field_errors) {
    return Array.isArray(data.non_field_errors)
      ? data.non_field_errors.join(" ")
      : data.non_field_errors;
  }

  if (typeof data === "object") {
    const messages = Object.entries(data).map(([key, val]) => {
      const valStr = Array.isArray(val) ? val.join(" ") : val;
      return key !== "detail" && key !== "error" && key !== "non_field_errors"
        ? `${key}: ${valStr}`
        : valStr;
    });
    return messages.join(" ") || "Invalid authentication credentials.";
  }

  return "Invalid credentials. Please try again.";
}

const THEMES = {
  student: {
    eyebrow: "Student workspace",
    welcome: "Welcome back, Student",
    headline: "Build Your Future Together",
    subheadline:
      "Discover events, find teammates, collaborate on projects, and grow your career.",
    formTitle: "Continue your journey",
    formCopy: "Sign in to join events, shape projects, and meet your next team.",
    button: "Continue as Student",
    placeholder: "student@campus.edu",
gradient: "from-violet-500 to-indigo-600",
    text: "text-violet-600",
    border: "border-violet-200",
    soft: "bg-violet-50",
    softDark: "dark:bg-violet-950",
    focus: "focus:border-violet-400 focus:ring-violet-100",
    features: [
      { icon: FaCalendarAlt, label: "Join Events", text: "Campus ready" },
      { icon: FaProjectDiagram, label: "Build Projects", text: "Team focused" },
      { icon: FaUsers, label: "Meet Students", text: "Peer network" },
      { icon: FaBriefcase, label: "Opportunities", text: "Career minded" },
    ],
  },
  organization: {
    eyebrow: "Organization workspace",
    welcome: "Welcome back, Organization",
    headline: "Empower Your Student Community",
    subheadline:
      "Create events, recruit talented students, share opportunities, and manage your organization.",
    formTitle: "Manage your community",
    formCopy: "Sign in to publish events, recruit students, and grow engagement.",
    button: "Continue as Organization",
    placeholder: "admin@organization.com",
gradient: "from-violet-500 to-indigo-600",
    text: "text-violet-600",
    border: "border-violet-200",
    soft: "bg-violet-50",
    softDark: "dark:bg-violet-950",
    focus: "focus:border-violet-400 focus:ring-violet-100",
    features: [
      { icon: FaBullhorn, label: "Publish Events", text: "Event ready" },
      { icon: FaBriefcase, label: "Recruit Students", text: "Talent focused" },
      { icon: FaLayerGroup, label: "Manage Community", text: "Clear control" },
      { icon: FaChartLine, label: "Grow Engagement", text: "Community minded" },
    ],
  },
};

function ModeContent({ accountType, children }) {
  return (
    <div key={accountType} className="login-text-transition">
      {children}
    </div>
  );
}

function ShowcaseSection({ accountType, theme }) {
  return (
    <section className="flex h-full min-h-0 flex-col justify-between bg-white/70 dark:bg-slate-800/70 p-5 backdrop-blur sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/coDO.svg" alt="CoDO Logo" className="h-11 w-11 drop-shadow-md" />
          <div>
            <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100">CoDO</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              Collaborate and grow
            </p>
          </div>
        </div>
        <span className={`rounded-full border bg-white dark:bg-slate-800 px-3 py-1.5 text-[11px] font-bold ${theme.text} ${theme.border}`}>
          {theme.eyebrow}
        </span>
      </div>

      <div className="py-5 lg:py-8">
        <ModeContent accountType={`showcase-${accountType}`}>
          <p className={`mb-3 text-xs font-black uppercase tracking-[0.24em] transition-colors duration-500 ease-in-out ${theme.text}`}>
            {theme.eyebrow}
          </p>
          <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl xl:text-5xl">
            {theme.headline}
          </h1>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400 sm:text-base">
            {theme.subheadline}
          </p>
        </ModeContent>
      </div>

      <ModeContent accountType={`features-${accountType}`}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {theme.features.map((feature) => (
            <div
              key={feature.label}
              className="min-h-24 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 p-3 shadow-sm transition-colors duration-500 ease-in-out"
            >
              <feature.icon className={`transition-colors duration-500 ease-in-out ${theme.text}`} size={15} />
              <p className="mt-2 text-[11px] font-black text-slate-700 dark:text-slate-300 sm:text-xs">{feature.label}</p>
              <p className="mt-1 text-[10px] font-bold leading-4 text-slate-500 dark:text-slate-400 sm:text-[11px]">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </ModeContent>
    </section>
  );
}

function SegmentedControl({ accountType, setAccountType, theme }) {
  return (
    <div className="grid grid-cols-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-1">
      {["student", "organization"].map((type) => {
        const active = accountType === type;
        const Icon = type === "student" ? FaGraduationCap : FaBuilding;

        return (
          <button
            key={type}
            type="button"
            onClick={() => setAccountType(type)}
            className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-2 text-[11px] font-black uppercase tracking-[0.16em] transition-colors ${active
              ? `bg-gradient-to-r ${theme.gradient} text-white shadow`
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
          >
            <Icon size={13} />
            <span>{type === "student" ? "Student" : "Organization"}</span>
          </button>
        );
      })}
    </div>
  );
}

function TextInput({ id, name, type, label, placeholder, icon: Icon, theme, rightSlot, autoComplete }) {
  return (
    <div>
      <label className="mb-1.5 ml-1 block text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <Icon className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${theme.text}`} size={14} />
        <input
          className={`h-13 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-11 pr-11 text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none transition focus:ring-4 ${theme.focus}`}
          id={id}
          name={name}
          placeholder={placeholder}
          required
          type={type}
          autoComplete={autoComplete}
        />
        {rightSlot}
      </div>
    </div>
  );
}

function LoginForm({ accountType, setAccountType, loading, error, setError, handleSubmit, success }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const theme = THEMES[accountType];

  return (
    <section className="flex h-full items-center justify-center bg-white/85 dark:bg-slate-800/85 p-5 backdrop-blur sm:p-7">
      <div className="w-full max-w-[430px]">
        <div className="mb-5">
          <ModeContent accountType={`form-${accountType}`}>
            <div className={`mb-3 inline-flex rounded-full border bg-white dark:bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ease-in-out ${theme.text} ${theme.border}`}>
              {theme.welcome}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 dark:text-slate-100 sm:text-3xl">
              {theme.formTitle}
            </h2>
            <p className="mt-2 text-sm font-semibold leading-5 text-slate-500 dark:text-slate-400">{theme.formCopy}</p>
          </ModeContent>
        </div>

        <SegmentedControl accountType={accountType} setAccountType={setAccountType} theme={theme} />

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs text-rose-700">
            <FaInfoCircle className="mt-0.5 shrink-0 text-rose-500" size={14} />
            <div className="min-w-0 flex-1">
              <p className="font-black text-rose-900">Authentication Error</p>
              <p className="mt-0.5 font-semibold text-rose-600/90">{error}</p>
            </div>
              <button type="button" onClick={() => setError(null)} className="font-black text-rose-400 hover:text-rose-700 dark:hover:text-rose-300" aria-label="Dismiss error">
              x
            </button>
          </div>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 dark:bg-violet-950/30 p-3 text-sm text-violet-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50">
              <FaCheck size={13} className="text-violet-600 dark:text-violet-400" />
            </span>
            <p className="font-black">Welcome back! Redirecting you...</p>
          </div>
        )}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <TextInput
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder={theme.placeholder}
            icon={FaEnvelope}
            theme={theme}
            autoComplete="email"
          />

          <TextInput
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Password"
            icon={FaLock}
            theme={theme}
            autoComplete="current-password"
            rightSlot={
              <button
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            }
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRemember(!remember)}
              className="flex items-center gap-2 text-xs font-bold text-slate-600"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-md border ${remember ? `border-transparent bg-gradient-to-br ${theme.gradient}` : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
              >
                {remember && <FaCheck size={9} className="text-white" />}
              </span>
              Remember me
            </button>
            <Link
              to="/forgot-password"
              className={`text-xs font-black ${theme.text}`}
            >
              Forgot password?
            </Link>
          </div>

<button
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r ${theme.gradient} py-4 text-sm font-black text-white shadow-lg transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60`}
            disabled={loading || success}
            type="submit"
          >
            {loading ? (
              <><FaSpinner className="animate-spin" size={15} /> Authenticating...</>
            ) : success ? (
              <><FaCheck size={15} /> Redirecting...</>
            ) : (
              <>
                <span>{theme.button}</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
                  <FaArrowRight size={12} />
                </span>
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
          Don&apos;t have an account? 
          <Link
            to="/signup"
            className={`font-black ${theme.text} hover:underline`}
          >
            Sign up free
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState(location.state?.accountType || "student");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const theme = THEMES[accountType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password } = e.target.elements;

    const formData = {
      email: email.value,
      password: password.value,
      account_type: accountType,
    };

    try {
      const response = await submit_login(formData);
      localStorage.setItem("access", response.data.token.access);
      localStorage.setItem("refresh", response.data.token.refresh);
      localStorage.setItem("accountType", accountType);

      setUserData(response.data.user);
      localStorage.setItem("username", response.data.user.username);

      setLoading(false);
      setSuccess(true);

      const targetPath =
        accountType === "student"
          ? `/user/${response.data.user.username}`
          : `/organization/${response.data.user.username}`;

      setTimeout(() => navigate(targetPath), 1100);
    } catch (err) {
      setError(getErrorMessage(err));
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.soft} ${theme.softDark} via-white dark:via-slate-900 to-slate-100 dark:to-slate-800 p-8 text-slate-900 dark:text-slate-100 flex flex-col`}>
       {/* Back Button */}
       <div className="mb-3 flex-shrink-0 flex items-center justify-between"> 
         <Link
           to="/"
           className="inline-flex items-center gap-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80 transition-all hover:-translate-x-1 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-md"
         >
           <FaArrowLeft /> Back to Home
         </Link>
         <ThemeToggle />
       </div>

      {/* Main Card */}
      <div className="flex-1 w-full overflow-hidden rounded-[30px] border border-white/70 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 shadow-xl shadow-slate-200/60 dark:shadow-slate-900/50 flex flex-col lg:flex-row"> 
        {/* Left: Showcase */}
        <div className="lg:w-[56%] flex-shrink-0 border-b border-slate-200/70 dark:border-slate-700/70 lg:border-b-0 lg:border-r"> 
          <ShowcaseSection accountType={accountType} theme={theme} />
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 bg-white/70 dark:bg-slate-800/70">
          <LoginForm
            accountType={accountType}
            setAccountType={setAccountType}
            loading={loading}
            error={error}
            setError={setError}
            handleSubmit={handleSubmit}
            success={success}
          />
        </div>
      </div>
    </main>
  );
}

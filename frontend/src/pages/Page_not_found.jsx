import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Home,
  LifeBuoy,
  Search,
  Users,
} from "lucide-react";
import { useEffect } from "react";

const QUICK_LINKS = [
  {
    to: "/",
    label: "Home",
    description: "Back to the landing page",
    icon: Home,
  },
  {
    to: "/signup",
    label: "Create account",
    description: "Join as a student or organization",
    icon: Users,
  },
  {
    to: "/login",
    label: "Log in",
    description: "Continue where you left off",
    icon: Compass,
  },
];

export default function PageNotFound() {
  // Make sure the document title reflects the error, not the previous page.
  useEffect(() => {
    const previous = document.title;
    document.title = "Page not found — CoDO";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-16 dark:bg-slate-950">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-400/20 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-[320px] w-[320px] translate-x-1/4 translate-y-1/4 rounded-full bg-sky-400/20 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-20px_rgb(15_23_42_/_0.18)] sm:p-12 dark:border-slate-800 dark:bg-slate-900">
          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
          >
            <img src="/coDO.svg" alt="" className="h-7 w-auto" aria-hidden="true" />
            CoDO
          </Link>

          {/* Code */}
          <div className="mt-8 flex items-baseline gap-4">
            <span className="bg-gradient-to-br from-brand-600 to-sky-500 bg-clip-text text-7xl font-black leading-none tracking-tighter text-transparent sm:text-8xl dark:from-brand-400 dark:to-sky-400">
              404
            </span>
            <span className="h-12 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                Page not found
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                We couldn&apos;t find what you were looking for.
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            The link may be broken, or the page may have been moved or removed.
            Here are a few places you can try instead.
          </p>

          {/* Quick links */}
          <nav className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Suggested pages">
            {QUICK_LINKS.map(({ to, label, description, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-brand-500/60 dark:hover:bg-brand-500/10"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-slate-900 dark:text-brand-400 dark:group-hover:bg-brand-600 dark:group-hover:text-white">
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <span className="mt-3 block text-sm font-bold text-slate-900 dark:text-slate-100">
                  {label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                  {description}
                </span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row dark:border-slate-800">
            <Link
              to="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-600/20 transition-all hover:-translate-y-0.5 hover:bg-brand-700 active:scale-[0.98] dark:hover:bg-brand-500"
            >
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to homepage
            </Link>
            <a
              href="mailto:support@codo.com?subject=Broken%20link%20on%20CoDO"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LifeBuoy size={16} strokeWidth={2.5} />
              Report a broken link
            </a>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <Search size={13} aria-hidden="true" />
          Error code 404 — resource not found
        </p>
      </div>
    </div>
  );
}

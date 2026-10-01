import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

const LINK_GROUPS = [
  {
    title: "Platform",
    links: [
      { label: "Find events", to: "/signup" },
      { label: "Collaborate", to: "/signup" },
      { label: "Open source", to: "/signup" },
      { label: "For organizations", to: "/signup/organization" },
    ],
  },
  {
    title: "Students",
    links: [
      { label: "Create account", to: "/signup/student" },
      { label: "Log in", to: "/login" },
      { label: "Build a profile", to: "/signup/student" },
      { label: "Find teammates", to: "/signup/student" },
    ],
  },
];

const SOCIALS = [
  { label: "GitHub", href: "https://github.com", Icon: FaGithub },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedin },
  { label: "X (Twitter)", href: "https://twitter.com", Icon: FaXTwitter },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="container-page px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          {/* ── Brand ── */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img src="/coDO.svg" alt="CoDO" className="h-8 w-auto" />
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                CoDO
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The student collaboration platform. Discover hackathons and
              workshops, find teammates, and turn ideas into shipped projects.
            </p>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-500/60 dark:hover:bg-brand-500/10 dark:hover:text-brand-400"
                >
                  <Icon size={15} />
                </a>
              ))}
              <a
                href="mailto:support@codo.com"
                aria-label="Email support"
                title="Email support"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-500/60 dark:hover:bg-brand-500/10 dark:hover:text-brand-400"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* ── Link columns ── */}
          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-900 dark:text-slate-100">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* ── Preferences ── */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-900 dark:text-slate-100">
              Preferences
            </h3>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              Choose the look that suits you.
            </p>
            <div className="mt-3">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-11 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            © {currentYear}{" "}
            <span className="font-bold text-slate-800 dark:text-slate-200">
              CoDO
            </span>
            . Built for student collaboration.
          </p>

          <ul className="flex items-center gap-5">
            {LEGAL.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-xs font-semibold text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

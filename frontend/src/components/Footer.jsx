import { Code2, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaXTwitter, FaDiscord } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const FooterLink = ({ to = "#", children }) => (<li>
    <Link to={to} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">{children}</Link>
  </li>);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-violet-900/40 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E1B4B] text-white">

  {/* Background Blur */}
  <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />
  <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />

  <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
    <div className="grid gap-12 lg:grid-cols-5">
      {/* Brand */}
      <div className="lg:col-span-2">
        <Link to="/" className="inline-flex items-center gap-3 leading-none">
          <img src="/coDO.svg" alt="CoDO" className="block h-12 w-12 shrink-0" />
          <span className="text-4xl mb-2 font-black leading-none tracking-tight">CoDO</span>
        </Link>
        <p className="mt-6 max-w-sm leading-7 text-slate-400">
          Connect with students, discover opportunities,
          build amazing teams, and collaborate on projects
          from one focused platform.
        </p>
      </div>

      {/* Platform */}
      <div>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
          Platform
        </h3>
        <ul className="space-y-3">
          <FooterLink>Explore Students</FooterLink>
          <FooterLink>Organizations</FooterLink>
          <FooterLink>Projects</FooterLink>
          <FooterLink>Events</FooterLink>
          <FooterLink>Team Finder</FooterLink>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
          Resources
        </h3>
        <ul className="space-y-3">
          <FooterLink>Blog</FooterLink>
          <FooterLink>Help Center</FooterLink>
          <FooterLink>FAQs</FooterLink>
          <FooterLink>Contact</FooterLink>
          <FooterLink>Developer API</FooterLink>
        </ul>
      </div>

      {/* Connect */}
      <div>
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
          Connect
        </h3>
        <div className="flex gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-700/30 bg-violet-900/30 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-600/30"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-700/30 bg-violet-900/30 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0077B5] hover:text-white"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-700/30 bg-violet-900/30 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
          >
            <FaXTwitter />
          </a>
          <a
            href="mailto:support@codo.com"
            aria-label="Email"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-700/30 bg-violet-900/30 text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-600 hover:text-white"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-violet-800/30 pt-8 text-sm text-slate-400 md:flex-row">
      <div>
        © {currentYear} <span className="font-semibold text-white">CoDO</span>.
        Built for student collaboration.
      </div>
      <div className="flex gap-6">
        <Link to="#" className="transition hover:text-white">
          Privacy Policy
        </Link>
        <Link to="#" className="transition hover:text-white">
          Terms
        </Link>
        <Link to="#" className="transition hover:text-white">
          Cookies
        </Link>
      </div>
    </div>
  </div>
</footer>
  );
}
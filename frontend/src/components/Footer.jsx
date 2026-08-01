import { Code2, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaXTwitter, FaDiscord } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const FooterLink = ({ to = "#", children }) => (
    <li>
      <Link to={to} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-300">
        {children}
      </Link>
    </li>
  );

  return (
    <footer className="mt-auto bg-[#0c0014] text-white relative overflow-hidden border-t border-violet-900">
      {/* Background glow effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand & Description */}
          <div className="lg:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/coDO.svg" alt="CoDO Logo" className="h-10 w-10 drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
              <h2 className="text-2xl font-black tracking-tight">CoDO</h2>
            </Link>
            <p className="text-zinc-400 mt-6 leading-relaxed max-w-sm text-sm font-medium">
              The premier collaboration platform where students connect, build dynamic teams, and create amazing projects together.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Platform</h3>
            <ul className="space-y-4">
              <FooterLink to="#">Explore Students</FooterLink>
              <FooterLink to="#">Organizations</FooterLink>
              <FooterLink to="#">Hackathons</FooterLink>
              <FooterLink to="#">Live Events</FooterLink>
            </ul>
          </div>

          {/* Community Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Community</h3>
            <ul className="space-y-4">
              <FooterLink to="#">Student Teams</FooterLink>
              <FooterLink to="#">Project Showcase</FooterLink>
              <FooterLink to="#">Developer Network</FooterLink>
              <FooterLink to="#">Help & Support</FooterLink>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-violet-900 border border-violet-800 flex items-center justify-center hover:bg-violet-800 hover:text-white text-zinc-400 transition-all hover:-translate-y-1"
                title="GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-violet-900 border border-violet-800 flex items-center justify-center hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white text-zinc-400 transition-all hover:-translate-y-1"
                title="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-violet-900 border border-violet-800 flex items-center justify-center hover:bg-white hover:border-white hover:text-black text-zinc-400 transition-all hover:-translate-y-1"
                title="X / Twitter"
              >
                <FaXTwitter size={18} />
              </a>
              <a
                href="mailto:support@codo.com"
                className="h-10 w-10 rounded-xl bg-violet-900 border border-violet-800 flex items-center justify-center hover:bg-violet-600 hover:border-violet-600 hover:text-white text-zinc-400 transition-all hover:-translate-y-1"
                title="Email Us"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-violet-800/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-400">
          <p className="text-center md:text-left">
            © {currentYear} CoDO. Built for student collaboration.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
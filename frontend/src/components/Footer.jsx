import { Code2 } from "lucide-react";
import { Link } from "react-router-dom"; // Assuming you are using react-router
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/60 bg-white pt-16 pb-8 mt-auto">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Top Section: Branding & Link Columns */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Spans 4 columns on large screens) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 select-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
                <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">
                CoDO
              </h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mt-2">
              The world is waiting for your next build. Join the fastest-growing network of architects and developers.
            </p>
          </div>

          {/* Links Column 1: Platform */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Platform</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/explore" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Explore</Link></li>
              <li><Link to="/hackathons" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Hackathons</Link></li>
              <li><Link to="/communities" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Communities</Link></li>
              <li><Link to="/events" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Resources */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Open Source</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Links Column 3: Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-violet-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-200/60 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {currentYear} CoDO Technologies, Inc. All rights reserved.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-violet-600 transition-colors hover:-translate-y-0.5 transform duration-200" aria-label="Twitter">
              <FaXTwitter size={20} />
            </a>
            <a href="#" className="hover:text-violet-600 transition-colors hover:-translate-y-0.5 transform duration-200" aria-label="GitHub">
              <FaGithub size={20}  />
            </a>
            <a href="#" className="hover:text-violet-600 transition-colors hover:-translate-y-0.5 transform duration-200" aria-label="LinkedIn">
              <FaLinkedin size={20}  />
            </a>
            <a href="#" className="hover:text-violet-600 transition-colors hover:-translate-y-0.5 transform duration-200" aria-label="Email">
              <MdEmail size={20}  />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
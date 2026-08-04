import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Top */}
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/coDO.svg"
                alt="CoDO"
                className="h-8 w-auto"
              />
              <span className="text-xl font-black text-slate-900 tracking-tight">
                CoDO
              </span>
            </Link>

            <p className="mt-2 max-w-md text-sm text-slate-500">
              Connect with students, build teams, and collaborate on projects.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FaLinkedin size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FaXTwitter size={14} />
            </a>
            <a
              href="mailto:support@codo.com"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-sm text-slate-500 md:flex-row">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-slate-800">
              CoDO
            </span>
            . Built for student collaboration.
          </p>

          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-slate-900 font-medium">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-slate-900 font-medium">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import { Code2, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaXTwitter, FaDiscord } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const FooterLink = ({ to = "#", children }) => (
    <li>
      <Link to={to} className="hover:text-white transition-colors duration-300">
        {children}
      </Link>
    </li>
  );
return (

<footer className="mt-auto bg-slate-950 text-white relative overflow-hidden">
  {/* Background glow */}
  <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/20 blur-3xl rounded-full"/>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
    {/* Main footer */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
{/* Brand */}

<div className="lg:col-span-2">
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center">
      <Code2 className="text-violet-600" size={25} />
    </div>
    <h2 className="text-2xl font-black">CoDO</h2>
  </div>
  <p className="text-slate-400 mt-5 leading-relaxed max-w-sm text-center md:text-left">

A collaboration platform where students connect,
build teams, and create amazing projects together.

</p>


</div>
{/* Platform */}

<div>
<h3 className="font-semibold mb-5">
Platform
</h3>


<ul className="space-y-3 text-sm text-slate-400">
            <FooterLink to="#">Explore Students</FooterLink>
            <FooterLink to="#">Organizations</FooterLink>
            <FooterLink to="#">Hackathons</FooterLink>
            <FooterLink to="#">Events</FooterLink>
</ul>

</div>

{/* Community */}

<div>

<h3 className="font-semibold mb-5">
Community
</h3>


<ul className="space-y-3 text-sm text-slate-400">
            <FooterLink to="#">Student Teams</FooterLink>
            <FooterLink to="#">Project Showcase</FooterLink>
            <FooterLink to="#">Developer Network</FooterLink>
            <FooterLink to="#">Support</FooterLink>
</ul>


</div>

{/* Contact */}

<div>

<h3 className="font-semibold mb-5">
Connect
</h3>


<div className="flex gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FaXTwitter />
          </a>
          <a
            href="mailto:support@codo.com"
            className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <Mail size={18} />
          </a>
</div>


</div>
</div>
    </div>
    {/* Bottom */}
    <div className="border-t border-white/10 mt-14 pt-6 flex flex-col items-center md:flex-row justify-between gap-4 text-sm text-slate-500">
<p className="text-center md:text-left">
© {currentYear} CoDO. Built for student collaboration.
</p>


<div className="flex gap-5">
          <Link to="#" className="hover:text-white cursor-pointer">
            Privacy
          </Link>
          <Link to="#" className="hover:text-white cursor-pointer">
            Terms
          </Link>
</div>


    </div>
</footer>
)

}
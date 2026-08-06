import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CalendarDays,
  Check,
  ChevronDown,
  Code2,
  GraduationCap,
  MessageCircle,
  Rocket,
  Search,
  Sparkles,
  Star,
  Users,
  Building,
  Target,
  Trophy,
  Globe2,
  FolderDot,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  UserCheck
} from "lucide-react";
import Footer from "../../components/Footer";
import NavBar from "../../components/Navbar";

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// --- HELPER COMPONENTS ---
function SectionTitle({ title, subtitle, centered = true }) {
  return (
    <div className={`mb-8 ${centered ? "mx-auto text-center" : "text-left"} max-w-3xl`}>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 dark:text-slate-500">{subtitle}</p>}
    </div>
  );
}

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        setStarted(true);
        const start = performance.now();
        const duration = 2000;

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * value));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// --- SECTIONS ---

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-slate-800 pt-16 pb-12 lg:pt-24 lg:pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-violet-400/20 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-2 lg:items-center xl:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 dark:bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-700">
            <Sparkles size={14} /> The #1 Platform for Student Collaboration
          </div>
          <h1 className="text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-slate-100 md:text-7xl">
            Find Teammates. <br />
            <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Build Projects.</span><br />
            Grow Together.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400 dark:text-slate-500 md:text-xl">
            Connect with students, discover campus events, recruit teammates, and turn ideas into real projects—all from one platform.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/signup" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-1 hover:bg-violet-700 hover:shadow-violet-600/30">
              <GraduationCap size={20} /> Join as Student
            </Link>
            <a href="#platform" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 px-6 py-4 text-base font-bold text-slate-700 dark:text-slate-300 transition-colors hover:border-violet-200 hover:bg-violet-50 dark:hover:bg-violet-500/20 dark:bg-violet-500/20 hover:text-violet-700">
              Explore Platform <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div 
          className="relative lg:ml-auto w-full max-w-[600px] rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 dark:bg-slate-950/60 p-4 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          {/* Mac window controls */}
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="h-3 w-3 rounded-full bg-rose-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Student Profile Card */}
            <div className="col-span-2 flex items-center gap-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 p-4 shadow-sm transition-transform hover:-translate-y-1">
              <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="h-14 w-14 shrink-0 rounded-full border-2 border-slate-100 dark:border-slate-800 object-cover" />
              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Alex Chen</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Computer Science • Junior</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded bg-violet-100 dark:bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-700">React</span>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">Node.js</span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">UI/UX</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <button className="rounded-lg bg-slate-900 dark:bg-slate-950 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800">Connect</button>
              </div>
            </div>

            {/* Project Card */}
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 p-4 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-block rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Project</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-right">1 Role Open</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Campus Marketplace</h4>
              <div className="mt-3 flex -space-x-2">
                <img src="https://i.pravatar.cc/150?img=32" className="h-6 w-6 rounded-full border-2 border-white" alt="member" />
                <img src="https://i.pravatar.cc/150?img=12" className="h-6 w-6 rounded-full border-2 border-white" alt="member" />
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white text-[10px] font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500">+2</div>
              </div>
            </div>

            {/* Event Card */}
            <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 p-4 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-block rounded-md bg-emerald-50 dark:bg-emerald-500/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">Hackathon</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">3d left</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">Build for Good 2026</h4>
              <button className="mt-3 w-full rounded-md bg-violet-600 px-2 py-1.5 text-xs font-bold text-white transition-colors hover:bg-violet-700">RSVP</button>
            </div>
            
            {/* Chat preview */}
            <div className="col-span-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 dark:bg-slate-950 p-4 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2 mb-3">
                <MessageCircle size={14} className="text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500">Team Chat - Marketplace App</span>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <img src="https://i.pravatar.cc/150?img=32" className="h-6 w-6 shrink-0 rounded-full" alt="avatar" />
                  <div className="rounded-r-lg rounded-bl-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-700 dark:text-slate-300">Anyone ready to start on the Auth flow?</div>
                </div>
                <div className="flex flex-row-reverse gap-2">
                  <img src="https://i.pravatar.cc/150?img=68" className="h-6 w-6 shrink-0 rounded-full" alt="avatar" />
                  <div className="rounded-l-lg rounded-br-lg bg-violet-600 px-3 py-2 text-xs text-white">I'll pick it up tonight! 🚀</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TickerSection() {
  return (
    <div className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 py-3 overflow-hidden flex">
      <motion.div 
        className="flex whitespace-nowrap gap-10 px-10 text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-10">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/200" /> Live on CoDO: 128 students looking for teammates</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/200" /> 54 open projects looking for contributors</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/200" /> 21 hackathons happening this week</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/200" /> 300+ Active organizations hiring</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function TrustedBySection() {
  const tags = ["🏫 University Clubs", "💻 Hackathon Teams", "🌍 Student Communities", "🚀 Campus Startups", "🎓 Student Chapters"];
  
  return (
    <section className="border-y border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 py-8">
      <div className="mx-auto max-w-[1280px] px-6 text-center">
        <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Built for Student Communities</h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {tags.map((tag) => (
            <div key={tag} className="rounded-full border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 shadow-sm transition-colors hover:border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800">
              {tag}
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs font-semibold text-slate-400 dark:text-slate-500">More communities joining soon.</p>
      </div>
    </section>
  );
}

function WhatIsCodoSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-800 py-16">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <SectionTitle 
          title="Everything you need to collaborate." 
          subtitle="Stop switching between WhatsApp, Discord, LinkedIn, and spreadsheets. CoDO brings everything together in one unified platform."
        />
        
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Find Teammates (Large Card) */}
          <div className="lg:col-span-2 lg:row-span-2 flex flex-col justify-between group rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 p-7 transition-all hover:shadow-xl hover:shadow-violet-600/10">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Find Teammates</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 dark:text-slate-500 max-w-md">Discover students with the exact skills you need for your next big idea. Filter by major, technical stack, or interests.</p>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner h-40 bg-slate-50 dark:bg-slate-800 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')] bg-cover bg-center opacity-80 mix-blend-multiply"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            </div>
          </div>

          {/* Discover Events */}
          <div className="group rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 p-7 transition-all hover:shadow-xl hover:shadow-violet-600/10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CalendarDays size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Discover Events</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 dark:text-slate-500">Never miss a campus hackathon, workshop, or tech meetup again.</p>
          </div>

          {/* Chat Together */}
          <div className="group rounded-3xl border border-slate-800 bg-slate-900 dark:bg-slate-950 p-7 text-white transition-all hover:shadow-xl hover:shadow-violet-600/20">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <MessageCircle size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-white">Chat Together</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400 dark:text-slate-500">Communicate seamlessly with your team without switching apps.</p>
          </div>

          {/* Build Projects */}
          <div className="lg:col-span-3 group flex flex-col md:flex-row items-center gap-7 rounded-3xl border border-violet-100 bg-violet-50 dark:bg-violet-500/20 p-7 transition-all hover:shadow-xl hover:shadow-violet-600/10">
             <div className="flex-1">
               <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white">
                <Rocket size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Build Projects & Portfolio</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 dark:text-slate-500">Collaborate effectively, showcase your work, and build a stellar portfolio that lands you opportunities.</p>
             </div>
             <div className="w-full md:w-1/3 mt-4 md:mt-0">
               <div className="rounded-2xl bg-white dark:bg-slate-900 dark:bg-slate-950 p-5 shadow-sm border border-violet-100">
                  <div className="flex gap-2 mb-3">
                    <span className="h-2.5 w-12 rounded-full bg-violet-200"/>
                    <span className="h-2.5 w-8 rounded-full bg-blue-200"/>
                  </div>
                  <div className="h-20 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 mb-3 flex items-center justify-center text-slate-300">
                    <Code2 size={24} />
                  </div>
                  <div className="h-9 w-full rounded-xl bg-violet-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">Create Project</span>
                  </div>
               </div>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

function PlatformPreviewSection() {
  return (
    <section id="platform" className="overflow-hidden bg-slate-900 dark:bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Everything You Need to Build Together.</h2>
          <p className="mt-4 text-base text-slate-400 dark:text-slate-500">See how CoDO helps students collaborate, network, and grow their careers.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Large Student Profile */}
          <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-950/50 p-6 lg:col-span-2">
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white"><UserCheck className="text-violet-400"/> Student Profile</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Showcase skills, projects, achievements and interests to help teammates find you.</p>
            </div>
            
            <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900 dark:bg-slate-950 p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="h-20 w-20 rounded-full border-4 border-slate-800 object-cover" />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white">Alex Chen</h4>
                  <p className="text-sm text-violet-400 font-semibold">Computer Science Major | Class of '26</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">Frontend Dev</span>
                    <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">React</span>
                    <span className="rounded-md bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">Tailwind CSS</span>
                  </div>
                </div>
                <button className="hidden sm:block rounded-lg bg-white dark:bg-slate-900 dark:bg-slate-950 px-5 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100">Connect</button>
              </div>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-6">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Projects</p>
                  <p className="mt-1 text-lg font-bold text-white">14 Built</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Hackathons</p>
                  <p className="mt-1 text-lg font-bold text-white">5 Won</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Top Project</p>
                  <p className="mt-1 text-sm font-bold text-white truncate">Smart Campus Navigation App</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Recruitment */}
          <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white"><Target className="text-rose-400"/> Team Recruitment</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Find the perfect candidates for your projects with precision matching.</p>
            </div>
            
            <div className="mt-auto space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900 dark:bg-slate-950 p-4 transition-colors hover:bg-slate-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-bold text-white">Need React Developer</h5>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Project: AI Resume Builder</p>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-500/200/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">Open</span>
                </div>
                <button className="mt-4 w-full rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700">Apply Now</button>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 dark:bg-slate-950 p-4 transition-colors hover:bg-slate-800/80">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-sm font-bold text-white">UI/UX Designer</h5>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Project: Green Campus</p>
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-500/200/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded">Open</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-950/50 p-6 lg:col-span-2">
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white"><MessageCircle className="text-blue-400"/> Seamless Chat</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Coordinate with your teammates directly without ever switching apps.</p>
            </div>
            
            <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900 dark:bg-slate-950 p-6">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                 <div className="flex -space-x-2">
                   <img src="https://i.pravatar.cc/150?img=32" className="h-8 w-8 rounded-full border-2 border-slate-900" alt="team" />
                   <img src="https://i.pravatar.cc/150?img=12" className="h-8 w-8 rounded-full border-2 border-slate-900" alt="team" />
                 </div>
                 <p className="text-sm font-bold text-white">Smart Campus App - Frontend Team</p>
               </div>
               <div className="space-y-4">
                 <div className="flex gap-3">
                   <img src="https://i.pravatar.cc/150?img=32" className="h-8 w-8 rounded-full shrink-0" alt="Sarah" />
                   <div className="rounded-2xl rounded-tl-sm bg-slate-800 p-3 text-sm text-slate-300">
                     <p className="text-xs font-bold text-violet-400 mb-1">Sarah M.</p>
                     Has anyone started on the authentication flow yet? I have the designs ready.
                   </div>
                 </div>
                 <div className="flex gap-3 flex-row-reverse">
                   <img src="https://i.pravatar.cc/150?img=68" className="h-8 w-8 rounded-full shrink-0" alt="Alex" />
                   <div className="rounded-2xl rounded-tr-sm bg-violet-600 p-3 text-sm text-white">
                     I'll pick it up tonight! Just finished setting up the routing. 🚀
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Event Page Preview */}
          <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-950/50 p-6">
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-white"><CalendarDays className="text-emerald-400"/> Discover Events</h3>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Never miss out on hackathons, workshops, and meetups.</p>
            </div>
            
            <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900 dark:bg-slate-950 overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-4">
                <span className="bg-white dark:bg-slate-900 dark:bg-slate-950/20 px-2 py-1 text-[10px] font-bold text-white rounded">Hackathon</span>
                <h4 className="text-lg font-bold text-white mt-6">Build for Good 2026</h4>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mb-1">Oct 24-26 • Hybrid</p>
                <p className="text-sm text-slate-300 line-clamp-2">Join us for a 48-hour sprint to build the next generation of campus tools.</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                   <img src="https://i.pravatar.cc/150?img=1" className="h-6 w-6 rounded-full border border-slate-900" alt="attendee" />
                   <img src="https://i.pravatar.cc/150?img=2" className="h-6 w-6 rounded-full border border-slate-900" alt="attendee" />
                   <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[8px] border border-slate-900">+120</div>
                  </div>
                  <button className="text-xs font-bold text-emerald-400 hover:text-emerald-300">RSVP →</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Ready to experience CoDO?</h3>
          <Link to="/signup" className="inline-block rounded-xl bg-violet-600 px-7 py-3 text-base font-bold text-white shadow-lg shadow-violet-600/30 transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/20 dark:bg-violet-500/200">
            Join Free Today
          </Link>
        </div>

      </div>
    </section>
  );
}

function WhyStudentsLoveCodoSection() {
  const reasons = [
    { icon: Target, title: "Find teammates faster", desc: "Our precise matching connects you with the exact skills you need." },
    { icon: Trophy, title: "Build better projects", desc: "Collaborate with top-tier talent on your campus and beyond." },
    { icon: Globe2, title: "Beyond your college", desc: "Network with motivated students from universities nationwide." },
    { icon: CalendarDays, title: "Never miss out", desc: "Get notified about hackathons, tech talks, and exclusive events." },
    { icon: FolderDot, title: "Showcase your work", desc: "A unified portfolio that recruiters and teammates actually look at." },
    { icon: MessageCircle, title: "Stay connected", desc: "Built-in chat makes team communication incredibly seamless." },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <SectionTitle title="Why Students Love CoDO" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div key={i} className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-6 transition-all hover:bg-white dark:bg-slate-900 dark:bg-slate-950 hover:shadow-lg hover:shadow-violet-600/10 hover:border-violet-200">
              <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 dark:bg-slate-950 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 dark:text-slate-500 transition-colors group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600">
                <r.icon size={22} strokeWidth={2.5} />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">{r.title}</h4>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuiltForEveryoneSection() {
  return (
    <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <SectionTitle title="Built for Everyone" subtitle="Whether you are an individual builder or a campus community, we have the tools you need." />
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Students */}
          <div className="flex flex-col rounded-3xl border border-violet-100 bg-violet-50 dark:bg-violet-500/20 p-6 sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/30">
              <GraduationCap size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Students</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">Accelerate your learning, build a real-world portfolio, and network with peers.</p>
            
            <ul className="mt-5 mb-7 flex-1 space-y-2.5">
              {["Find teammates", "Discover projects", "Join campus events", "Connect with students", "Showcase your skills", "Build your network"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-200 text-violet-700"><Check size={11} /></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <Link to="/signup" className="mt-auto block w-full rounded-xl bg-violet-600 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-violet-700">Join as Student</Link>
          </div>

          {/* Organizations */}
          <div className="flex flex-col rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 p-6 sm:p-8 shadow-lg shadow-slate-200/50">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-950 text-white shadow-lg shadow-slate-900/20">
              <Building size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">Grow Your Student Community</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500">Connect with talented students, promote your initiatives, and build stronger campus communities.</p>
            
            <ul className="mt-5 mb-7 flex-1 space-y-2.5">
              {["Find talented students", "Connect with active communities", "Build stronger teams", "Reach the right audience", "Grow your campus presence", "Discover future leaders"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"><Check size={11} /></div>
                  {item}
                </li>
              ))}
            </ul>
            
            <Link to="/signup?type=org" className="mt-auto block w-full rounded-xl bg-slate-900 dark:bg-slate-950 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-slate-800">Register Organization</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function LivePlatformSection2() {
  const roles = [
    { title: "Need React Developer", project: "Project: AI Resume Builder" },
    { title: "UI/UX Designer", project: "Project: Green Campus App" },
    { title: "Python/AI Lead", project: "Project: Neural Tutor" },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500">Check out what's happening right now in the CoDO ecosystem.</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Featured Event */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">Featured Event</h4>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 overflow-hidden shadow-sm flex flex-col h-[320px]">
              <div className="bg-violet-600 p-6 text-white flex-1 flex flex-col justify-center">
                <div>
                  <span className="inline-block rounded-full bg-white dark:bg-slate-900 dark:bg-slate-950/20 px-3 py-1 text-[10px] font-bold">Official Event</span>
                </div>
                <h3 className="text-xl font-bold mt-4">AI Hackathon by GDG</h3>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900 dark:bg-slate-950 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 font-medium">
                    <CalendarDays size={14} /> Oct 24-26 • Hybrid
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-3 leading-relaxed">
                    Join Google Developer Group for a 48-hour sprint to build the next generation of AI tools.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white" />
                    ))}
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 border-2 border-white text-[8px] font-bold text-white">
                      +42
                    </div>
                  </div>
                  <button className="rounded-lg bg-violet-100 dark:bg-violet-500/20 px-4 py-2 text-xs font-bold text-violet-700 hover:bg-violet-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Open Roles */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">Open Roles</h4>
            <div className="flex flex-col gap-4">
              {roles.map((role, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{role.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">{role.project}</p>
                  </div>
                  <button className="rounded-lg bg-violet-700 px-5 py-2 text-xs font-bold text-white hover:bg-violet-800 transition-colors">
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Active Student */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">Active Student</h4>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 p-6 shadow-sm h-[320px] flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Rahul Sharma" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Rahul Sharma</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {["React", "Node.js", "AWS", "Python"].map(skill => (
                  <span key={skill} className="rounded bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500">
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-800 my-4" />
              
              <div className="flex justify-around text-center mb-auto">
                <div>
                  <p className="text-lg font-bold text-violet-700">12</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Projects</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-violet-700">850+</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Points</p>
                </div>
              </div>
              
              <button className="mt-4 w-full rounded-lg border border-violet-200 bg-white dark:bg-slate-900 dark:bg-slate-950 px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-500/20 dark:bg-violet-500/20 transition-colors">
                View Profile
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { title: "Create Account", desc: "Sign up with your student email and build your developer profile." },
    { title: "Discover & Connect", desc: "Find teammates with the exact skills needed for your idea." },
    { title: "Build & Collaborate", desc: "Join projects, attend hackathons, and ship real products." },
    { title: "Grow Portfolio", desc: "Showcase your achievements to recruiters and the community." }
  ];

  return (
    <section className="bg-slate-900 dark:bg-slate-950 py-16 text-white">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">How CoDO Works</h2>
          <p className="mt-4 text-base text-slate-400 dark:text-slate-500">Your journey from student to shipped product.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[50%] right-[-50%] h-[2px] bg-gradient-to-r from-violet-600/50 to-transparent" />
              )}
              <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 text-xl font-black text-violet-400">
                {index + 1}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseCodoSection() {
  const comparisons = [
    { other: "WhatsApp only chats", codo: "Teams + Chat" },
    { other: "LinkedIn networking", codo: "Student collaboration" },
    { other: "Discord servers", codo: "Projects + Events" },
    { other: "Telegram groups", codo: "Student profiles" },
    { other: "Many different apps", codo: "Everything together" },
  ];

  return (
    <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-4xl px-6 xl:px-8">
        <SectionTitle title="Why Choose CoDO?" subtitle="Stop juggling tools. Use the all-in-one platform." />
        
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <div>Other Platforms</div>
            <div className="text-violet-600">CoDO</div>
          </div>
          <div className="divide-y divide-slate-100">
            {comparisons.map((row, i) => (
              <div key={i} className="grid grid-cols-2 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800">
                <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                  <span className="text-slate-300">✕</span> {row.other}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <Check size={16} className="text-violet-500 shrink-0" /> {row.codo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const statsList = [
    { label: "Students Joining Soon", value: 5000 },
    { label: "Campus Organizations", value: 250 },
    { label: "Projects Waiting", value: 1200 },
    { label: "Upcoming Events", value: 300 },
  ];

  return (
    <section className="border-y border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-12">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-6 text-center sm:grid-cols-2 lg:grid-cols-4 xl:px-8">
        {statsList.map((stat, i) => (
          <div key={i}>
            <p className="text-3xl font-black text-violet-600 md:text-4xl"><CountUp value={stat.value} suffix="+" /></p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommunityShowcaseSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-800 py-16">
      <div className="mx-auto max-w-[1280px] px-6 xl:px-8">
        <SectionTitle title="Community Showcase" subtitle="Real stories from students building the future." />
        
        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1">
          <div className="rounded-[23px] bg-white dark:bg-slate-900 dark:bg-slate-950 p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/20 text-2xl">🚀</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">Your Success Story Could Be Here</h3>
            <div className="mt-5 space-y-2 text-base font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500">
              <p>Launch your first project.</p>
              <p>Win your first hackathon.</p>
              <p>Meet amazing teammates.</p>
              <p className="text-violet-600">Grow together.</p>
            </div>
            <Link to="/signup" className="mt-6 inline-block rounded-xl bg-slate-900 dark:bg-slate-950 px-7 py-3 font-bold text-white transition-colors hover:bg-slate-800">Start Your Story</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ openFaq, setOpenFaq }) {
  const faqs = [
    "Is CoDO free?",
    "Can any student join?",
    "Can organizations register?",
    "How do I find teammates?",
    "Can I create projects?",
    "Is chat available?",
    "Can students from different colleges connect?"
  ];

  const getAnswer = () => {
    return "Yes! CoDO is designed to make student collaboration as easy as possible. Whether you are looking to build projects, join hackathons, or simply network with peers, you'll find all the tools you need right here on the platform.";
  };

  return (
    <section className="bg-white dark:bg-slate-900 dark:bg-slate-950 py-16">
      <div className="mx-auto max-w-3xl px-6 xl:px-8">
        <SectionTitle title="FAQ" subtitle="Got questions? We've got answers." />
        <div className="space-y-3">
          {faqs.map((q, index) => (
            <div key={index} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-950 overflow-hidden transition-all hover:border-violet-200">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)} 
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                {q}
                <ChevronDown size={18} className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${openFaq === index ? "rotate-180 text-violet-600" : ""}`} />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 text-sm text-slate-600 dark:text-slate-400 dark:text-slate-500 leading-relaxed">{getAnswer(q)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-16 px-6 xl:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 px-6 py-16 text-center text-white shadow-2xl md:px-16">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-1/2 left-1/2 h-full w-full -translate-x-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Ready to build something amazing?</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              Join CoDO today and connect with students who are ready to build, learn, and grow together.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/signup" className="rounded-xl bg-violet-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-violet-600/25 transition-colors hover:bg-violet-50 dark:hover:bg-violet-500/20 dark:bg-violet-500/200">
                Join as Student
              </Link>
              <Link to="/signup?type=org" className="rounded-xl bg-white dark:bg-slate-900 dark:bg-slate-950 px-7 py-3.5 text-base font-bold text-slate-900 dark:text-slate-100 transition-colors hover:bg-slate-100 dark:bg-slate-800">
                Register Organization
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("accountType");
  const username = localStorage.getItem("username");
  const [openFaq, setOpenFaq] = useState(null);

  if (token) {
    if (role === "student") return <Navigate to={`/user/${username}`} replace />;
    if (role === "organization") return <Navigate to={`/organization/${username}`} replace />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-violet-200 selection:text-violet-900">
      <NavBar location="landing" />

      <main>
        <HeroSection />
        <TickerSection />
        <TrustedBySection />
        <WhatIsCodoSection />
        <PlatformPreviewSection />
        <WhyStudentsLoveCodoSection />
        <BuiltForEveryoneSection />
        <LivePlatformSection2 />
        <HowItWorksSection />
        <WhyChooseCodoSection />
        <StatsSection />
        <CommunityShowcaseSection />
        <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <FinalCTASection />
      </main>

      <Footer />
    </div>
  );
}

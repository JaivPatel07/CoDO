import {
  Sparkles,
  UserPlus,
  Building2,
  CalendarDays,
  Users,
} from "lucide-react";
import TrendingEvents from "../../../components/TrendingEvents";
import UpcomingEvents from "../../../components/UpcomingEvents";
import { useContext } from "react";
import { UserContext } from "../../../contextAPI/userContext";

import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { userData } = useContext(UserContext);

  const navigate = useNavigate();

  return (
    <div>
      <div className="font-sans text-slate-800">
        <main className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Hero Card (Animations removed so it shows instantly) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100/50 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-blue-50/50 blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                  </span>
                  <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                    System Online
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-2 leading-tight">
                  Welcome back, {userData.username}.
                </h1>
                <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-indigo-500 leading-tight">
                  The world is waiting for your{" "}
                  <br className="hidden md:block" />
                  next build.
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
                <div className="bg-indigo-50/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-1">
                    Active Streak
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">
                    12 Days
                  </p>
                </div>
                <div className="bg-indigo-50/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-1">
                    Active Streak
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">
                    12 Days
                  </p>
                </div>
                <div className="bg-indigo-50/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-1">
                    Active Streak
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">
                    12 Days
                  </p>
                </div>
                <div className="bg-indigo-50/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-indigo-100/50 transition-all duration-300 hover:-translate-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 mb-1">
                    Active Streak
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">
                    12 Days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Cards (Updated with correct icons and colors) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 md:gap-6">
            <button className="group flex flex-col items-center justify-center gap-4 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border rounded-5 border-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
              <Sparkles
                size={34}
                strokeWidth={1.5}
                className="text-indigo-500 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-semibold text-slate-700">
                Forge Project
              </span>
            </button>

            {/* <button className="group flex flex-col items-center justify-center gap-4 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border rounded-5 border-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <UserPlus
                size={34}
                strokeWidth={1.5}
                className="text-purple-600 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-semibold text-slate-700">
                Enlist in Team
              </span>
            </button> */}
            <button
              onClick={() => navigate(`/user/${userData.username}/suggestions`)}
              className="group flex flex-col items-center justify-center gap-4 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border rounded-5 border-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <Users
                size={34}
                strokeWidth={1.5}
                className="text-purple-600 transition-transform duration-300 group-hover:scale-110"
              />

              <span className="text-sm font-semibold text-slate-700">
                People You May Know
              </span>
            </button>

            <button className="group flex flex-col items-center justify-center gap-4 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border rounded-5 border-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10">
              <Building2
                size={34}
                strokeWidth={1.5}
                className="text-amber-600 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-semibold text-slate-700">
                Nexus (Orgs)
              </span>
            </button>

            <button className="group flex flex-col items-center justify-center gap-4 bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border rounded-5 border-slate-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-500/10">
              <CalendarDays
                size={34}
                strokeWidth={1.5}
                className="text-slate-800 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-sm font-semibold text-slate-700">
                Chronos (Events)
              </span>
            </button>
          </div>
        </main>
      </div>

      <div className="px-4 md:px-2 pb-6">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TrendingEvents />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

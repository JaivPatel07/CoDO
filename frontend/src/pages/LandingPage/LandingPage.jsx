import { Link } from "react-router-dom";
import { FaArrowRight, FaLightbulb, FaUsers } from "react-icons/fa";
import Footer from "../../components/Footer";
import NavBar from "../../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <NavBar variant="landing" />

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
              Collaborate without the confusion
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Build student teams, find opportunities, and grow with CoDO.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              CoDO helps students connect with teammates, projects, events, and organizations from one focused workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Sign Up <FaArrowRight />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 font-bold text-slate-700 transition hover:bg-white"
              >
                Already have an account
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <FaUsers className="mb-4 text-3xl text-indigo-600" />
              <h2 className="text-xl font-bold">Find your people</h2>
              <p className="mt-2 text-slate-600">Discover classmates, builders, mentors, and teams that match your goals.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <FaLightbulb className="mb-4 text-3xl text-emerald-600" />
              <h2 className="text-xl font-bold">Turn ideas into projects</h2>
              <p className="mt-2 text-slate-600">Track events, collaborate on posts, and move from interest to real work faster.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
      <h1 className="text-8xl font-bold text-slate-900">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-slate-800">
        Page Not Found
      </h2>

      <p className="mt-2 text-slate-500 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
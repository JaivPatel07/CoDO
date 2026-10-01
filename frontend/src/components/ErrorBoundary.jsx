import { Component } from "react";
import { Link } from "react-router-dom";

/**
 * Top-level error boundary.
 *
 * Without this, a single render error anywhere in the tree unmounts the whole
 * React app and the user is left staring at a blank white page with no way
 * back. This renders a friendly recovery screen instead and reports the error.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Keep a structured record so production crashes are diagnosable.
    console.error("Uncaught error in React tree:", error, errorInfo);

    if (typeof window !== "undefined" && window.__CODO_ERROR_REPORTER__) {
      try {
        window.__CODO_ERROR_REPORTER__(error, errorInfo);
      } catch {
        // never let reporting break the recovery UI
      }
    }
  }

  handleReset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    const { error, errorInfo } = this.state;

    if (!error) {
      return this.props.children;
    }

    const isDev = import.meta.env.DEV;

    return (
      <div
        role="alert"
        className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950"
      >
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            An unexpected error interrupted this page. You can try again, or head
            back to the homepage — nothing you did before this point was lost.
          </p>

          {isDev && (
            <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-700 dark:bg-slate-800/60">
              <summary className="cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                Technical details (development only)
              </summary>
              <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] text-rose-700 dark:text-rose-300">
                {error?.toString()}
                {"\n\n"}
                {errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Reload page
            </button>
            <Link
              to="/"
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

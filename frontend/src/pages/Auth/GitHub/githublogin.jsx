import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { user_api } from "../../../api/axios";
import { FaGithub } from "react-icons/fa";
import { AlertCircle, Loader2 } from "lucide-react";

/**
 * GitHub OAuth landing page.
 *
 * GitHub redirects here with `?code=...` on success, or `?error=...` when the
 * user denies access. The callback parameters are read during render (they are
 * immutable for the lifetime of this mount) and only the token exchange runs in
 * an effect — that keeps the validation out of a state-syncing effect.
 */
export default function GithubCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const oauthError = params.get("error");

  const callbackError = oauthError
    ? "GitHub authorization was cancelled or failed. Please try again."
    : !code
      ? "Missing GitHub authorization code. Please try connecting again."
      : null;

  useEffect(() => {
    if (callbackError || !code) return;

    (async () => {
      try {
        // user_api (not a bare axios instance) so the token-refresh
        // interceptor kicks in if the access token has expired.
        await user_api.post("github/login/", { code });
        navigate(
          `/user/${localStorage.getItem("username")}/profile/`,
          { replace: true }
        );
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.error ||
            "Failed to connect GitHub. Please try again."
        );
      }
    })();
  }, [code, callbackError, navigate]);

  const displayError = callbackError || error;
  const profilePath = `/user/${localStorage.getItem("username")}/profile/`;

  if (displayError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            GitHub Connection Failed
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
            {displayError}
          </p>
          <button
            type="button"
            onClick={() => navigate(profilePath, { replace: true })}
            className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
          <FaGithub size={24} />
        </div>
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Connecting GitHub…
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          Linking your repositories to CoDO. This only takes a moment.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
          <Loader2 size={16} className="animate-spin" />
          Please wait
        </div>
      </div>
    </div>
  );
}

import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  Copy,
  ExternalLink,
  Laptop2,
  LifeBuoy,
  Mail,
  MessageSquare,
  Moon,
  Palette,
  Save,
  Settings2,
  SunMedium,
  User,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { UserContext } from "../../contextAPI/userContext";
import { fetch_user } from "../../api/user_apis";
import { submit_bug_report, submit_feedback, update_user_account } from "../../api/settings_apis";
import { useTheme } from "../../hooks/useTheme";

const THEME_OPTIONS = [
  { value: "light", label: "Light Mode", icon: SunMedium, description: "Bright surfaces with high readability." },
  { value: "dark", label: "Dark Mode", icon: Moon, description: "Low-light friendly with reduced glare." },
  { value: "system", label: "System", icon: Laptop2, description: "Match your device preference automatically." },
];

const BUG_CATEGORIES = ["UI / UX", "Account", "Performance", "Security", "Other"];

function SectionShell({ title, description, children }) {
  return (
<section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
  );
}
function getFriendlyErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    return error.join(" ");
  }

  if (error && typeof error === "object") {
    if (error.detail) return error.detail;
    if (error.message) return error.message;
  }

  return "Something went wrong. Please try again.";
}

function validateAccount(form) {
  const errors = {};
  const username = form.username.trim();
  const email = form.email.trim();

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 3 || username.length > 150) {
    errors.username = "Username must be between 3 and 150 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function mergeBackendErrors(responseData) {
  const fieldErrors = {};
  const messages = [];

  if (!responseData || typeof responseData !== "object") {
    return { fieldErrors, messages };
  }

  Object.entries(responseData).forEach(([key, value]) => {
    const message = getFriendlyErrorMessage(value);

    if (["username", "email", "subject", "description", "category", "feedback"].includes(key)) {
      fieldErrors[key] = message;
      return;
    }

    messages.push(message);
  });

  return { fieldErrors, messages };
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
className={`rounded-2xl border px-4 py-3 ${toast.type === "success"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
              : "border-rose-200 bg-rose-50/95 text-rose-900"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-full p-1.5 ${toast.type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
                <CheckCircle2 className={toast.type === "success" ? "text-emerald-600" : "text-rose-600"} size={16} />
              </div> 
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-0.5 text-sm opacity-90">{toast.message}</p>
              </div>
              <button type="button" onClick={() => onDismiss(toast.id)} className="rounded-lg p-1 text-current/70 transition hover:bg-black/5 hover:text-current" aria-label="Dismiss notification">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Modal({ open, title, description, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 dark:text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:text-slate-300" aria-label="Close dialog">
                <X size={18} />
              </button>
            </div>
            <div className="pt-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FieldShell({ label, error, children, hint, required = false }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span>{label}</span>
        {required && <span className="text-rose-500">*</span>}
      </div>
      {children}
      {hint && !error ? <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
      {error ? <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p> : null}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", autoComplete, error, disabled }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      disabled={disabled}
      className={`h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition placeholder:text-slate-400 dark:text-slate-500 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-950 ${error
        ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-violet-100"
        }`}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 5, error, disabled }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full resize-none rounded-xl border px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 dark:text-slate-500 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-950 ${error
        ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-violet-100"
        }`}
    />
  );
}

function ThemeOption({ option, active, onClick }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
className={`flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition ${active
        ? "border-violet-300 bg-violet-50 dark:border-violet-500 dark:bg-violet-950/40 ring-4 ring-violet-100 dark:ring-violet-900/30"
        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
    >
      <div className={`mt-0.5 rounded-xl p-2 ${active ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500 dark:text-slate-400"}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{option.label}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
      </div>
    </button>
  );
}

function SupportActionCard({ icon: Icon, title, description, actionLabel, onClick, secondaryAction }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-slate-100 p-3 text-slate-600 dark:text-slate-400">
          <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          <div className="mt-4">
            <button type="button" onClick={onClick} className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
              {actionLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user_name } = useParams();
  const { userData, setUserData } = useContext(UserContext);
  const { theme, setTheme } = useTheme();
  const currentUserName = user_name || localStorage.getItem("username") || "";

  const [toasts, setToasts] = useState([]);
  const [accountLoading, setAccountLoading] = useState(Boolean(currentUserName));
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState(currentUserName ? "" : "Missing user context.");
  const [accountFieldErrors, setAccountFieldErrors] = useState({});
  const [originalAccount, setOriginalAccount] = useState({ username: "", email: "" });
  const [accountForm, setAccountForm] = useState({ username: "", email: "" });
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [bugSaving, setBugSaving] = useState(false);
  const [feedbackSaving, setFeedbackSaving] = useState(false);
  const [bugErrors, setBugErrors] = useState({});
  const [feedbackErrors, setFeedbackErrors] = useState({});
  const [bugForm, setBugForm] = useState({ subject: "", description: "" });
  const [feedbackForm, setFeedbackForm] = useState({ category: "UI / UX", feedback: "" });
  const [emailCopied, setEmailCopied] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState("");

  const pushToast = (type, title, message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, type, title, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const dismissToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (!currentUserName) {
      return;
    }

    let isMounted = true;

    const loadAccount = async () => {
      try {
        setAccountLoading(true);
        setAccountError("");
        const response = await fetch_user(currentUserName);
        const nextAccount = {
          username: response.data?.username || "",
          email: response.data?.email || "",
        };

        if (!isMounted) {
          return;
        }

        setAccountForm(nextAccount);
        setOriginalAccount(nextAccount);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error?.response?.data?.detail || error?.response?.data?.message || "Unable to load account settings.";
        setAccountError(message);
        pushToast("error", "Load failed", message);
      } finally {
        if (isMounted) {
          setAccountLoading(false);
        }
      }
    };

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, [currentUserName]);

  const updateAccountField = (field, value) => {
    setAccountForm((current) => ({ ...current, [field]: value }));
    setAccountFieldErrors((current) => ({ ...current, [field]: undefined }));
    setAccountError("");
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();

    const trimmedForm = {
      username: accountForm.username.trim(),
      email: accountForm.email.trim(),
    };

    const validationErrors = validateAccount(trimmedForm);
    if (Object.keys(validationErrors).length > 0) {
      setAccountFieldErrors(validationErrors);
      return;
    }

    try {
      setAccountSaving(true);
      setAccountFieldErrors({});
      const response = await update_user_account(currentUserName, trimmedForm);
      const updatedAccount = {
        username: response.data?.username || trimmedForm.username,
        email: response.data?.email || trimmedForm.email,
      };

      setUserData((current) => ({ ...current, ...response.data }));
      setOriginalAccount(updatedAccount);
      setAccountForm(updatedAccount);

      const previousUsername = localStorage.getItem("username") || currentUserName;
      if (updatedAccount.username && updatedAccount.username !== previousUsername) {
        localStorage.setItem("username", updatedAccount.username);
        navigate(`/user/${updatedAccount.username}/settings`, { replace: true });
      } else {
        localStorage.setItem("username", updatedAccount.username);
      }

      pushToast("success", "Account updated", "Your username and email were saved successfully.");
    } catch (error) {
      const responseData = error?.response?.data;
      const { fieldErrors, messages } = mergeBackendErrors(responseData);

      setAccountFieldErrors(fieldErrors);
      const message = messages[0] || responseData?.detail || responseData?.message || "Unable to update your account.";
      setAccountError(message);
      pushToast("error", "Save failed", message);
    } finally {
      setAccountSaving(false);
    }
  };

  const handleAccountReset = () => {
    setAccountForm(originalAccount);
    setAccountFieldErrors({});
    setAccountError("");
  };

  const copySupportEmail = async () => {
    try {
      await navigator.clipboard.writeText("support@codo.com");
      setEmailCopied(true);
      pushToast("success", "Copied", "support@codo.com was copied to your clipboard.");
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      pushToast("error", "Copy failed", "Unable to copy the support email.");
    }
  };

  const handleBugSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!bugForm.subject.trim()) nextErrors.subject = "Subject is required.";
    if (!bugForm.description.trim()) nextErrors.description = "Description is required.";

    if (Object.keys(nextErrors).length > 0) {
      setBugErrors(nextErrors);
      return;
    }

    try {
      setBugSaving(true);
      setBugErrors({});
      await submit_bug_report({ subject: bugForm.subject.trim(), description: bugForm.description.trim() });
      setBugModalOpen(false);
      setBugForm({ subject: "", description: "" });
      pushToast("success", "Bug report sent", "Thanks for helping improve CoDO.");
    } catch (error) {
      const { fieldErrors, messages } = mergeBackendErrors(error?.response?.data);
      setBugErrors(fieldErrors);
      const message = messages[0] || error?.response?.data?.detail || "Unable to submit the bug report.";
      pushToast("error", "Submission failed", message);
    } finally {
      setBugSaving(false);
    }
  };

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!feedbackForm.category.trim()) nextErrors.category = "Category is required.";
    if (!feedbackForm.feedback.trim()) nextErrors.feedback = "Feedback is required.";

    if (Object.keys(nextErrors).length > 0) {
      setFeedbackErrors(nextErrors);
      return;
    }

    try {
      setFeedbackSaving(true);
      setFeedbackErrors({});
      await submit_feedback({
        category: feedbackForm.category.trim(),
        feedback: feedbackForm.feedback.trim(),
      });
      setFeedbackModalOpen(false);
      setFeedbackForm({ category: "UI / UX", feedback: "" });
      pushToast("success", "Feedback sent", "Your feedback has been submitted.");
    } catch (error) {
      const { fieldErrors, messages } = mergeBackendErrors(error?.response?.data);
      setFeedbackErrors(fieldErrors);
      const message = messages[0] || error?.response?.data?.detail || "Unable to submit feedback.";
      pushToast("error", "Submission failed", message);
    } finally {
      setFeedbackSaving(false);
    }
  };

  const handleDeleteAccountClick = () => {
    setDeleteAccountModalOpen(true);
    setDeleteAccountError(""); // Clear previous errors
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleteAccountLoading(true);
    setDeleteAccountError("");
    try {
      // Using the existing update_user_account API to perform a soft delete (set is_active to false)
      await update_user_account(currentUserName, { is_active: false });
      pushToast("success", "Account Deleted", "Your account has been successfully deleted.");
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || error?.response?.data?.message || "Failed to delete account.";
      setDeleteAccountError(message);
      pushToast("error", "Deletion Failed", message);
    } finally {
      setDeleteAccountLoading(false);
      setDeleteAccountModalOpen(false);
    }
  };

  return (
    <div>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Account Section */}
        <SectionShell
          title="Profile Identity"
          description="Only username and email are editable here. Changes are saved immediately."
        >
          {accountLoading ? (
            <div className="space-y-5 animate-pulse">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="h-4 w-20 rounded-full bg-slate-200 mb-2" />
                  <div className="h-11 rounded-xl bg-slate-100" />
                </div>
                <div>
                  <div className="h-4 w-16 rounded-full bg-slate-200 mb-2" />
                  <div className="h-11 rounded-xl bg-slate-100" />
                </div>
              </div>
              <div className="h-10 w-32 rounded-lg bg-slate-100 ml-auto mt-4" />
            </div>
          ) : (
            <form onSubmit={handleAccountSubmit}>
              {accountError ? (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 shrink-0" size={16} />
                  <p>{accountError}</p>
                </div>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldShell label="Username" required error={accountFieldErrors.username} hint="3 to 150 characters. This is your public identity.">
                  <Input
                    value={accountForm.username}
                    onChange={(event) => updateAccountField("username", event.target.value)}
                    placeholder="Your username"
                    autoComplete="username"
                    error={!!accountFieldErrors.username}
                    disabled={accountSaving}
                  />
                </FieldShell>

                <FieldShell label="Email" required error={accountFieldErrors.email} hint="Used for authentication and notifications.">
                  <Input
                    value={accountForm.email}
                    onChange={(event) => updateAccountField("email", event.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    error={!!accountFieldErrors.email}
                    disabled={accountSaving}
                  />
                </FieldShell>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 dark:border-slate-800 pt-5 mt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleAccountReset}
                  disabled={accountSaving || accountLoading}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={accountSaving || accountLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {accountSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {accountSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </SectionShell>

        {/* Appearance Section */}
        <SectionShell
          title="Theme"
          description="Choose how CoDO looks. Your preference is saved for future visits."
        >
          <div className="grid gap-3 md:grid-cols-3">
            {THEME_OPTIONS.map((option) => (
              <ThemeOption
                key={option.value}
                option={option}
                active={theme === option.value}
                onClick={() => setTheme(option.value)}
              />
            ))}
          </div>
        </SectionShell>

        {/* Support Section */}
        <SectionShell
          title="Support & Feedback"
          description="Get help, report issues, or share your ideas to improve CoDO."
        >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SupportActionCard
            icon={Bug}
            title="Report a Bug"
            description="Found something broken? Help us improve CoDO."
            actionLabel="Report Bug"
            onClick={() => setBugModalOpen(true)}
          />

          <SupportActionCard
            icon={MessageSquare}
            title="Give Feedback"
            description="Share ideas to improve CoDO."
            actionLabel="Share Feedback"
            onClick={() => setFeedbackModalOpen(true)}
          />

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-600 dark:text-slate-400">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Contact Support</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Reach the CoDO team directly whenever you need help.</p>
                <div className="mt-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                  support@codo.com
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={copySupportEmail}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Copy size={15} />
                    {emailCopied ? "Copied" : "Copy Email"}
                  </button>
                  <a
                    href="mailto:support@codo.com"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    <ExternalLink size={15} />
                    Open Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </SectionShell>

        {/* Danger Zone section */}
        <SectionShell
          title="Danger Zone"
          description="These actions are permanent and cannot be undone."
        >
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-rose-900">Delete Your Account</h3>
                <p className="mt-1 text-sm text-rose-700/90 max-w-md">Permanently remove your account and all associated data from CoDO.</p>
              </div>
            <button
              type="button"
              onClick={handleDeleteAccountClick}
              className="mt-4 sm:mt-0 shrink-0 inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete Account
            </button>
          </div>
          {deleteAccountError && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-100 px-4 py-3 text-sm text-rose-800">
              <AlertCircle className="mt-0.5 shrink-0" size={16} strokeWidth={2.5} />
              <p>{deleteAccountError}</p>
            </div>
          )}
          </div>
        </SectionShell>
      </main>

      <Modal
        open={bugModalOpen}
        onClose={() => {
          setBugModalOpen(false);
          setBugErrors({});
        }}
        title="Report a Bug"
        description="Share what went wrong and the team will review it."
      >
        <form onSubmit={handleBugSubmit} className="space-y-4">
          <FieldShell label="Subject" required error={bugErrors.subject}>
            <Input
              value={bugForm.subject}
              onChange={(event) => setBugForm((current) => ({ ...current, subject: event.target.value }))}
              placeholder="Short summary of the issue"
              error={bugErrors.subject}
              disabled={bugSaving}
            />
          </FieldShell>

          <FieldShell label="Description" required error={bugErrors.description}>
            <TextArea
              value={bugForm.description}
              onChange={(event) => setBugForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Explain what happened, what you expected, and any relevant steps."
              error={bugErrors.description}
              disabled={bugSaving}
            />
          </FieldShell>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setBugModalOpen(false)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              disabled={bugSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={bugSaving}
            >
              {bugSaving ? <Loader2 size={16} className="animate-spin" /> : null}
              {bugSaving ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setFeedbackErrors({});
        }}
        title="Give Feedback"
        description="Tell us what could be better, faster, or clearer."
      >
        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <FieldShell label="Category" required error={feedbackErrors.category}>
            <select
              value={feedbackForm.category}
              onChange={(event) => setFeedbackForm((current) => ({ ...current, category: event.target.value }))}
              disabled={feedbackSaving} 
className={`h-11 w-full rounded-2xl border px-3.5 text-sm outline-none transition focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-950 text-slate-800 dark:text-slate-200 ${feedbackErrors.category
                ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:border-violet-400 focus:ring-violet-100"
                }`}
            >
              {BUG_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </FieldShell>

          <FieldShell label="Feedback" required error={feedbackErrors.feedback}>
            <TextArea
              value={feedbackForm.feedback}
              onChange={(event) => setFeedbackForm((current) => ({ ...current, feedback: event.target.value }))}
              placeholder="Share your idea, suggestion, or improvement."
              error={feedbackErrors.feedback}
              disabled={feedbackSaving}
            />
          </FieldShell>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setFeedbackModalOpen(false)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              disabled={feedbackSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={feedbackSaving}
            >
              {feedbackSaving ? <Loader2 size={16} className="animate-spin" /> : null}
              {feedbackSaving ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Delete Account Confirmation */}
      <Modal
        open={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Deleting your account will permanently remove all your data, including your profile, events, collaborations, and messages.
            This action is irreversible.
          </p>
          {deleteAccountError && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-300 bg-rose-100 px-4 py-3 text-sm text-rose-800">
              <AlertCircle className="mt-0.5 shrink-0" size={16} />
              <p>{deleteAccountError}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setDeleteAccountModalOpen(false)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
              disabled={deleteAccountLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccountConfirm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={deleteAccountLoading}
            >
              {deleteAccountLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {deleteAccountLoading ? "Deleting..." : "Delete My Account"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

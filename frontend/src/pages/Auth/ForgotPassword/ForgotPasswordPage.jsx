import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgot_password } from "../../../api/auth_apis";
import ErrorBanner from "../../../components/ErrorBanner";
import { FaEnvelope, FaArrowLeft, FaSpinner } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true)
    setError("")
    setMessage("")

    try {
      await forgot_password({ email })

      setMessage("OTP sent successfully.")

      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email },
        })
      }, 1000)
    }
    catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Something went wrong.",
      )
    }

    setLoading(false)
  }

return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900 dark:border dark:border-slate-800 dark:text-slate-100">
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-600"
        >
          <FaArrowLeft />
          Back to Login
        </Link>

        <h1 className="text-3xl font-black">Forgot Password</h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your registered email to receive an OTP.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold">Email</label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-500" />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border pl-11 pr-4 py-3"
                placeholder="student@campus.edu"
              />
            </div>
          </div>

{error && <ErrorBanner message={error} />}

          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white"
          >
            {loading ? (
              <>
                <FaSpinner className="inline animate-spin mr-2" />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

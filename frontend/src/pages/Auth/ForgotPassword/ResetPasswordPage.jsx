import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { reset_password } from "../../../api/auth_apis";
import ErrorBanner from "../../../components/ErrorBanner";
import {
  FaArrowLeft,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ""
  const reset_token = location.state?.reset_token || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!email || !reset_token) {
      navigate("/forgot-password")
    }
  }, [email, reset_token, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
        setSuccess("")
        setError("Passwords do not match.")
        return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await reset_password({
        email,
        reset_token,
        password,
        confirmPassword,
      })

      setSuccess(response.data.message)

      setTimeout(() => {
        navigate("/login")
      }, 1500)
    }
    catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Unable to reset password.",
      )
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 mb-6 font-bold text-violet-600"
        >
          <FaArrowLeft />
          Back
        </Link>

        <h1 className="text-3xl font-black">Reset Password</h1>

        <p className="mt-2 text-sm text-slate-500">Enter your new password.</p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2 text-sm font-bold">New Password</label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-600" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border pl-11 pr-12 py-3"
                required
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold">
              Confirm Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-600" />

              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border pl-11 pr-12 py-3"
                required
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

{error && <ErrorBanner message={error} />}

          {success && (
            <p className="text-green-600 flex items-center gap-2">
              <FaCheckCircle />

              {success}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white"
          >
            {loading ? (
              <>
                <FaSpinner className="inline mr-2 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

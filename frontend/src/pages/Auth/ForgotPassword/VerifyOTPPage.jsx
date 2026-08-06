import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { verify_otp } from "../../../api/auth_apis";
import ErrorBanner from "../../../components/ErrorBanner";
import { FaArrowLeft, FaKey, FaSpinner } from "react-icons/fa";

export default function VerifyOTPPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const email = location.state?.email || ""

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password")
    }
  }, [email, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError("")

    try {
      const response = await verify_otp({
        email,
        otp,
      })

      navigate("/reset-password", {
        state: {
          email,
          reset_token: response.data.reset_token,
        },
      })
    }
    catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Invalid OTP.",
      )
    }

    setLoading(false)
  }

return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-900 dark:border dark:border-slate-800 dark:text-slate-100">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-violet-600 font-bold mb-6"
        >
          <FaArrowLeft />
          Back
        </Link>

        <h1 className="text-3xl font-black">Verify OTP</h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter the OTP sent to</p>

        <p className="font-bold text-violet-600 mt-1">{email}</p>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <div>
            <label className="block mb-2 font-bold text-sm">OTP</label>

            <div className="relative">
              <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-600" />

              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border pl-11 pr-4 py-3"
                placeholder="123456"
              />
            </div>
          </div>

{error && <ErrorBanner message={error} />}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 text-white font-bold"
          >
            {loading ? (
              <>
                <FaSpinner className="inline mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
      </div>
    </main>
  )
}

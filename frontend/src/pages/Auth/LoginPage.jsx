import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_login } from "../../api/auth_apis";
import { FaEye, FaEyeSlash, FaBuilding, FaUserGraduate, FaInfoCircle, FaEnvelope, FaLock } from "react-icons/fa";

function getErrorMessage(err) {
    const data = err.response?.data;

    if (!data) {
        return "Unable to login. Please check your connection and try again.";
    }

    if (typeof data === "string") {
        return data;
    }

    return Object.values(data).flat().join(" ") || "Invalid credentials. Please try again.";
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [accountType, setAccountType] = useState("student"); // 'student' or 'organization'
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        // setError("dfsjkl")
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { email, password } = e.target.elements;

        const formData = {
            email: email.value,
            password: password.value,
            account_type: accountType,
        };

        try {
            const response = await submit_login(formData);
            localStorage.setItem("access", response.data.token.access);
            localStorage.setItem("refresh", response.data.token.refresh);
            localStorage.setItem("accountType", accountType);

            if (accountType === "student") {
                navigate('/user');
            } else {
                navigate('/organization/profile');
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <section className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-lg">

                <Link to="/" className="text-center block text-3xl font-bold text-emerald-600 mb-2">
                    CoDO
                </Link>

                <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">
                    Welcome Back!
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Login as a {accountType} to continue.
                </p>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-2 mb-6">
                    <button
                        onClick={() => setAccountType("student")}
                        className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${accountType === 'student' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                    >
                        <FaUserGraduate />
                        <span>Student</span>
                    </button>
                    <button
                        onClick={() => setAccountType("organization")}
                        className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition ${accountType === 'organization' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                    >
                        <FaBuilding />
                        <span>Organization</span>
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 mb-5 text-red-700 text-sm">
                        <FaInfoCircle className="flex-shrink-0" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input type="email" name="email" required className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-12 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm mt-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="rememberMe" className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500" />
                            <label htmlFor="rememberMe" className="text-gray-600">Remember Me</label>
                        </div>
                        <Link to="/forgot-password" className="font-semibold text-emerald-600 ">Forgot Password?</Link>
                    </div>

                    <button
                        className="mt-4 p-3.5 border-none rounded-lg bg-emerald-600 text-white text-base font-semibold cursor-pointer transition hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                    Don't have an account?
                    <Link to="/signup" className="text-emerald-600 font-semibold ml-1">Sign Up</Link>
                </p>

            </section>
        </main>
    );
}
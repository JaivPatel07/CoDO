import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_login } from "../../api/auth_apis";
import { FaEye, FaEyeSlash, FaBuilding, FaUserGraduate, FaInfoCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { UserContext } from "../../contextAPI/userContext";



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
    const { setUserData } = useContext(UserContext);
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

            // Set user data in context immediately after login
            setUserData(response.data.user);
            localStorage.setItem("username", response.data.user.username);

            if (accountType === "student") {
                // console.log('dfsdf',response.data.user.username)
                navigate(`/user/${response.data.user.username}`);
            } else {
                navigate(`/organization/${response.data.user.username}`);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/50 via-slate-50 to-emerald-50/50 p-6 relative overflow-hidden">
            {/* Glowing Backdrop Blobs */}
            <div className="absolute top-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-indigo-200/50 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] h-[350px] w-[350px] rounded-full bg-emerald-100/60 blur-[100px] pointer-events-none"></div>

            <section className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] z-10">

                <Link
                    to="/"
                    className={`text-center block text-3xl font-black mb-3 transition-colors duration-300 ${accountType === 'student' ? 'text-indigo-600' : 'text-emerald-600'
                        }`}
                >
                    CoDO
                </Link>

                <h1 className="text-center text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                    Welcome Back!
                </h1>

                <p className="text-center text-sm font-medium text-slate-500 mb-6">
                    Sign in as a {accountType} to continue.
                </p>

                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100/80 p-1.5 mb-6 border border-slate-200/30 relative">
                    <button
                        type="button"
                        onClick={() => setAccountType("student")}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-300 ${accountType === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        <FaUserGraduate className={`transition-transform duration-300 ${accountType === 'student' ? 'scale-110' : ''}`} />
                        <span>student</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setAccountType("organization")}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all duration-300 ${accountType === 'organization' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        <FaBuilding className={`transition-transform duration-300 ${accountType === 'organization' ? 'scale-110' : ''}`} />
                        <span>Organization</span>
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 mb-5 text-red-700 text-sm border border-red-100 animate-fadeIn">
                        <FaInfoCircle className="flex-shrink-0" />
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</label>
                        <div className="relative group">
                            <FaEnvelope className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 ${accountType === 'student' ? 'group-focus-within:text-indigo-500' : 'group-focus-within:text-emerald-500'
                                }`} />
                            <input
                                type="email"
                                name="email"
                                placeholder={accountType === 'student' ? 'student@university.edu' : 'admin@company.com'}
                                required
                                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 outline-none transition-all duration-300 focus:bg-white ${accountType === 'student'
                                        ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                        : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
                        <div className="relative group">
                            <FaLock className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 ${accountType === 'student' ? 'group-focus-within:text-indigo-500' : 'group-focus-within:text-emerald-500'
                                }`} />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                required
                                className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-12 outline-none transition-all duration-300 focus:bg-white ${accountType === 'student'
                                        ? 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                                        : 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                                    }`}
                            />
                            <button
                                type="button"
                                className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-300 ${accountType === 'student' ? 'hover:text-indigo-500' : 'hover:text-emerald-500'
                                    }`}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm mt-1">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                className={`h-4 w-4 rounded border-slate-300 transition ${accountType === 'student'
                                        ? 'text-indigo-600 focus:ring-indigo-500'
                                        : 'text-emerald-600 focus:ring-emerald-500'
                                    }`}
                            />
                            <label htmlFor="rememberMe" className="text-slate-600 font-bold select-none cursor-pointer">Remember Me</label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className={`font-bold transition-colors ${accountType === 'student' ? 'text-indigo-600 hover:text-indigo-800' : 'text-emerald-600 hover:text-emerald-800'
                                }`}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        className={`mt-4 p-3.5 border-none rounded-xl text-white text-base font-bold cursor-pointer transition-all duration-300 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${accountType === 'student'
                                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/20'
                                : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/20'
                            }`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm font-semibold text-slate-500">
                    Don't have an account?
                    <Link
                        to="/signup"
                        className={`font-bold ml-1 transition-colors ${accountType === 'student' ? 'text-indigo-600 hover:text-indigo-800' : 'text-emerald-600 hover:text-emerald-800'
                            }`}
                    >
                        Sign Up
                    </Link>
                </p>

            </section>
        </main>
    );
}
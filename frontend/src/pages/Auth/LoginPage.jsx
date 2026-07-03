import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_login } from "../../api/auth_apis";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
        };

        try {
            const response = await submit_login(formData);
            localStorage.setItem("access", response.data.token.access);
            localStorage.setItem("refresh", response.data.token.refresh);
            // console.log(response)
            navigate('/user');
        } catch (err) {
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                const errorMessage = Object.values(errorData).flat().join(' ');
                setError(errorMessage || "Invalid credentials. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <section className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg">

                <div className="text-center text-3xl font-bold text-blue-600 mb-2">
                    CoDO
                </div>

                <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">
                    Welcome Back!
                </h1>

                <p className="text-center text-gray-500 mb-8">
                    Login to continue your collaboration journey.
                </p>

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">Email</label>
                        <input type="email" name="email" required className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" />
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm mt-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="rememberMe" className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="rememberMe" className="text-gray-600">Remember Me</label>
                        </div>
                        <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">Forgot Password?</Link>
                    </div>

                    <button
                        className="mt-4 p-3.5 border-none rounded-lg bg-blue-600 text-white text-base font-semibold cursor-pointer transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-500">
                    Don't have an account?
                    <Link to="/signup" className="text-blue-600 font-semibold hover:underline ml-1">Sign Up</Link>
                </p>

            </section>
        </main>
    );
}
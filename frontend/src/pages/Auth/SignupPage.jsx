import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_signup } from "../../api/auth_apis";
import { FaBuilding, FaEye, FaEyeSlash, FaUserGraduate } from "react-icons/fa";

export function SignupChoicePage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <Link to="/" className="mb-8 flex items-center gap-3 text-xl font-bold">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">C</span>
                    <span>CoDO</span>
                </Link>

                <p className="mb-3 text-sm font-bold uppercase text-indigo-600">Create your account</p>
                <h1 className="text-4xl font-black sm:text-5xl">How do you want to join?</h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-600">
                    Choose the account type that fits you. Student signup is ready now, and organization access is coming soon.
                </p>

                <div className="mt-10 grid w-full gap-6 md:grid-cols-2">
                    <Link
                        to="/signup/student"
                        className="rounded-lg border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                    >
                        <span className="mb-6 grid h-16 w-16 place-items-center rounded-lg bg-indigo-600 text-3xl text-white">
                            <FaUserGraduate />
                        </span>
                        <h2 className="text-2xl font-bold">Student</h2>
                        <p className="mt-3 leading-7 text-slate-600">
                            Discover teams, projects, internships, hackathons, and build your profile.
                        </p>
                        <span className="mt-6 inline-flex font-bold text-indigo-600">Continue as Student</span>
                    </Link>

                    <Link
                        to="/organization"
                        className="rounded-lg border border-slate-200 bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                    >
                        <span className="mb-6 grid h-16 w-16 place-items-center rounded-lg bg-emerald-600 text-3xl text-white">
                            <FaBuilding />
                        </span>
                        <h2 className="text-2xl font-bold">Organization</h2>
                        <p className="mt-3 leading-7 text-slate-600">
                            Post opportunities, host events, and connect with talented students.
                        </p>
                        <span className="mt-6 inline-flex font-bold text-emerald-600">Continue as Organization</span>
                    </Link>
                </div>

                <p className="mt-8 text-slate-600">
                    Already have an account?
                    <Link to="/login" className="ml-1 font-bold text-indigo-600 hover:underline">Login</Link>
                </p>
            </div>
        </main>
    )
}

export default function SignupPage() {

    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {

        e.preventDefault();

        const { username, email, password, confirmPassword } = e.target;
        console.log(password.value, confirmPassword.value)
        if (password.value !== confirmPassword.value) {
            setError('Passwords do not match!');
            return;
        }

        const formData = { username: username.value, email: email.value, password: password.value, confirmPassword: confirmPassword.value }

        try {
            setLoading(true);
            setError(null);
            const response = await submit_signup(formData);

            localStorage.setItem("access", response.data.token.access);
            localStorage.setItem("refresh", response.data.token.refresh);
            navigate('/user')
        } catch (err) {
            console.log(err.response);

            setError(JSON.stringify(Object.values(err.response.data)[0][0]));
        } finally {
            setLoading(false);
        }

    };


    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg">

                <div className="mb-2 text-center text-3xl font-bold text-indigo-600">
                    CoDO
                </div>

                <h1 className="mb-2 text-center text-3xl font-bold text-slate-950">
                    Create Student Account
                </h1>

                <p className="mb-8 text-center text-slate-500">
                    Join the CoDO community and start collaborating.
                </p>

                {
                    error ?
                        <div className="mb-5 rounded-lg bg-red-100 p-3 text-center text-sm text-red-600">
                            {error}
                        </div>
                        :
                        null
                }

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    <div>
                        <label className="mb-2 block font-semibold text-slate-700">Username</label>
                        <input type="text" name="username" required className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold text-slate-700">Email</label>
                        <input type="email" name="email" required className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                    </div>


                    <div>
                        <label className="mb-2 block font-semibold text-slate-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block font-semibold text-slate-700">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                required
                                className="w-full rounded-lg border border-slate-300 p-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
                                onClick={() => setConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        className="mt-4 cursor-pointer rounded-lg border-none bg-indigo-600 p-3.5 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="mt-6 text-center text-slate-500">
                    Already have an account?
                    <Link to="/login" className="ml-1 font-semibold text-indigo-600 hover:underline">Login</Link>

                </p>

            </section>
        </main>
    );
}

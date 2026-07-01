import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { submit_signup } from "../../api/auth_apis";

export default function SignupPage() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getErrorMessage = (err) => {
        const data = err?.response?.data;

        if (!data) {
            return "Something went wrong. Please try again.";
        }

        if (typeof data === "string") {
            return data;
        }

        const firstValue = Object.values(data)[0];

        if (Array.isArray(firstValue)) {
            return firstValue[0];
        }

        return firstValue || "Unable to create your account right now.";
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError(null);

        const {
            firstName,
            lastName,
            username,
            email,
            accountType,
            phoneNumber,
            password,
            confirmPassword,
        } = e.target;

        if (password.value !== confirmPassword.value) {
            setError("Passwords do not match.");
            return;
        }

        const formData = {
            first_name: firstName.value,
            last_name: lastName.value,
            username: username.value,
            email: email.value,
            account_type: accountType.value,
            phone_number: phoneNumber.value,
            password: password.value,
            confirm_password: confirmPassword.value,
        };

        try {
            setLoading(true);
            const response = await submit_signup(formData);

            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            navigate("/user");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }

    };


    return (
        <main className="auth-page">
            <section className="auth-card">

                <div className="auth-logo">
                    CoDO
                </div>

                <h1 className="auth-title">
                    Create your account
                </h1>

                <p className="auth-subtitle">
                    Join CoDO to discover projects, teams, internships, and events built around collaboration.
                </p>

                {
                    error ?
                        <div className="error-box" role="alert">
                            {error}
                        </div>
                        :
                        null
                }

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="auth-row">
                        <div className="form-group">
                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                autoComplete="given-name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                autoComplete="family-name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-row">
                        <div className="form-group">
                            <label>Account Type</label>

                            <select
                                name="accountType"
                                defaultValue="student"
                                required
                            >
                                <option value="student">Student / Professional</option>
                                <option value="organization">Organization</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>

                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="+919876543210"
                                autoComplete="tel"
                            />
                        </div>
                    </div>

                    <div className="auth-row">
                        <div className="form-group">

                            <label>Password</label>

                            <div className="password-box">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    minLength="8"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>

                        <div className="form-group">

                            <label>Confirm Password</label>

                            <div className="password-box">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Repeat password"
                                    autoComplete="new-password"
                                    minLength="8"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>

                            </div>

                        </div>
                    </div>

                    <button
                        className="auth-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <p className="auth-link">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </section>
        </main>
    );
}

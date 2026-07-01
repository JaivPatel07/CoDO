import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import "./Auth.css";
import { submit_signup } from "../../api/auth_apis";

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
            const response = await submit_signup(formData);

            localStorage.setItem("access", response.data.token.access);
            localStorage.setItem("refresh", response.data.token.refresh);
            navigate('/user')
        } catch (err) {
            console.log(err.response);

            setError(JSON.stringify(Object.values(err.response.data)[0][0]));
        }

    };


    return (
        <main className="auth-page">
            <section className="auth-card">

                <div className="auth-logo">
                    CoDO
                </div>

                <h1 className="auth-title">
                    Create Account
                </h1>

                <p className="auth-subtitle">
                    Join the CoDO community and start collaborating.
                </p>

                {
                    error ?
                        <div className="error-box" style={{textAlign:'center'}}>
                            {error}
                        </div>
                        :
                        null
                }

                <form className="auth-form" onSubmit={handleSubmit}>


                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Username</label>

                        <input
                            type="text"
                            name="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            required
                        />
                    </div>


                    <div className="form-group">

                        <label>Password</label>

                        <div className="password-box">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
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
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>

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
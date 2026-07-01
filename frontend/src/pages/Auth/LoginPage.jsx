import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submit_login } from "../../api/auth_apis";

export default function LoginPage() {
    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        setError("dfsjkl")
        e.preventDefault();

        const { email, password } = e.target;

        const formData = { email: email.value, password: password.value }
        try {
            const response = await submit_login(formData);
            localStorage.setItem("access", response.data.token.access);
            localStorage.setItem("refresh", response.data.token.refresh);
            navigate('/user')

        } catch (err) {
            console.log(err.response);

            setError(JSON.stringify(Object.values(err.response.data)[0][0]));
        }

    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f7fb",
                padding: "20px",
            }}
        >
            <section
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "#fff",
                    padding: "35px",
                    borderRadius: "15px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "10px",
                    }}
                >
                    Welcome Back
                </h1>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "25px",
                    }}
                >
                    Login to your CoDO account
                </p>

                {error ?
                    <div
                        style={{
                            background: "#ffe5e5",
                            color: "#d00000",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            textAlign:"center"
                        }}
                    >
                        {error}
                    </div>
                    : null

                }

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "18px" }}>
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "6px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                        <label>Password</label>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "6px",
                                borderRadius: "8px",
                                border: "1px solid #ddd",
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                marginTop: "8px",
                                background: "none",
                                border: "none",
                                color: "#2563eb",
                                cursor: "pointer",
                            }}
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "13px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#2563eb",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >Login
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                    }}
                >
                    Don't have an account?{" "}
                    <Link to="/signup">Sign Up</Link>
                </p>
            </section>
        </main>
    );
}
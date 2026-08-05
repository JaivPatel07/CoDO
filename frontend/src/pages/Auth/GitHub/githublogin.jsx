import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contextAPI/userContext";
import { user_api } from "../../../api/axios";

export default function GithubCallback(){
    const {userData} = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(()=>{
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        // GitHub redirects here with ?error in case the user denies the request
        const oauthError = params.get("error");
        if (oauthError) {
            setError("GitHub authorization was cancelled or failed. Please try again.");
            return;
        }

        if (!code) {
            setError("Missing GitHub authorization code. Please try connecting again.");
            return;
        }

        // use user_api so the automatic token-refresh interceptor kicks in if access expired
        user_api.post("github/login/", { code })
        .then((res) => {
            console.log(res.data);
            navigate(`/user/${localStorage.getItem('username')}/profile/`,{replace:true});
        })
        .catch((err) => {
            console.error(err);
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.error ||
                "Failed to connect GitHub. Please try again.";
            setError(msg);
        });

    },[]);

    if (error) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fafafa", fontFamily: "sans-serif" }}>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32, maxWidth: 420, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#18181b", marginBottom: 8 }}>GitHub Connection Failed</h2>
                    <p style={{ fontSize: 14, color: "#71717a", lineHeight: 1.5, marginBottom: 20 }}>{error}</p>
                    <button
                        onClick={() => navigate(`/user/${localStorage.getItem('username')}/profile/`, { replace: true })}
                        style={{
                            background: "#18181b", color: "#fff", border: "none",
                            padding: "10px 18px", borderRadius: 8, fontSize: 14,
                            fontWeight: 600, cursor: "pointer"
                        }}
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    return <h2 style={{ textAlign: "center", marginTop: 80, fontFamily: "sans-serif" }}>Connecting Github...</h2>
}

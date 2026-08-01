import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout_user } from "../../api/user_apis";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        async function logout() {
            try {
                await logout_user();
            } catch (err) {
                console.error(err);
            } finally {
                // Remove tokens even if API fails
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("username");
                localStorage.removeItem("accountType");

                navigate("/");
            }
        }

        logout(); // <-- Call the function
    }, [navigate]);

    return null;
}
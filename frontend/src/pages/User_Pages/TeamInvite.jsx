import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetch_user } from "../../api/user_apis";
import { check_add_team_invite } from "../../api/team_apis";

export default function TeamInvite() {
    const { invite_link } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [message, setMessage] = useState("Joining team...");

    useEffect(() => {
        const joinTeam = async () => {
            try {
                // Check if user is logged in
                await fetch_user(localStorage.getItem("username"));

                // Join team
                const response = await check_add_team_invite({"invite_link":invite_link});

                setMessage(response.data?.message || "Successfully joined the team!");

                setTimeout(() => {
                    navigate(`/user/${localStorage.getItem("username")}`, {
                        replace: true,
                    });
                }, 1000);
            } catch (err) {
                // Not logged in
                if (err.response?.status === 401) {
                    navigate("/login", {
                        state: { from: location },
                        replace: true,
                    });
                    return;
                }

                // Other errors (expired link, already in team, etc.)
                setMessage(
                    err.response?.data?.error || "Unable to join the team."
                );

                setTimeout(() => {
                    navigate(`/user/${localStorage.getItem("username") || ""}`);
                }, 1500);
            }
        };

        joinTeam();
    }, [invite_link, navigate, location]);

    return <p>{message}</p>;
}
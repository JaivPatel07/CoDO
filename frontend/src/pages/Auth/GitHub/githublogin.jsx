import { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contextAPI/userContext";

export default function GithubCallback(){

    const {userData} = useContext(UserContext)
    const navigate = useNavigate();

    useEffect(()=>{

        const params = new URLSearchParams(window.location.search);

        const code = params.get("code");
        const token = localStorage.getItem('access')
        axios.post(
            "http://localhost:8000/api/user/github/login/",
            {code},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(res=>{
            console.log(res.data);
            navigate(`/user/${localStorage.getItem('username')}/profile/`,{replace:true});
        });

    },[]);

    return <h2>Connecting Github...</h2>
}
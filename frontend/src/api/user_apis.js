import { auth_api, user_api} from "./axios"

    const submit_profile = async (data) => {
        const response = await user_api.post('createUserProfile/', data)
        return response
    }


    const fetch_user = async (user_name) => {
        const response = await user_api.get(`${user_name}/fetchUser/`)
        return response
    }

    const fetch_profile = async(user_name) => {
        const response = await user_api.get(`${user_name}/fetchProfile/`)
        return response
    }

    const logout_user = async () => {
        return await auth_api.post("logout/", {
            refresh: localStorage.getItem("refresh"),
        });
    };

    export { fetch_user,submit_profile,fetch_profile,logout_user }
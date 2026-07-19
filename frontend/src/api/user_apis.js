import { auth_api, collabration_post_api, user_api } from "./axios"

const submit_profile = async (data) => {
    const response = await user_api.post('createUserProfile/', data)
    return response
}


const fetch_user = async (user_name) => {
    const response = await user_api.get(`${user_name}/fetchUser/`)
    return response
}

const fetch_profile = async (user_name) => {
    const response = await user_api.get(`${user_name}/fetchProfile/`)
    return response
}

const logout_user = async () => {
    return await auth_api.post("logout/", {
        refresh: localStorage.getItem("refresh"),
    });
};

const fetch_collabration_post = async ({filter,sort}) => {
    const response = await collabration_post_api.get('getallpost/',{
        params: {
            filter_type: filter === "All"? "":filter,sort
        }
    })
    return response
}

const create_collabration_post = async (data) => {
    const response = await collabration_post_api.post('createpost/',data)
}

export { fetch_user, submit_profile, fetch_profile, logout_user, fetch_collabration_post, create_collabration_post }
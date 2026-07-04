import { user_api } from "./axios"

const submit_profile = async (data) => {
    const response = await user_api.post('createUserProfile/', data)
    return response
}


const fetch_user = async (data) => {
    const response = await user_api.get('fetchUser')
    return response
}

const fetch_profile = async() => {
    const response = await user_api.get('fetchProfile')
    return response
}

export { fetch_user,submit_profile,fetch_profile }
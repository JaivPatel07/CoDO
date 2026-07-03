import { user_api } from "./axios"

const submit_profile = async (data) => {
    const response = await user_api.post('createUserProfile/',data)
    return response
}

export {submit_profile}
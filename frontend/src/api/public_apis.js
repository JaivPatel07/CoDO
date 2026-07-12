import { public_user_api } from "./axios"


const fetch_public_profile = async (uname) => {
    const response = await public_user_api.get(`u/profile/${uname}`)
    return response
}

export {fetch_public_profile}
import { public_user_api } from "./axios"


/**
 * Fetch a public profile by username.
 * The backend will determine if it's a student or organization.
 * Example: /api/profile/google/
 */
const fetch_public_profile = async (username) => {
    const response = await public_user_api.get(`/u/profile/${username}`);
    return response.data;
}

export {fetch_public_profile}
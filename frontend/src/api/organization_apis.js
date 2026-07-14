import { organization_api, public_user_api } from "./axios";

/**
 * Get logged-in organization profile
 */
export async function fetch_organization_profile() {
    try {
        const response = await organization_api.get("/profile/");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Create or Update organization profile
 * (Backend decides whether to create or update)
 */
export async function submit_organization_profile(formData) {
    try {
        const response = await organization_api.post(
            "/profile/",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Fetch public organization profile
 */
export async function fetch_public_organization_profile(username) {
    try {
        const response = await public_user_api.get(
            `/organization/${username}/`
        );

        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
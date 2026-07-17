import { organization_api, public_user_api } from "./axios";
import { fetch_organization_profile } from "./public_apis";

/**
 * Get logged-in organization profile
 */
export async function fetch_org_profile(user_name) {
    try {
        const response = await fetch_organization_profile(`${user_name}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Create or Update organization profile
 * (Backend decides whether to create or update)
 */
export async function submit_organization_profile(formData,user_name) {
    try {
        const response = await organization_api.post(`createOrganizationProfile/`,formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
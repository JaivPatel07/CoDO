import { public_user_api } from "./axios"



const fetch_student_profile = async (username) => {
    const response = await public_user_api.get(`user/${username}/profile/`);
    return response.data;
}


async function fetch_organization_profile(organization_name) {
    const response = await public_user_api.get(`organization/${organization_name}/profile/`);
    return response.data
}


export {fetch_student_profile,fetch_organization_profile}
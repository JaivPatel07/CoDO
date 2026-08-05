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

const fetch_collabration_post = async ({filter,sort,postId=null,page=null,page_size=9}) => {
    const params = {
        filter_type: filter === "All"? "":filter,
        sort,
        postId,
        page,
        page_size,
    };
    if (!page) delete params.page;
    if (page) params.page_size = page_size;

    const response = await collabration_post_api.get('getallpost/',{ params })
    return response
}


const create_collabration_post = async (data) => {
    const response = await collabration_post_api.post('createpost/',data)
    return response
}

const delete_collabration_post = async (event_id) => {
    const response = await collabration_post_api.delete(`deletepost/${event_id}/`)
    return response
}

const update_collabration_post = async (event_id, data) => {
    const response = await collabration_post_api.patch(`updatepost/${event_id}/`, data)
    return response
}

const make_join_request = async (data) => {
    const response = await collabration_post_api.post('makejoinrequest/',data)
    return response
}

const fetch_join_request = async(event_id) => {
    const response = await collabration_post_api.get(`fetchjoinrequest/${event_id}/`)
    return response
}


export { fetch_user, submit_profile, fetch_profile, logout_user, fetch_collabration_post, create_collabration_post, update_collabration_post, make_join_request, fetch_join_request, delete_collabration_post }
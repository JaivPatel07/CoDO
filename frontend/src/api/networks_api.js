import { network_api } from "./axios"

const get_networks = async(user_name) => {
    const response = await network_api.get(`getnetworks/${user_name}/`)
    return response
}

const add_network_request = async(data) => {
    const response = await network_api.post('addnetworkrequest/',data)
    return response
}

const update_network_request = async(data) => {
    const response = await network_api.put('updatenetworkrequest/',data)
    return response
}

const remove_network = async(user_id) => {
    const response = await network_api.delete(`removenetwork/${user_id}/`)
    return response
}

const get_connection_suggestions = async (limit = null, page = null, pageSize = 9) => {
    const params = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    if (page) params.page_size = pageSize;

    const response = await network_api.get('suggestions/', { params });
    return response
}

export {get_networks,add_network_request,update_network_request,remove_network, get_connection_suggestions}
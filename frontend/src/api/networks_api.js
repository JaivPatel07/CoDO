import { network_api } from "./axios"

const get_networks = async() => {
    const response = await network_api.get('getnetworks/')
    return response
}

const add_network_request = async() => {
    const response = await network_api.post('addnetworkrequest/')
    return response
}

const update_network_request = async() => {
    const response = await network_api.post('updatenetworkrequest/')
    return response
}

const remove_network = async(user_id) => {
    const response = await network_api.post(`removenetwork/${user_id}/`)
    return response
}

export {get_networks,add_network_request,update_network_request,remove_network}
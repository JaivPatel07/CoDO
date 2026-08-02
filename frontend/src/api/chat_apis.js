import { chat_api } from "./axios"

const get_chat = async() => {
    const response = await chat_api.get('chat/')
    return response
}

const get_message = async(chat_id) => {
    const response = await chat_api.get(`message/${chat_id}/`)
    return response
}

const create_message = async(data) => {
    const response = await chat_api.post('createmessage/',data)
    return response
}

export {get_chat,get_message,create_message}

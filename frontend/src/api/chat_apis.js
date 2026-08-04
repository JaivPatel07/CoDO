import { chat_api } from "./axios"

const get_chat = async() => {
    const response = await chat_api.get('chat/')
    return response
}

const get_message = async(chat_id) => {
    const response = await chat_api.get(`message/${chat_id}/`)
    return response
}

const delete_message = async (msg_id, d_type) => {
    return await chat_api.delete(`delete_message/${msg_id}/`, {
        data: {
            delete_type: d_type,
        },
    });
};



export {get_chat,get_message,delete_message}

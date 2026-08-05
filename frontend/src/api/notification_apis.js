import { notification_api } from "./axios"

const retirve_notification = async () => {
    const response = await notification_api.get(`notification`)
    return response
}

const send_notification = async (data) => {
    const response = await notification_api.post('sendnotification/', data)
    return response
}

const mark_all_notifications_read = async () => {
    const response = await notification_api.post('mark-all-read/')
    return response
}

export { retirve_notification, send_notification, mark_all_notifications_read }

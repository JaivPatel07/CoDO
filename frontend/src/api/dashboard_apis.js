import { public_user_api } from "./axios";

const fetch_dashboard = async () => {
    const response = await public_user_api.get('/dashboard/')
    return response.data
}

export { fetch_dashboard }
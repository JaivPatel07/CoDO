import { public_user_api } from "./axios";

/**
 * Fetch the saved items of the logged in user.
 * params: { item_type: "event" | "project" | "collabration", limit }
 */
export async function fetch_saved_items(params = {}) {
    const response = await public_user_api.get("/saved/", { params });
    return response.data;
}

export async function save_item(item_type, item_id) {
    const response = await public_user_api.post("/saved/", { item_type, item_id });
    return response.data;
}

export async function unsave_item(item_type, item_id) {
    const response = await public_user_api.delete(`/saved/${item_type}/${item_id}/`);
    return response.data;
}

import { user_api } from "./axios";

export const toggle_save_collab = async (post_id) => {
    const response = await user_api.post("save/collab/", { post_id });
    return response.data;
};

export const toggle_save_event = async (event_id) => {
    const response = await user_api.post("save/event/", { event_id });
    return response.data;
};

export const toggle_save_project = async (project_id) => {
    const response = await user_api.post("save/project/", { project_id });
    return response.data;
};

export const fetch_saved_items = async () => {
    const response = await user_api.get("saved-items/");
    return response.data;
};

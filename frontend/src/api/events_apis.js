import { public_user_api } from "./axios";

/**
 * Fetch all events (supports filtering/search via params)
 * params: { org, category, date, search }
 */
export async function fetch_events(params = {}) {
    try {
        const response = await public_user_api.get("/events/", { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Fetch single event details
 */
export async function fetch_event_details(id) {
    try {
        const response = await public_user_api.get(`/events/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Create a new event (only organizations)
 */
export async function create_event(formData) {
    try {
        const response = await public_user_api.post("/events/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Update an existing event (only owner organization)
 */
export async function update_event(id, formData) {
    try {
        const response = await public_user_api.put(`/events/${id}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

/**
 * Delete an event (only owner organization)
 */
export async function delete_event(id) {
    try {
        const response = await public_user_api.delete(`/events/${id}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const track_registration_click = async (event_id) => {
    try {
        const response = await public_user_api.post(`/events/${event_id}/track-click/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export async function fetch_organization_dashboard_analytics() {
    try {
        const response = await public_user_api.get("/events/dashboard/analytics/");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function mark_event_interested(eventId) {
    try {
        const response = await public_user_api.post(`/events/${eventId}/interest/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

export async function unmark_event_interested(eventId) {
    try {
        const response = await public_user_api.delete(`/events/${eventId}/interest/`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}

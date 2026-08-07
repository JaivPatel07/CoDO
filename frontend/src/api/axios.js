import axios from "axios";

const REQUEST_TIMEOUT = 1500000; // 15s — prevents infinite skeleton loaders on hanging requests

const BASE_URL = "http://127.0.0.1:8000"

export const WS_URL = "ws://127.0.0.1:8000/ws"

const auth_api = axios.create({
    baseURL: `${BASE_URL}/api/auth`,
    timeout: REQUEST_TIMEOUT,
});

const user_api = axios.create({
    baseURL: `${BASE_URL}/api/user`,
    timeout: REQUEST_TIMEOUT,
});

const organization_api = axios.create({
    baseURL: `${BASE_URL}/api/organization`,
    timeout: REQUEST_TIMEOUT,
});

const public_user_api = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: REQUEST_TIMEOUT,
});

const collabration_post_api = axios.create({
    baseURL: `${BASE_URL}/api/collabration`,
    timeout: REQUEST_TIMEOUT,
});

const notification_api = axios.create({
    baseURL: `${BASE_URL}/api/notification`,
    timeout: REQUEST_TIMEOUT,
});

const team_api = axios.create({
    baseURL: `${BASE_URL}/api/team`,
    timeout: REQUEST_TIMEOUT,
});

const network_api = axios.create({
    baseURL: `${BASE_URL}/api/network`,
    timeout: REQUEST_TIMEOUT,
});

const chat_api = axios.create({
    baseURL: `${BASE_URL}/api/chat`,
    timeout: REQUEST_TIMEOUT,
});

const workspace_api = axios.create({
    baseURL: `${BASE_URL}/api/workspace`,
    timeout: REQUEST_TIMEOUT,
});

const addAuthInterceptor = (api) => {
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("access");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    api.interceptors.response.use(
        (response) => response,

        async (error) => {
            const originalRequest = error.config;

            if (
                error.response &&
                error.response.status === 401 &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                try {
                    const refresh = localStorage.getItem("refresh");

                    if (!refresh) {
                      return Promise.reject(error);
                    }

                    const response = await auth_api.post("refresh/", {
                        refresh,
                    });

                    const newAccess = response.data.access;

                    localStorage.setItem("access", newAccess);

                    originalRequest.headers.Authorization =
                        `Bearer ${newAccess}`;

                    return api(originalRequest);
                } catch (err) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("username");
                    localStorage.removeItem("accountType");

                    window.location.href = "/login";
                    return Promise.reject(error)
                }
            }

            return Promise.reject(error);
        }
    );
};


addAuthInterceptor(user_api);
addAuthInterceptor(organization_api);
addAuthInterceptor(auth_api);
addAuthInterceptor(public_user_api);
addAuthInterceptor(collabration_post_api)
addAuthInterceptor(notification_api)
addAuthInterceptor(team_api)
addAuthInterceptor(network_api)
addAuthInterceptor(chat_api)
addAuthInterceptor(workspace_api)

export { auth_api, user_api, organization_api, public_user_api, collabration_post_api, notification_api,team_api,network_api,chat_api,workspace_api};



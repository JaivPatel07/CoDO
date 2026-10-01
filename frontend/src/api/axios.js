import axios from "axios";

/**
 * Axios instances for every CoDO API namespace.
 *
 * The base URL is taken from `VITE_API_URL` so the same bundle can be pointed at
 * local, staging or production backends. `WS_URL` is derived from it so the
 * WebSocket endpoint always matches the HTTP one.
 */

// 15s — prevents infinite skeleton loaders on hanging requests.
const REQUEST_TIMEOUT = Number(
  import.meta.env.VITE_API_TIMEOUT_MS ?? 15000
);

// Strip any trailing slash so `${BASE_URL}/api/...` never doubles up.
const RAW_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

/** WebSocket endpoint matching the configured HTTP base URL. */
export const WS_URL =
  import.meta.env.VITE_WS_URL ||
  BASE_URL.replace(/^http/, "ws") + "/ws";

const createApi = (baseURL, { withCredentials = false } = {}) =>
  axios.create({
    baseURL: `${BASE_URL}${baseURL}`,
    timeout: REQUEST_TIMEOUT,
    withCredentials,
  });

const auth_api = createApi("/api/auth");
const user_api = createApi("/api/user");
const organization_api = createApi("/api/organization");
const public_user_api = createApi("/api");
const collabration_post_api = createApi("/api/collabration");
const notification_api = createApi("/api/notification");
const team_api = createApi("/api/team");
const network_api = createApi("/api/network");
const chat_api = createApi("/api/chat");
const workspace_api = createApi("/api/workspace");

/** Where the browser is sent once the session can no longer be refreshed. */
const LOGIN_ROUTE = "/login";

const clearSession = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
  localStorage.removeItem("accountType");
};

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

      // Network error / timeout / cancelled request — nothing to refresh.
      if (!error.response) {
        return Promise.reject(error);
      }

      // Only attempt a refresh once per request, and never for the refresh
      // endpoint itself (that would recurse forever).
      const isRefreshCall = originalRequest?.url?.includes("refresh/");

      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        !isRefreshCall
      ) {
        originalRequest._retry = true;

        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          clearSession();
          window.location.href = LOGIN_ROUTE;
          return Promise.reject(error);
        }

        try {
          const response = await auth_api.post("refresh/", { refresh });

          const newAccess = response.data.access;
          const newRefresh = response.data.refresh;

          localStorage.setItem("access", newAccess);
          // ROTATE_REFRESH_TOKENS is enabled, so persist the rotated token too.
          if (newRefresh) {
            localStorage.setItem("refresh", newRefresh);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch {
          clearSession();
          window.location.href = LOGIN_ROUTE;
          return Promise.reject(error);
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
addAuthInterceptor(collabration_post_api);
addAuthInterceptor(notification_api);
addAuthInterceptor(team_api);
addAuthInterceptor(network_api);
addAuthInterceptor(chat_api);
addAuthInterceptor(workspace_api);

export {
  auth_api,
  user_api,
  organization_api,
  public_user_api,
  collabration_post_api,
  notification_api,
  team_api,
  network_api,
  chat_api,
  workspace_api,
};

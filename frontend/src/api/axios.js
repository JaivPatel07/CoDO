import axios from 'axios'



const auth_api = axios.create({
    baseURL: "http://localhost:8000/api/auth",
});

const user_api = axios.create({
    baseURL: "http://localhost:8000/api/user",
});


// Add access token to every request
user_api.interceptors.request.use((config) => {

    const token = localStorage.getItem("access");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// Refresh token automatically
user_api.interceptors.response.use(

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

                const response = await auth_api.post("refresh/", {
                    refresh,
                });

                const newAccess = response.data.access;

                // Replace old access token
                localStorage.setItem("access", newAccess);

                // Update header
                originalRequest.headers.Authorization =
                    `Bearer ${newAccess}`;

                // Retry previous request
                return user_api(originalRequest);

            } catch (err) {

                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);



export { auth_api, user_api };



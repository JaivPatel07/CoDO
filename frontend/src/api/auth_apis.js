import { auth_api } from "./axios";

const submit_signup = async (data) => {
    const response = await auth_api.post("register/", data);
    return response;
};

const submit_login = async (data) => {
    const response = await auth_api.post("login/",data)
    return response
}

export { submit_signup,submit_login };

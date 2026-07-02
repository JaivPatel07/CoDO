import { auth_api } from "./axios";

const submit_signup = async (data) => {
    const response = await auth_api.post("signup/", data);
    return response;
};

const submit_student_signup = async (data) => {
    return submit_signup({ ...data, is_student: true });
};

const submit_organization_signup = async (data) => {
    return submit_signup({ ...data, is_student: false });
};

const submit_login = async (data) => {
    const response = await auth_api.post("login/",data)
    return response
}

export { submit_signup, submit_student_signup, submit_organization_signup, submit_login };

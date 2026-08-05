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
    try {
        const response = await auth_api.post("login/", data);
        return response;
    } catch (err) {
        console.log(err.response?.data);
        throw err;
    }
}

const forgot_password = async (data) => {
    return await auth_api.post("forgot-password/", data);
}

const verify_otp = async (data) => {
    return await auth_api.post("verify-otp/", data);
}

const reset_password = async (data) => {
    return await auth_api.post("reset-password/", data);
}


export { submit_signup, submit_student_signup, submit_organization_signup, submit_login,
    forgot_password, verify_otp, reset_password
}

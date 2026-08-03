import { public_user_api, user_api } from "./axios";

export const update_user_account = (userName, data) => {
  return user_api.put(`${userName}/account/`, data);
};

export const submit_bug_report = (data) => {
  return public_user_api.post("support/bug-report/", data);
};

export const submit_feedback = (data) => {
  return public_user_api.post("support/feedback/", data);
};

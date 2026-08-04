import { workspace_api } from "./axios";

/* ---------------- Workspace ---------------- */

export const fetch_workspace_team = async () => {
    return await workspace_api.get("workspace_team/");
};

export const create_workspace_team = async (data) => {
    return await workspace_api.post("create_workspace_team/", data);
};

/* ---------------- Group Chat ---------------- */

export const get_grp_message = async (team_id) => {
    return await workspace_api.get(`grp_chat/${team_id}/`);
};

export const delete_grp_message = async (chat_id, d_type) => {
    return await workspace_api.delete(
        `grp_chat_delete/${chat_id}/`,
        {
            data: {
                delete_type: d_type,
            },
        }
    );
};

/* ---------------- GitHub Repository ---------------- */

export const connect_workspace_repo = async (data) => {
    return await workspace_api.post(
        "connect_workspace_repo/",
        data
    );
};

/*
Backend should return connected repository information.

GET api/workspace/get_workspace_repo/?workspace_id=1
*/
export const get_workspace_repo = async (workspace_id) => {
    return await workspace_api.get(
        "get_workspace_repo/",
        {
            params: {
                workspace_id,
            },
        }
    );
};

/* ---------------- Commits ---------------- */

export const get_repo_commits = async (workspace_id) => {
    return await workspace_api.get(
        "get_repo_commits/",
        {
            params: {
                workspace_id,
            },
        }
    );
};

/* ---------------- Pull Requests ---------------- */

export const get_repo_pulls = async (workspace_id) => {
    return await workspace_api.get(
        "get_repo_pulls/",
        {
            params: {
                workspace_id,
            },
        }
    );
};

/* ---------------- Issues ---------------- */

export const get_repo_issues = async (workspace_id) => {
    return await workspace_api.get(
        "get_repo_issues/",
        {
            params: {
                workspace_id,
            },
        }
    );
};
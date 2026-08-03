import { workspace_api } from "./axios"

const fetch_workspace_team = async () => {
    const response = await workspace_api('workspace_team/')
    return response
}

const create_workspace_team = async(data) => {
    const response = await workspace_api('create_workspace_team/',data)
    return response
}

export {fetch_workspace_team,create_workspace_team}
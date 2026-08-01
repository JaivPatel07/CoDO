import { team_api } from "./axios"

const get_team_member = async(team_id) => {
    const response = await team_api.get(`get/team/${team_id}`)
    return response
}

const add_team_member = async(data) => {
    const response = await team_api.post(`add/team/member/`,data)
    return response
}

const delete_team_member = async(team_id,member_username) => {
    const response = await team_api.delete(`delete/team/${team_id}/member/${member_username}/`)
}

export {get_team_member,add_team_member,delete_team_member}

import { collabration_post_api } from './axios';

export const fetchOpenSourceProjects = async (page = 1, pageSize = 9) => {
    return await collabration_post_api.get('/opensource/', {
        params: { page, page_size: pageSize },
    });
};

export const fetchOpenSourceProjectDetails = async (id) => {
    return await collabration_post_api.get(`/opensource/${id}/`);
};

export const createOpenSourceProject = async (data) => {
    return await collabration_post_api.post('/opensource/', data);
};

export const updateOpenSourceProject = async (id, data) => {
    return await collabration_post_api.patch(`/opensource/${id}/`, data);
};

export const deleteOpenSourceProject = async (id) => {
    return await collabration_post_api.delete(`/opensource/${id}/`);
};

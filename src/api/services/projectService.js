import apiClient from '../config';

export default {
  getProjects(params = {}) {
    return apiClient.get('/webhook/api/components/projects', { params });
  },
  getProjectsMeta() {
    return apiClient.get('/webhook/api/components/projects/meta');
  },
  createProject(data) {
    return apiClient.post('/webhook/api/components/projects', data);
  },
  updateProject(id, data) {
    // include the id in the body
    return apiClient.post('/webhook/api/components/projects/update', { project_id: id, ...data });
  },
  deleteProject(id) {
    return apiClient.delete(`/webhook/api/components/projects/${id}`);
  },
  getProjectById(id) {
    return apiClient.get(`/webhook/api/components/projects/${id}`);
  },
};

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
    return apiClient.put(`/webhook/api/components/projects/${id}`, data);
  },
  deleteProject(id) {
    return apiClient.delete(`/webhook/api/components/projects/${id}`);
  },
  getProjectById(id) {
    return apiClient.get(`/webhook/api/components/projects/${id}`);
  },
};

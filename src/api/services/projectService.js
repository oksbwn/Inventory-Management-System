import apiClient from '../config'

export default {
  getProjects(params = {}) {
    return apiClient.get('/webhook/api/projects/list', { params })
  },

  createProject(data) {
    return apiClient.post('/webhook/api/projects', data)
  },

  updateProject(id, data) {
    return apiClient.put(`/webhook/api/projects/${id}`, data)
  },

  deleteProject(id) {
    return apiClient.delete(`/webhook/api/projects/${id}`)
  },

  getProjectById(id) {
    return apiClient.get(`/webhook/api/projects/${id}`)
  }
}

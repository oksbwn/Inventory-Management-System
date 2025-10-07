import apiClient from '../config'

export default {
  getBoxes(params = {}) {
    return apiClient.get('/webhook/api/boxes/list', { params })
  },

  createBox(data) {
    return apiClient.post('/webhook/api/boxes', data)
  },

  updateBox(id, data) {
    return apiClient.put(`/webhook/api/boxes/${id}`, data)
  },

  deleteBox(id) {
    return apiClient.delete(`/webhook/api/boxes/${id}`)
  },

  getBoxById(id) {
    return apiClient.get(`/webhook/api/boxes/${id}`)
  }
}

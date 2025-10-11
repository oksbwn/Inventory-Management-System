import apiClient from '../config'

export default {
  getBoxes(params = {}) {
    // Axios GET request with query params for pagination and search
    return apiClient.get('/webhook/api/components/boxes', { params })
  },

  getBoxesMeta() {
    // Axios GET request for metadata summary
    return apiClient.get('/webhook/api/components/boxes/meta')
  },

  createBox(data) {
    // Axios POST request to create a new box
    return apiClient.post('/webhook/api/components/boxes', data)
  },

  updateBox(id, data) {
    // Axios PUT request to update existing box by ID
    return apiClient.put(`/webhook/api/components/boxes/${id}`, data)
  },

  deleteBox(id) {
    // Axios DELETE request to delete box by ID
    return apiClient.delete(`/webhook/api/components/boxes/${id}`)
  },

  getBoxById(id) {
    // Axios GET request to fetch a single box by its ID
    return apiClient.get(`/webhook/api/components/boxes/${id}`)
  }
}

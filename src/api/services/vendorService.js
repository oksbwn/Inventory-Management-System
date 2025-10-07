import apiClient from '../config'

export default {
  getVendors(params = {}) {
    return apiClient.get('/webhook-test/api/vendors/list', { params })
  },

  createVendor(data) {
    return apiClient.post('/webhook-test/api/vendors', data)
  },

  updateVendor(id, data) {
    return apiClient.put(`/webhook-test/api/vendors/${id}`, data)
  },

  deleteVendor(id) {
    return apiClient.delete(`/webhook-test/api/vendors/${id}`)
  },

  getVendorById(id) {
    return apiClient.get(`/webhook-test/api/vendors/${id}`)
  }
}

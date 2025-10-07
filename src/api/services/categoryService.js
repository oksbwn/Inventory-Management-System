import apiClient from '../config'

export default {
  getCategories(params = {}) {
    return apiClient.get('/webhook/api/components/categories', { params })
  },

  createCategory(data) {
    return apiClient.post('/webhook/api/components/categories', data)
  },

  updateCategory(id, data) {
    return apiClient.put(`/webhook/api/components/categories/${id}`, data)
  },

  deleteCategory(id) {
    return apiClient.delete(`/webhook/api/components/categories/${id}`)
  },

  getCategoryById(id) {
    return apiClient.get(`/webhook/api/components/categories/${id}`)
  }
}

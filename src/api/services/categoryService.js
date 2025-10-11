import apiClient from '../config'

export default {
  // Get all categories with pagination
  getCategories(params = {}) {
    return apiClient.get('/webhook/api/components/categories', { params })
  },

  // Get single category by ID
  getCategoryById(id) {
    return apiClient.get(`/webhook/api/components/categories/${id}`)
  },

  // Create new category
  createCategory(data) {
    return apiClient.post('/webhook/api/components/categories', data)
  },

  // Update category
  updateCategory(id, data) {
    return apiClient.put(`/webhook/api/components/categories/${id}`, data)
  },

  // Delete category
  deleteCategory(id) {
    return apiClient.delete(`/webhook/api/components/categories/${id}`)
  },
  getCategoryMetadata() {
    return apiClient.get('/webhook/api/components/categories/meta')
  }
}

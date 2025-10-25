import apiClient from '../config'

export default {
  // Get all categories with pagination
  getCategories(params = {}) {
    return apiClient.get('/webhook/api/components/categories', { params })
  },

  // Get single category by ID (using POST)
  getCategoryById(id) {
    return apiClient.post('/webhook/api/components/categories/get', { 
      category_id: id 
    })
  },

  // Create new category
  createCategory(data) {
    return apiClient.post('/webhook/api/components/categories', data)
  },

  // Update category (using POST)
  updateCategory(id, data) {
    return apiClient.post('/webhook/api/components/categories/update', {
      category_id: id,
      ...data
    })
  },

  // Delete category (using POST)
  deleteCategory(id) {
    return apiClient.post('/webhook/api/components/categories/delete', { 
      category_id: id 
    })
  },

  // Get category metadata
  getCategoryMetadata() {
    return apiClient.get('/webhook/api/components/categories/meta')
  }
}

import apiClient from '../config'

export default {
  // Get dashboard statistics
  getStats() {
    return apiClient.get('/webhook/api/dashboard/stats')
  },

  // Get dashboard summary
  getSummary() {
    return apiClient.get('/webhook/api/dashboard/summary')
  },

  // Get recent activities
  getActivities() {
    return apiClient.get('/webhook/api/dashboard/activities')
  },

  // Get top components by usage
  getTopComponents() {
    return apiClient.get('/webhook/api/dashboard/topcomponents')
  },

  // Get category distribution
  getCategories() {
    return apiClient.get('/webhook/api/dashboard/categories')
  },

  // Get trends
  getTrends() {
    return apiClient.get('/webhook/api/dashboard/trend')
  },

  // Get box utilization (if you created this endpoint)
  getBoxes() {
    return apiClient.get('/webhook/api/dashboard/boxes')
  },

  // Get vendor performance (if you created this endpoint)
  getVendors() {
    return apiClient.get('/webhook/api/dashboard/vendors')
  }
}

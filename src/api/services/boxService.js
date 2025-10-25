import apiClient from '../config'

export default {
  // Get all boxes with pagination and search
  getBoxes(params = {}) {
    return apiClient.get('/webhook/api/components/boxes', { params })
  },

  // Get box metadata (stats/summary)
  getBoxesMeta() {
    return apiClient.get('/webhook/api/components/boxes/meta')
  },

  // Get next available box ID
  getNextBoxId() {
    return apiClient.get('/webhook/api/components/boxes/next-id')
  },

  // Create a new box
  createBox(data) {
    return apiClient.post('/webhook/api/components/boxes', data)
  },

  // Update existing box
  updateBox(id, data) {
    return apiClient.post('/webhook/api/components/boxes/update', {
      box_id: id,
      ...data
    })
  },

  // Delete box
  deleteBox(id) {
    return apiClient.post('/webhook/api/components/boxes/delete', {
      box_id: id
    })
  }
}

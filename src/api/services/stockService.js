import apiClient from '../config'

export default {
  getStocks(params = {}) {
    return apiClient.get('/webhook/api/components/stocks', { params })
  },

  createStock(data) {
    return apiClient.post('/webhook/api/components/stocks', data)
  },

  updateStock(id, data) {
    return apiClient.put(`/webhook/api/components/stocks/${id}`, data)
  },

  deleteStock(id) {
    return apiClient.delete(`/webhook/api/components/stocks/${id}`)
  },

  getStockById(id) {
    return apiClient.get(`/webhook/api/components/stocks/${id}`)
  }
}

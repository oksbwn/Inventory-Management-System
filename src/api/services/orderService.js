// src/api/services/orderService.js

import apiClient from '../config'

export default {
  // Get all orders with optional filters (query params)
  getOrders(params = {}) {
    return apiClient.get('/webhook/api/orders', { params })
  },

  // Get single order by ID (via query param)
  getOrderById(id) {
    return apiClient.get('/webhook/api/orders/detail', {
      params: { order_id: id }
    })
  },

  // Create new order
  createOrder(data) {
    return apiClient.post('/webhook/api/orders/create', data)
  },

  // Delete order
  deleteOrder(id) {
    return apiClient.post('/webhook/api/orders/delete', { order_id: id })
  }
}

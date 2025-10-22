// src/stores/orderStore.js

import { defineStore } from 'pinia'
import orderService from '@/api/services/orderService'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchOrders(filters = {}) {
      this.loading = true
      this.error = null
      try {
        this.orders = await orderService.getOrders(filters)  // <-- use getOrders
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async fetchOrder(order_id) {
      this.loading = true
      this.error = null
      try {
        this.currentOrder = await orderService.getOrderById(order_id)  // <-- getOrderById
        return this.currentOrder
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async createOrder(orderData) {
      this.loading = true
      this.error = null
      try {
        const res = await orderService.createOrder(orderData)
        this.orders.unshift(res)
        return res
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteOrder(order_id) {
      this.loading = true
      this.error = null
      try {
        await orderService.deleteOrder(order_id)
        this.orders = this.orders.filter(o => o.order_id !== order_id)
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})

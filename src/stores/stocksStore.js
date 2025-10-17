import { defineStore } from 'pinia'
import stockService from '@/services/stockService'

export const useStockStore = defineStore('stockStore', {
  state: () => ({
    stocks: [],
  }),
  actions: {
    async fetchStock(id) {
      const res = await stockService.getStockById(id)
      return res.success ? res.data : null
    },
    async deleteStock(id) {
      await stockService.deleteStock(id)
      this.stocks = this.stocks.filter(s => s.id !== id)
    }
  }
})

import { defineStore } from 'pinia'
import { useBaseStore } from '@/composables/useBaseStore'
import stockService from '@/api/services/stockService'

// Service adapter with proper ES imports
const stockServiceAdapter = {
  getItems: (params) => stockService.getStocks(params),
  createItem: (data) => stockService.createStock(data),
  updateItem: (id, data) => stockService.updateStock(id, data),
  deleteItem: (id) => stockService.deleteStock(id)
}

export const useStockStore = defineStore('stock', () => {
  const baseStore = useBaseStore('StockStore', stockServiceAdapter, {
    cacheTimeout: 5 * 60 * 1000,
    defaultItemsPerPage: 10,
    itemName: 'stock',
    pluralItemName: 'stocks'
  })

  // Rename for clarity
  const stocks = baseStore.items
  const fetchStocks = baseStore.fetchItems
  const createStock = baseStore.createItem
  const updateStock = baseStore.updateItem
  const deleteStock = baseStore.deleteItem

  return {
    // State
    stocks,
    loading: baseStore.loading,
    error: baseStore.error,
    totalItems: baseStore.totalItems,
    itemsPerPage: baseStore.itemsPerPage,
    currentPage: baseStore.currentPage,
    search: baseStore.search,
    
    // Getters
    isCacheValid: baseStore.isCacheValid,
    
    // Actions
    fetchStocks,
    createStock,
    updateStock,
    deleteStock,
    clearCache: baseStore.clearCache
  }
})

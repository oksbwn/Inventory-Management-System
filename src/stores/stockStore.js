import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import stockService from '@/api/services/stockService'

export const useStockStore = defineStore('stock', () => {
  // State
  const stocks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastFetched = ref(null)
  const cacheTimeout = 5 * 60 * 1000
  
  // Pagination state
  const totalItems = ref(0)
  const itemsPerPage = ref(10)
  const currentPage = ref(1)
  const search = ref('')

  // Getters
  const isCacheValid = computed(() => {
    if (!lastFetched.value) return false
    return Date.now() - lastFetched.value < cacheTimeout
  })

  // Actions
  async function fetchStocks(options = {}, forceRefresh = false) {
    const { 
      page = 1, 
      itemsPerPage: perPage = 10, 
      sortBy = [], 
      search: searchTerm = '' 
    } = options

    const params = {
      pageNo: page,
      pageSize: perPage,
    }

    if (searchTerm) {
      params.search = searchTerm
    }

    if (sortBy.length > 0) {
      params.sortBy = sortBy[0].key
      params.sortOrder = sortBy[0].order
    }

    loading.value = true
    error.value = null

    try {
      const data = await stockService.getStocks(params)
      
      if (Array.isArray(data)) {
        stocks.value = data
        totalItems.value = data.length
      } else {
        stocks.value = data.items || data.data || []
        totalItems.value = data.total || data.totalCount || stocks.value.length
      }
      
      currentPage.value = page
      itemsPerPage.value = perPage
      search.value = searchTerm
      lastFetched.value = Date.now()
      
      return { items: stocks.value, total: totalItems.value }
    } catch (err) {
      error.value = err.message || 'Failed to fetch stocks'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createStock(stockData) {
    loading.value = true
    error.value = null

    try {
      const newStock = await stockService.createStock(stockData)
      stocks.value.unshift(newStock)
      totalItems.value++
      lastFetched.value = Date.now()
      return newStock
    } catch (err) {
      error.value = err.message || 'Failed to create stock'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStock(id, stockData) {
    loading.value = true
    error.value = null

    try {
      const updatedStock = await stockService.updateStock(id, stockData)
      const index = stocks.value.findIndex(s => s.id === id)
      if (index !== -1) {
        stocks.value[index] = updatedStock
      }
      lastFetched.value = Date.now()
      return updatedStock
    } catch (err) {
      error.value = err.message || 'Failed to update stock'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteStock(id) {
    loading.value = true
    error.value = null

    try {
      await stockService.deleteStock(id)
      stocks.value = stocks.value.filter(s => s.id !== id)
      totalItems.value--
      lastFetched.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to delete stock'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    stocks.value = []
    totalItems.value = 0
    lastFetched.value = null
    currentPage.value = 1
    search.value = ''
  }

  return {
    // State
    stocks,
    loading,
    error,
    totalItems,
    itemsPerPage,
    currentPage,
    search,
    
    // Getters
    isCacheValid,
    
    // Actions
    fetchStocks,
    createStock,
    updateStock,
    deleteStock,
    clearCache
  }
})

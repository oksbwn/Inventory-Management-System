import { ref, computed } from 'vue'

/**
 * Generic base store composable for CRUD operations
 * @param {string} storeName - Name of the store (for debugging)
 * @param {object} apiService - API service with CRUD methods
 * @param {object} options - Configuration options
 */
export function useBaseStore(storeName, apiService, options = {}) {
  const {
    cacheTimeout = 5 * 60 * 1000,
    defaultItemsPerPage = 10,
    itemName = 'item',
    pluralItemName = 'items'
  } = options

  // State
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastFetched = ref(null)
  
  // Pagination state
  const totalItems = ref(0)
  const itemsPerPage = ref(defaultItemsPerPage)
  const currentPage = ref(1)
  const search = ref('')

  // Getters
  const isCacheValid = computed(() => {
    if (!lastFetched.value) return false
    return Date.now() - lastFetched.value < cacheTimeout
  })

  // Generic fetch function
  async function fetchItems(fetchOptions = {}, forceRefresh = false) {
    const { 
      page = 1, 
      itemsPerPage: perPage = defaultItemsPerPage, 
      sortBy = [], 
      search: searchTerm = '' 
    } = fetchOptions

    // Check cache validity
    if (!forceRefresh && isCacheValid.value && !searchTerm && page === currentPage.value) {
      return { items: items.value, total: totalItems.value }
    }

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
      const data = await apiService.getItems(params)
      
      // Handle different response formats
      if (Array.isArray(data)) {
        items.value = data
        totalItems.value = data[0].totalitems
      } else {
        items.value = data.items || data.data || []
        totalItems.value = data.total || data.totalCount || items.value.length
      }
      
      currentPage.value = page
      itemsPerPage.value = perPage
      search.value = searchTerm
      lastFetched.value = Date.now()
      
      return { items: items.value, total: totalItems.value }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to fetch ${pluralItemName}`
      error.value = errorMessage
      console.error(`[${storeName}] Fetch error:`, err)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // Create item
  async function createItem(itemData) {
    loading.value = true
    error.value = null

    try {
      const newItem = await apiService.createItem(itemData)
      items.value.unshift(newItem)
      totalItems.value++
      lastFetched.value = Date.now()
      return newItem
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to create ${itemName}`
      error.value = errorMessage
      console.error(`[${storeName}] Create error:`, err)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // Update item
  async function updateItem(id, itemData) {
    loading.value = true
    error.value = null

    try {
      const updatedItem = await apiService.updateItem(id, itemData)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      lastFetched.value = Date.now()
      return updatedItem
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to update ${itemName}`
      error.value = errorMessage
      console.error(`[${storeName}] Update error:`, err)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // Delete item
  async function deleteItem(id) {
    loading.value = true
    error.value = null

    try {
      await apiService.deleteItem(id)
      items.value = items.value.filter(item => item.id !== id)
      totalItems.value--
      lastFetched.value = Date.now()
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to delete ${itemName}`
      error.value = errorMessage
      console.error(`[${storeName}] Delete error:`, err)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  // Clear cache
  function clearCache() {
    items.value = []
    totalItems.value = 0
    lastFetched.value = null
    currentPage.value = 1
    search.value = ''
  }

  return {
    // State
    items,
    loading,
    error,
    totalItems,
    itemsPerPage,
    currentPage,
    search,
    
    // Getters
    isCacheValid,
    
    // Actions
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    clearCache
  }
}

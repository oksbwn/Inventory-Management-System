import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import boxService from '@/api/services/boxService'

export const useBoxStore = defineStore('box', () => {
  // State
  const boxes = ref([])
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
  async function fetchBoxes(options = {}, forceRefresh = false) {
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
      const data = await boxService.getBoxes(params)
      
      if (Array.isArray(data)) {
        boxes.value = data
        totalItems.value = data.length
      } else {
        boxes.value = data.items || data.data || []
        totalItems.value = data.total || data.totalCount || boxes.value.length
      }
      
      currentPage.value = page
      itemsPerPage.value = perPage
      search.value = searchTerm
      lastFetched.value = Date.now()
      
      return { items: boxes.value, total: totalItems.value }
    } catch (err) {
      error.value = err.message || 'Failed to fetch boxes'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBox(boxData) {
    loading.value = true
    error.value = null

    try {
      const newBox = await boxService.createBox(boxData)
      boxes.value.unshift(newBox)
      totalItems.value++
      lastFetched.value = Date.now()
      return newBox
    } catch (err) {
      error.value = err.message || 'Failed to create box'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBox(id, boxData) {
    loading.value = true
    error.value = null

    try {
      const updatedBox = await boxService.updateBox(id, boxData)
      const index = boxes.value.findIndex(b => b.id === id)
      if (index !== -1) {
        boxes.value[index] = updatedBox
      }
      lastFetched.value = Date.now()
      return updatedBox
    } catch (err) {
      error.value = err.message || 'Failed to update box'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBox(id) {
    loading.value = true
    error.value = null

    try {
      await boxService.deleteBox(id)
      boxes.value = boxes.value.filter(b => b.id !== id)
      totalItems.value--
      lastFetched.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to delete box'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    boxes.value = []
    totalItems.value = 0
    lastFetched.value = null
    currentPage.value = 1
    search.value = ''
  }

  return {
    // State
    boxes,
    loading,
    error,
    totalItems,
    itemsPerPage,
    currentPage,
    search,
    
    // Getters
    isCacheValid,
    
    // Actions
    fetchBoxes,
    createBox,
    updateBox,
    deleteBox,
    clearCache
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import vendorService from '@/api/services/vendorService'

export const useVendorStore = defineStore('vendor', () => {
  // State
  const vendors = ref([])
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
  async function fetchVendors(options = {}, forceRefresh = false) {
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
      const data = await vendorService.getVendors(params)
      
      if (Array.isArray(data)) {
        vendors.value = data
        totalItems.value = data.length
      } else {
        vendors.value = data.items || data.data || []
        totalItems.value = data.total || data.totalCount || vendors.value.length
      }
      
      currentPage.value = page
      itemsPerPage.value = perPage
      search.value = searchTerm
      lastFetched.value = Date.now()
      
      return { items: vendors.value, total: totalItems.value }
    } catch (err) {
      error.value = err.message || 'Failed to fetch vendors'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createVendor(vendorData) {
    loading.value = true
    error.value = null

    try {
      const newVendor = await vendorService.createVendor(vendorData)
      vendors.value.unshift(newVendor)
      totalItems.value++
      lastFetched.value = Date.now()
      return newVendor
    } catch (err) {
      error.value = err.message || 'Failed to create vendor'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateVendor(id, vendorData) {
    loading.value = true
    error.value = null

    try {
      const updatedVendor = await vendorService.updateVendor(id, vendorData)
      const index = vendors.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vendors.value[index] = updatedVendor
      }
      lastFetched.value = Date.now()
      return updatedVendor
    } catch (err) {
      error.value = err.message || 'Failed to update vendor'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteVendor(id) {
    loading.value = true
    error.value = null

    try {
      await vendorService.deleteVendor(id)
      vendors.value = vendors.value.filter(v => v.id !== id)
      totalItems.value--
      lastFetched.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to delete vendor'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    vendors.value = []
    totalItems.value = 0
    lastFetched.value = null
    currentPage.value = 1
    search.value = ''
  }

  return {
    // State
    vendors,
    loading,
    error,
    totalItems,
    itemsPerPage,
    currentPage,
    search,
    
    // Getters
    isCacheValid,
    
    // Actions
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    clearCache
  }
})

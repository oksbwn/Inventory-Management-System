import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import categoryService from '@/api/services/categoryService'

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref([])
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
  async function fetchCategories(options = {}, forceRefresh = false) {
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
      const data = await categoryService.getCategories(params)
      
      if (Array.isArray(data)) {
        categories.value = data
        totalItems.value = data.length
      } else {
        categories.value = data.items || data.data || []
        totalItems.value = data.total || data.totalCount || categories.value.length
      }
      
      currentPage.value = page
      itemsPerPage.value = perPage
      search.value = searchTerm
      lastFetched.value = Date.now()
      
      return { items: categories.value, total: totalItems.value }
    } catch (err) {
      error.value = err.message || 'Failed to fetch categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCategory(categoryData) {
    loading.value = true
    error.value = null

    try {
      const newCategory = await categoryService.createCategory(categoryData)
      categories.value.unshift(newCategory)
      totalItems.value++
      lastFetched.value = Date.now()
      return newCategory
    } catch (err) {
      error.value = err.message || 'Failed to create category'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id, categoryData) {
    loading.value = true
    error.value = null

    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      lastFetched.value = Date.now()
      return updatedCategory
    } catch (err) {
      error.value = err.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id) {
    loading.value = true
    error.value = null

    try {
      await categoryService.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
      totalItems.value--
      lastFetched.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    categories.value = []
    totalItems.value = 0
    lastFetched.value = null
    currentPage.value = 1
    search.value = ''
  }

  return {
    // State
    categories,
    loading,
    error,
    totalItems,
    itemsPerPage,
    currentPage,
    search,
    
    // Getters
    isCacheValid,
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCache
  }
})

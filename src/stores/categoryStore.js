import { defineStore } from 'pinia'
import { useBaseStore } from '@/composables/useBaseStore'
import categoryService from '@/api/services/categoryService'

const categoryServiceAdapter = {
  getItems: (params) => categoryService.getCategories(params),
  createItem: (data) => categoryService.createCategory(data),
  updateItem: (id, data) => categoryService.updateCategory(id, data),
  deleteItem: (id) => categoryService.deleteCategory(id)
}

export const useCategoryStore = defineStore('category', () => {
  const baseStore = useBaseStore('CategoryStore', categoryServiceAdapter, {
    cacheTimeout: 5 * 60 * 1000,
    defaultItemsPerPage: 10,
    itemName: 'category',
    pluralItemName: 'categories'
  })

  const categories = baseStore.items
  const fetchCategories = baseStore.fetchItems
  const createCategory = baseStore.createItem
  const updateCategory = baseStore.updateItem
  const deleteCategory = baseStore.deleteItem

  return {
    categories,
    loading: baseStore.loading,
    error: baseStore.error,
    totalItems: baseStore.totalItems,
    itemsPerPage: baseStore.itemsPerPage,
    currentPage: baseStore.currentPage,
    search: baseStore.search,
    isCacheValid: baseStore.isCacheValid,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCache: baseStore.clearCache
  }
})

import { defineStore } from 'pinia'
import { useBaseStore } from '@/composables/useBaseStore'
import boxService from '@/api/services/boxService'

const boxServiceAdapter = {
  getItems: (params) => boxService.getBoxes(params),
  createItem: (data) => boxService.createBox(data),
  updateItem: (id, data) => boxService.updateBox(id, data),
  deleteItem: (id) => boxService.deleteBox(id)
}

export const useBoxStore = defineStore('box', () => {
  const baseStore = useBaseStore('BoxStore', boxServiceAdapter, {
    cacheTimeout: 5 * 60 * 1000,
    defaultItemsPerPage: 10,
    itemName: 'box',
    pluralItemName: 'boxes'
  })

  const boxes = baseStore.items
  const fetchBoxes = baseStore.fetchItems
  const createBox = baseStore.createItem
  const updateBox = baseStore.updateItem
  const deleteBox = baseStore.deleteItem

  return {
    boxes,
    loading: baseStore.loading,
    error: baseStore.error,
    totalItems: baseStore.totalItems,
    itemsPerPage: baseStore.itemsPerPage,
    currentPage: baseStore.currentPage,
    search: baseStore.search,
    isCacheValid: baseStore.isCacheValid,
    fetchBoxes,
    createBox,
    updateBox,
    deleteBox,
    clearCache: baseStore.clearCache
  }
})

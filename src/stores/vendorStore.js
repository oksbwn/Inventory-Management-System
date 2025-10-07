import { defineStore } from 'pinia'
import { useBaseStore } from '@/composables/useBaseStore'
import vendorService from '@/api/services/vendorService'

const vendorServiceAdapter = {
  getItems: (params) => vendorService.getVendors(params),
  createItem: (data) => vendorService.createVendor(data),
  updateItem: (id, data) => vendorService.updateVendor(id, data),
  deleteItem: (id) => vendorService.deleteVendor(id)
}

export const useVendorStore = defineStore('vendor', () => {
  const baseStore = useBaseStore('VendorStore', vendorServiceAdapter, {
    cacheTimeout: 5 * 60 * 1000,
    defaultItemsPerPage: 10,
    itemName: 'vendor',
    pluralItemName: 'vendors'
  })

  const vendors = baseStore.items
  const fetchVendors = baseStore.fetchItems
  const createVendor = baseStore.createItem
  const updateVendor = baseStore.updateItem
  const deleteVendor = baseStore.deleteItem

  return {
    vendors,
    loading: baseStore.loading,
    error: baseStore.error,
    totalItems: baseStore.totalItems,
    itemsPerPage: baseStore.itemsPerPage,
    currentPage: baseStore.currentPage,
    search: baseStore.search,
    isCacheValid: baseStore.isCacheValid,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    clearCache: baseStore.clearCache
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

import boxService from '@/api/services/boxService'

export const useBoxStore = defineStore('box', () => {
  const boxes = ref([])
  const totalItems = ref(0)
  const loading = ref(false)
  const error = ref(null)

  // Metadata fields
  const totalBoxes = ref(0)
  const activeBoxes = ref(0)
  const emptyBoxes = ref(0)
  const totalComponents = ref(0)
  const recentAdditions = ref(0)

  const fetchBoxes = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await boxService.getBoxes(params)
      boxes.value = response[0].items || []
      // totalItems.value = response.data.total || 0
      // Fetch metadata after boxes load for consistency
      await fetchBoxesMeta()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const fetchBoxesMeta = async () => {
    try {
      const response = await boxService.getBoxesMeta()
      const meta = response[0] || {}
      totalBoxes.value = meta.totalBoxes || 0
      activeBoxes.value = meta.activeBoxes || 0
      emptyBoxes.value = meta.emptyBoxes || 0
      totalComponents.value = meta.totalComponents || 0
      recentAdditions.value = meta.recentAdditions || 0
    } catch {
      // Can optionally reset metadata on failure
      totalBoxes.value = 0
      activeBoxes.value = 0
      emptyBoxes.value = 0
      totalComponents.value = 0
      recentAdditions.value = 0
    }
  }

  // Other CRUD methods remain unchanged...

  return {
    boxes,
    totalItems,
    loading,
    error,
    totalBoxes,
    activeBoxes,
    emptyBoxes,
    totalComponents,
    recentAdditions,
    fetchBoxes,
    fetchBoxesMeta,
    // createBox, updateBox, deleteBox ...
  }
})

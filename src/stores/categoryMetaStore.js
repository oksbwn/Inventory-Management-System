import { defineStore } from 'pinia'
import categoryService from '@/api/services/categoryService'

export const useCategoryMetaStore = defineStore('categoryMeta', {
  state: () => ({
    totalCategories: 0,
    activeCategories: 0,
    emptyCategories: 0,
    totalComponents: 0,
    recentAdditions: 0,
    loading: false,
    error: null
  }),
  actions: {
    async fetchMetadata() {
      this.loading = true
      this.error = null
      try {
        const response = await categoryService.getCategoryMetadata()
        const data = response[0];
        console.log('Hewllo',response[0])
        this.totalCategories = data.totalCategories || 0
        this.activeCategories = data.activeCategories || 0
        this.emptyCategories = data.emptyCategories || 0
        this.totalComponents = data.totalComponents || 0
        this.recentAdditions = data.recentAdditions || 0
      } catch (err) {
        this.error = err.message || 'Failed to load category metadata'
      } finally {
        this.loading = false
      }
    }
  }
})

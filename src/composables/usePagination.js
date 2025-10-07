import { ref, computed } from 'vue'

export function usePagination(options = {}) {
  const page = ref(options.initialPage || 1)
  const itemsPerPage = ref(options.initialItemsPerPage || 10)
  const totalItems = ref(0)
  const sortBy = ref(options.initialSortBy || [])

  const totalPages = computed(() => {
    return Math.ceil(totalItems.value / itemsPerPage.value) || 1
  })

  const startItem = computed(() => {
    return (page.value - 1) * itemsPerPage.value + 1
  })

  const endItem = computed(() => {
    const end = page.value * itemsPerPage.value
    return end > totalItems.value ? totalItems.value : end
  })

  const resetPagination = () => {
    page.value = 1
  }

  const setPage = (newPage) => {
    page.value = newPage
  }

  const setItemsPerPage = (value) => {
    itemsPerPage.value = value
    page.value = 1 // Reset to first page
  }

  return {
    page,
    itemsPerPage,
    totalItems,
    sortBy,
    totalPages,
    startItem,
    endItem,
    resetPagination,
    setPage,
    setItemsPerPage
  }
}

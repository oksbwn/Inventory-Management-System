import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import projectService from '@/api/services/projectService'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref([])
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
  async function fetchProjects(options = {}, forceRefresh = false) {
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
      const data = await projectService.getProjects(params)
      
      if (Array.isArray(data)) {
        projects.value = data
        totalItems.value = data.length
      } else {
        projects.value = data.items || data.data || []
        totalItems.value = data.total || data.totalCount || projects.value.length
      }
      
      currentPage.value = page
      itemsPerPage.value = perPage
      search.value = searchTerm
      lastFetched.value = Date.now()
      
      return { items: projects.value, total: totalItems.value }
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProject(projectData) {
    loading.value = true
    error.value = null

    try {
      const newProject = await projectService.createProject(projectData)
      projects.value.unshift(newProject)
      totalItems.value++
      lastFetched.value = Date.now()
      return newProject
    } catch (err) {
      error.value = err.message || 'Failed to create project'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id, projectData) {
    loading.value = true
    error.value = null

    try {
      const updatedProject = await projectService.updateProject(id, projectData)
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      lastFetched.value = Date.now()
      return updatedProject
    } catch (err) {
      error.value = err.message || 'Failed to update project'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id) {
    loading.value = true
    error.value = null

    try {
      await projectService.deleteProject(id)
      projects.value = projects.value.filter(p => p.id !== id)
      totalItems.value--
      lastFetched.value = Date.now()
    } catch (err) {
      error.value = err.message || 'Failed to delete project'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    projects.value = []
    totalItems.value = 0
    lastFetched.value = null
    currentPage.value = 1
    search.value = ''
  }

  return {
    // State
    projects,
    loading,
    error,
    totalItems,
    itemsPerPage,
    currentPage,
    search,
    
    // Getters
    isCacheValid,
    
    // Actions
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearCache
  }
})

import { defineStore } from 'pinia'
import { useBaseStore } from '@/composables/useBaseStore'
import projectService from '@/api/services/projectService'

const projectServiceAdapter = {
  getItems: (params) => projectService.getProjects(params),
  createItem: (data) => projectService.createProject(data),
  updateItem: (id, data) => projectService.updateProject(id, data),
  deleteItem: (id) => projectService.deleteProject(id)
}

export const useProjectStore = defineStore('project', () => {
  const baseStore = useBaseStore('ProjectStore', projectServiceAdapter, {
    cacheTimeout: 5 * 60 * 1000,
    defaultItemsPerPage: 10,
    itemName: 'project',
    pluralItemName: 'projects'
  })

  const projects = baseStore.items
  const fetchProjects = baseStore.fetchItems
  const createProject = baseStore.createItem
  const updateProject = baseStore.updateItem
  const deleteProject = baseStore.deleteItem

  return {
    projects,
    loading: baseStore.loading,
    error: baseStore.error,
    totalItems: baseStore.totalItems,
    itemsPerPage: baseStore.itemsPerPage,
    currentPage: baseStore.currentPage,
    search: baseStore.search,
    isCacheValid: baseStore.isCacheValid,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearCache: baseStore.clearCache
  }
})

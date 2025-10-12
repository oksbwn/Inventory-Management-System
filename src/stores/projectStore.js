import { defineStore } from "pinia";
import { ref } from "vue";
import projectService from "@/api/services/projectService";

export const useProjectStore = defineStore("project", () => {
  const projects = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // Metadata
  const totalProjects = ref(0);
  const activeProjects = ref(0);
  const completedProjects = ref(0);

  // Fetch project list with pagination and search params
  const fetchProjects = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjects(params);
      projects.value = response || [];
      totalItems.value = response[0]?.total || 0;
      await fetchProjectsMeta();
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects';
      console.error('Error fetching projects:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch projects metadata summary
  const fetchProjectsMeta = async () => {
    try {
      const response = await projectService.getProjectsMeta();
      const meta = response[0] || {};
      totalProjects.value = meta.totalProjects || 0;
      activeProjects.value = meta.activeProjects || 0;
      completedProjects.value = meta.completedProjects || 0;
    } catch (err) {
      console.error('Error fetching project metadata:', err);
      totalProjects.value = 0;
      activeProjects.value = 0;
      completedProjects.value = 0;
    }
  };

  // Create a new project
  const createProject = async (projectData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.createProject(projectData);
      await fetchProjects(); // Refresh the list
      return response;
    } catch (err) {
      error.value = err.message || 'Failed to create project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update an existing project
  const updateProject = async (projectId, projectData) => {
    loading.value = true;
    error.value = null;
    try {
       const response = await projectService.updateProject(projectId, projectData);
      
      // Update the project in the local state
      const index = projects.value.findIndex(p => p.project_id === projectId);
      if (index !== -1) {
        projects.value[index] = { ...projects.value[index], ...projectData };
      }
      
      await fetchProjectsMeta(); // Refresh metadata
      return response;
    } catch (err) {
      error.value = err.message || 'Failed to update project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    loading.value = true;
    error.value = null;
    try {
      await projectService.deleteProject(projectId);
      
      // Remove from local state
      projects.value = projects.value.filter(p => p.project_id !== projectId);
      totalItems.value = Math.max(0, totalItems.value - 1);
      
      await fetchProjectsMeta(); // Refresh metadata
    } catch (err) {
      error.value = err.message || 'Failed to delete project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Get a single project by ID
  const getProjectById = async (projectId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjectById(projectId);
      return response;
    } catch (err) {
      error.value = err.message || 'Failed to fetch project';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Clear any cached data (useful for refresh)
  const clearCache = () => {
    projects.value = [];
    totalItems.value = 0;
    totalProjects.value = 0;
    activeProjects.value = 0;
    completedProjects.value = 0;
    error.value = null;
  };

  // Clear error state
  const clearError = () => {
    error.value = null;
  };

  // Bulk operations
  const bulkUpdateStatus = async (projectIds, newStatus) => {
    loading.value = true;
    error.value = null;
    try {
      const promises = projectIds.map(id => {
        const project = projects.value.find(p => p.project_id === id);
        if (project) {
          return projectService.updateProject(id, { ...project, status: newStatus });
        }
      });
      
      await Promise.all(promises.filter(Boolean));
      await fetchProjects(); // Refresh the entire list
    } catch (err) {
      error.value = err.message || 'Failed to bulk update projects';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const bulkDelete = async (projectIds) => {
    loading.value = true;
    error.value = null;
    try {
      const promises = projectIds.map(id => projectService.deleteProject(id));
      await Promise.all(promises);
      
      // Remove from local state
      projects.value = projects.value.filter(p => !projectIds.includes(p.project_id));
      totalItems.value = Math.max(0, totalItems.value - projectIds.length);
      
      await fetchProjectsMeta(); // Refresh metadata
    } catch (err) {
      error.value = err.message || 'Failed to bulk delete projects';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Helper computed properties
  const getProjectsByStatus = (status) => {
    return projects.value.filter(project => project.status === status);
  };

  const getYouTubeProjects = () => {
    return projects.value.filter(project => project.is_yt_project === true);
  };

  const getRegularProjects = () => {
    return projects.value.filter(project => project.is_yt_project === false);
  };

  const getProjectsWithGitRepo = () => {
    return projects.value.filter(project => project.git_repository);
  };

  // Advanced filtering
  const filterProjects = (filters) => {
    let filtered = [...projects.value];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(project => 
        project.project_name.toLowerCase().includes(searchLower) ||
        (project.description && project.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(project => project.status === filters.status);
    }
    
    if (filters.is_yt_project !== undefined) {
      filtered = filtered.filter(project => project.is_yt_project === filters.is_yt_project);
    }
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(project => {
        const projectStart = new Date(project.start_date);
        const projectEnd = new Date(project.end_date);
        return projectStart >= start && projectEnd <= end;
      });
    }
    
    return filtered;
  };

  // Statistics
  const getProjectStats = () => {
    const total = projects.value.length;
    const byStatus = {};
    const byType = { youtube: 0, regular: 0 };
    const withGitRepo = projects.value.filter(p => p.git_repository).length;
    
    projects.value.forEach(project => {
      // Count by status
      const status = project.status || 'Not Set';
      byStatus[status] = (byStatus[status] || 0) + 1;
      
      // Count by type
      if (project.is_yt_project) {
        byType.youtube++;
      } else {
        byType.regular++;
      }
    });
    
    return {
      total,
      byStatus,
      byType,
      withGitRepo,
      percentageWithGitRepo: total > 0 ? Math.round((withGitRepo / total) * 100) : 0
    };
  };

  return {
    // State
    projects,
    totalItems,
    loading,
    error,
    totalProjects,
    activeProjects,
    completedProjects,
    
    // Actions
    fetchProjects,
    fetchProjectsMeta,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    clearCache,
    clearError,
    bulkUpdateStatus,
    bulkDelete,
    
    // Getters
    getProjectsByStatus,
    getYouTubeProjects,
    getRegularProjects,
    getProjectsWithGitRepo,
    filterProjects,
    getProjectStats,
  };
});
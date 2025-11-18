import { defineStore } from "pinia";
import { ref } from "vue";
import projectService from "@/api/services/projectService";

export const useProjectStore = defineStore("project", () => {
  const projects = ref([]);
  const currentProject = ref(null); // Add this for single project details
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const videoInfo = ref({});

  // Metadata
  const totalProjects = ref(0);
  const activeProjects = ref(0);
  const completedProjects = ref(0);
  const componentsUsed = ref([]);
  const availableComponents = ref([]);
  const loadingComponents = ref(false);
  const errorComponents = ref(null);
  const addingComponent = ref(false);

  // Fetch project list with pagination and search params
  const fetchProjects = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjects(params);
      projects.value = response || [];
      totalItems.value = response[0]?.total_records || 0;
      await fetchProjectsMeta();
    } catch (err) {
      error.value = err.message || "Failed to fetch projects";
      console.error("Error fetching projects:", err);
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
      console.error("Error fetching project metadata:", err);
      totalProjects.value = 0;
      activeProjects.value = 0;
      completedProjects.value = 0;
    }
  };

  // Fetch single project by ID with component count and total cost
  const fetchProjectById = async (projectId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.getProjectById(projectId);

      let res = response[0];
      // Check if response has success flag

      if (res.success === false) {
        throw new Error(res.message || "Project not found");
      }

      // Store in currentProject for detail page use
      currentProject.value = res.project || res;
      return res.project;
    } catch (err) {
      error.value = err.message || "Failed to fetch project";
      currentProject.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Create a new project
  const createProject = async (projectData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await projectService.createProject(projectData);

      // Check for success response
      if (response.success && response.project) {
        // Add to local state
        projects.value.unshift(response.project);
        totalItems.value++;
      }

      await fetchProjectsMeta(); // Refresh metadata
      return response;
    } catch (err) {
      error.value = err.message || "Failed to create project";
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
      const response = await projectService.updateProject(
        projectId,
        projectData
      );

      // Update the project in the local state
      const index = projects.value.findIndex((p) => p.project_id === projectId);
      if (index !== -1 && response.success && response.project) {
        projects.value[index] = response.project;
      }

      // Update currentProject if it's the same one being edited
      if (
        currentProject.value &&
        currentProject.value.project_id === projectId
      ) {
        currentProject.value = response.project || {
          ...currentProject.value,
          ...projectData,
        };
      }

      await fetchProjectsMeta(); // Refresh metadata
      return response;
    } catch (err) {
      error.value = err.message || "Failed to update project";
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
      projects.value = projects.value.filter((p) => p.project_id !== projectId);
      totalItems.value = Math.max(0, totalItems.value - 1);

      // Clear currentProject if it was deleted
      if (
        currentProject.value &&
        currentProject.value.project_id === projectId
      ) {
        currentProject.value = null;
      }

      await fetchProjectsMeta(); // Refresh metadata
    } catch (err) {
      error.value = err.message || "Failed to delete project";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Get a single project by ID (alias for fetchProjectById for compatibility)
  const getProjectById = async (projectId) => {
    return await fetchProjectById(projectId);
  };

  // Clear current project
  const clearCurrentProject = () => {
    currentProject.value = null;
  };

  // Clear any cached data (useful for refresh)
  const clearCache = () => {
    projects.value = [];
    currentProject.value = null;
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
      const promises = projectIds.map((id) => {
        const project = projects.value.find((p) => p.project_id === id);
        if (project) {
          return projectService.updateProject(id, { status: newStatus });
        }
      });

      await Promise.all(promises.filter(Boolean));
      await fetchProjects(); // Refresh the entire list
    } catch (err) {
      error.value = err.message || "Failed to bulk update projects";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const bulkDelete = async (projectIds) => {
    loading.value = true;
    error.value = null;
    try {
      const promises = projectIds.map((id) => projectService.deleteProject(id));
      await Promise.all(promises);

      // Remove from local state
      projects.value = projects.value.filter(
        (p) => !projectIds.includes(p.project_id)
      );
      totalItems.value = Math.max(0, totalItems.value - projectIds.length);

      await fetchProjectsMeta(); // Refresh metadata
    } catch (err) {
      error.value = err.message || "Failed to bulk delete projects";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Helper computed properties
  const getProjectsByStatus = (status) => {
    return projects.value.filter((project) => project.status === status);
  };

  const getYouTubeProjects = () => {
    return projects.value.filter((project) => project.is_yt_project === true);
  };

  const getRegularProjects = () => {
    return projects.value.filter((project) => project.is_yt_project === false);
  };

  const getProjectsWithGitRepo = () => {
    return projects.value.filter((project) => project.git_repository);
  };

  // Advanced filtering
  const filterProjects = (filters) => {
    let filtered = [...projects.value];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.project_name.toLowerCase().includes(searchLower) ||
          (project.description &&
            project.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (project) => project.status === filters.status
      );
    }

    if (filters.is_yt_project !== undefined) {
      filtered = filtered.filter(
        (project) => project.is_yt_project === filters.is_yt_project
      );
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter((project) => {
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
    const withGitRepo = projects.value.filter((p) => p.git_repository).length;

    projects.value.forEach((project) => {
      // Count by status
      const status = project.status || "Not Set";
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
      percentageWithGitRepo:
        total > 0 ? Math.round((withGitRepo / total) * 100) : 0,
    };
  };

  const fetchVideoByProjectId = async (projectId) => {
    try {
      const response = await projectService.getVideoByProjectId(projectId);

      if (response[0].success) {
        console.log(response[0].video);
        videoInfo.value = response[0].video;
      } else {
        videoInfo.value = {};
      }
      return videoInfo.value;
    } catch (err) {
      console.error("Failed to fetch video info:", err);
      videoInfo.value = {};
      throw err;
    }
  };

  // Update video info for a project
  const updateVideo = async (projectId, updateData) => {
    try {
      const response = await projectService.updateVideo(projectId, updateData);
      if (response.data?.success) {
        videoInfo.value = response.data.video;
      }
      return response;
    } catch (err) {
      console.error("Failed to update video info:", err);
      throw err;
    }
  };
  // Fetch components currently used by a project
  const fetchComponentsUsed = async (projectId) => {
    loadingComponents.value = true;
    errorComponents.value = null;
    try {
      const response = await projectService.getComponentsUsed(projectId);
      componentsUsed.value = response || [];
      return response;
    } catch (err) {
      errorComponents.value = err.message || "Failed to fetch components used";
      componentsUsed.value = [];
      throw err;
    } finally {
      loadingComponents.value = false;
    }
  };

  // Fetch full list of available components to add
  const fetchAvailableComponents = async () => {
    try {
      const response = await projectService.getAvailableComponents({
        pageSize:100000000,
        pageNo: 1
      });
      availableComponents.value = response || [];
      return response;
    } catch (err) {
      errorComponents.value =
        err.message || "Failed to fetch available components";
      availableComponents.value = [];
      throw err;
    }
  };

  // Add a new component usage record to a project
  const addComponentToProject = async (projectId, componentId, quantity) => {
    if (!projectId || !componentId || !quantity || quantity <= 0) {
      throw new Error("Invalid projectId, componentId, or quantity");
    }
    addingComponent.value = true;
    try {
      await projectService.addComponentToProject(
        projectId,
        componentId,
        quantity
      );
      // Refresh components used after add
      await fetchComponentsUsed(projectId);
    } catch (err) {
      throw err;
    } finally {
      addingComponent.value = false;
    }
  };

  return {
    // State
    projects,
    currentProject,
    totalItems,
    loading,
    error,
    totalProjects,
    activeProjects,
    completedProjects,

    // Actions
    fetchProjects,
    fetchProjectsMeta,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    clearCurrentProject,
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
    videoInfo,
    fetchVideoByProjectId,
    updateVideo,
    componentsUsed,
    availableComponents,
    loadingComponents,
    errorComponents,
    addingComponent,
    fetchComponentsUsed,
    fetchAvailableComponents,
    addComponentToProject,
  };
});

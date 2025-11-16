import apiClient from "../config";

export default {
  // GET all projects with filters
  getProjects(params = {}) {
    return apiClient.get("/webhook/api/components/projects", { params });
  },

  // GET project stats
  getProjectsMeta() {
    return apiClient.get("/webhook/api/components/projects/meta");
  },

  // POST create project
  createProject(data) {
    return apiClient.post("/webhook/api/components/projects", data);
  },

  // POST update project
  updateProject(id, data) {
    return apiClient.post("/webhook/api/components/projects/update", {
      project_id: id,
      ...data,
    });
  },

  // DELETE project (using query parameter)
  deleteProject(project_id) {
    return apiClient.post("/webhook/api/components/projects/delete", {
      project_id,
    });
  },

  // GET single project (using query parameter)
  getProjectById(id) {
    return apiClient.get("/webhook/api/components/projects/single", {
      params: { id },
    });
  },
  getVideoByProjectId(project_id) {
    return apiClient.get("/webhook/api/components/projects/video", {
      params: { project_id },
    });
  },

  // Update video details
  updateVideo(project_id, data) {
    return apiClient.post("/webhook/api/components/projects/video/update", {
      project_id,
      ...data,
    });
  },
  getComponentsUsed(projectId) {
    return apiClient.get("/webhook/api/components/projects/components", {
      params: { project_id: projectId },
    });
  },

  // Fetch all available components for selection
  getAvailableComponents(params) {
    return apiClient.get("/webhook/api/components/stocks", { params });
  },

  // Add a component usage record to a project
  addComponentToProject(projectId, componentId, quantityUsed) {
    return apiClient.post("/webhook/api/components/projects/components/add", {
      project_id: projectId,
      component_id: componentId,
      quantity_used: quantityUsed,
    });
  },
};

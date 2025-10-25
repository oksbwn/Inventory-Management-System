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
};

import apiClient from "../config";

export default {
  getStocks(params = {}) {
    return apiClient.get("/webhook/api/components/stocks", { params });
  },
  createStock(data) {
    return apiClient.post("/webhook/api/components/stocks", data);
  },
  updateStock(id, data) {
    return apiClient.put(`/webhook/api/components/stocks/${id}`, data);
  },
  deleteStock(id) {
    return apiClient.delete(`/webhook/api/components/stocks/${id}`);
  },
  async getStockById(id) {
    const response = await apiClient.post(
      `/webhook/api/components/stocks/detail`,
      { id }
    );
    return response.data;
  },
  getStockGist() {
    return apiClient.get("/webhook/api/components/gist");
  },
  getAllComponents() {
    return apiClient.get("/webhook/api/components/all");
  },
  getPurchaseHistory(componentId) {
    return apiClient.post(`/webhook/api/components/purchase-history`, {
      component_id: componentId,
    });
  },
  getProjectUsage(componentId) {
    return apiClient.post(`/webhook/api/components/project-usage`, {
      component_id: componentId,
    });
  },
  getGeneralUsage(componentId) {
    return apiClient.post(`/webhook/api/components/general-usage`, {
      component_id: componentId,
    });
  },
  updateComponent(componentId, updateData) {
    return apiClient.post(`/webhook/api/components/update`, {
      component_id: componentId,
      ...updateData,
    });
  },
};

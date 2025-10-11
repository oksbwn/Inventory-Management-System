import apiClient from '../config';

export default {
  getVendors(params = {}) {
    return apiClient.get('/webhook/api/components/vendors', { params });
  },
  getVendorsMeta() {
    return apiClient.get('/webhook/api/components/vendors/meta');
  },
  createVendor(data) {
    return apiClient.post('/webhook/api/components/vendors', data);
  },
  updateVendor(id, data) {
    return apiClient.put(`/webhook/api/components/vendors/${id}`, data);
  },
  deleteVendor(id) {
    return apiClient.delete(`/webhook/api/components/vendors/${id}`);
  },
  getVendorById(id) {
    return apiClient.get(`/webhook/api/components/vendors/${id}`);
  },
};

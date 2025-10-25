import apiClient from '../config';

export default {
  // Get all vendors with pagination
  getVendors(params = {}) {
    return apiClient.get('/webhook/api/components/vendors', { params });
  },

  // Get vendor metadata
  getVendorsMeta() {
    return apiClient.get('/webhook/api/components/vendors/meta');
  },

  // Create new vendor
  createVendor(data) {
    return apiClient.post('/webhook/api/components/vendors', data);
  },

  // Get single vendor by ID (using POST)
  getVendorById(id) {
    return apiClient.post('/webhook/api/components/vendors/get', { 
      vendor_id: id 
    });
  },

  // Update vendor (using POST)
  updateVendor(id, data) {""
    console.log('makign Request')
    return apiClient.post('/webhook/api/components/vendors/update', {
      vendor_id: id,
      ...data
    });
  },

  // Delete vendor (using POST)
  deleteVendor(id) {
    return apiClient.post('/webhook/api/components/vendors/delete', { 
      vendor_id: id 
    });
  }
};

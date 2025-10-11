import { defineStore } from 'pinia';
import { ref } from 'vue';
import vendorService from '@/api/services/vendorService';

export const useVendorStore = defineStore('vendor', () => {
  const vendors = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  const totalVendors = ref(0);

  const fetchVendors = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await vendorService.getVendors(params);
      vendors.value = response || [];
      console.log(response)
      totalItems.value = response || 0;
      await fetchVendorsMeta();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchVendorsMeta = async () => {
    try {
      const response = await vendorService.getVendorsMeta();
      const meta = response[0] || {};
      totalVendors.value = meta.totalVendors || 0;
    } catch {
      totalVendors.value = 0;
    }
  };

  return {
    vendors,
    totalItems,
    loading,
    error,
    totalVendors,
    fetchVendors,
    fetchVendorsMeta,
  };
});

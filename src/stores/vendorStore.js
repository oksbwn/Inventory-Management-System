import { defineStore } from "pinia";
import { ref } from "vue";
import vendorService from "@/api/services/vendorService";

export const useVendorStore = defineStore("vendor", () => {
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
      totalVendors.value = meta.summary.totalVendors || 0;
      return meta;
    } catch {
      totalVendors.value = 0;
    }
  };

  const allVendors = async () => {
    const res = await vendorService.getVendors();
    return res;
  };

  const createVendor = async (vendorData) => {
    loading.value = true;
    error.value = null;
    try {
      const createdVendor = await vendorService.createVendor(vendorData);
      // Optionally add to vendors list or refetch list after creation
      vendors.value.push(createdVendor);
      totalItems.value++;
      return createdVendor;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const updateVendor = async (id, vendorData) => {
    loading.value = true;
    error.value = null;
    try {
      // vendorData must already contain:
      // vendor_icon_name, vendor_icon_type, vendor_icon_content as base64 string if image is included
      const payload = {
        vendor_id: id,
        vendor_name: vendorData.vendor_name,
        website: vendorData.website,
        contact_email: vendorData.contact_email,
        phone_number: vendorData.phone_number,
        vendor_icon_name: vendorData.vendor_icon_name || "",
        vendor_icon_type: vendorData.vendor_icon_type || "",
        vendor_icon_content: vendorData.vendor_icon_content || "",
      };

      const updatedVendor = await vendorService.updateVendor(id, payload);

      // Update local list
      const index = vendors.value.findIndex((v) => v.vendor_id === id);
      if (index !== -1)
        vendors.value[index] = { ...vendors.value[index], ...updatedVendor };

      return updatedVendor;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteVendor = async (id) => {
    const res = await vendorService.deleteVendor(id);
    return res;
  };
  return {
    vendors,
    totalItems,
    loading,
    error,
    totalVendors,
    fetchVendors,
    fetchVendorsMeta,
    allVendors,
    createVendor,
    deleteVendor,
    updateVendor
  };
});

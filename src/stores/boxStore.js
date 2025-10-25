import { defineStore } from "pinia";
import { ref } from "vue";

import boxService from "@/api/services/boxService";

export const useBoxStore = defineStore("box", () => {
  const boxes = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // Metadata fields
  const totalBoxes = ref(0);
  const activeBoxes = ref(0);
  const emptyBoxes = ref(0);
  const totalComponents = ref(0);
  const recentAdditions = ref(0);

  const fetchBoxes = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await boxService.getBoxes(params);
      boxes.value = response[0].items || [];
      // totalItems.value = response.data.total || 0
      // Fetch metadata after boxes load for consistency
      await fetchBoxesMeta();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };
  const getNextBoxId = async () => {
    try {
      const response = await boxService.getNextBoxId();

      // Handle different response formats
      if (typeof response === "number") {
        return response;
      } else if (response.next_id) {
        return response.next_id;
      } else if (Array.isArray(response) && response[0]?.next_id) {
        return response[0].next_id;
      }

      // Fallback: calculate from existing boxes
      if (boxes.value.length === 0) {
        return 1;
      }
      const maxId = Math.max(...boxes.value.map((b) => b.box_id || 0));
      return maxId + 1;
    } catch (err) {
      console.error("Error getting next box ID:", err);
      // Fallback calculation
      if (boxes.value.length === 0) {
        return 1;
      }
      const maxId = Math.max(...boxes.value.map((b) => b.box_id || 0));
      return maxId + 1;
    }
  };

  const fetchBoxesMeta = async () => {
    try {
      const response = await boxService.getBoxesMeta();
      const meta = response[0] || {};
      totalBoxes.value = meta.totalBoxes || 0;
      activeBoxes.value = meta.activeBoxes || 0;
      emptyBoxes.value = meta.emptyBoxes || 0;
      totalComponents.value = meta.totalComponents || 0;
      recentAdditions.value = meta.recentAdditions || 0;
    } catch {
      // Can optionally reset metadata on failure
      totalBoxes.value = 0;
      activeBoxes.value = 0;
      emptyBoxes.value = 0;
      totalComponents.value = 0;
      recentAdditions.value = 0;
    }
  };

  // Create new box
  const createBox = async (boxData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await boxService.createBox(boxData);

      // Refresh boxes after creation
      await fetchBoxes();

      return response;
    } catch (err) {
      error.value = err.message || "Failed to create box";
      console.error("Error creating box:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update existing box
  const updateBox = async (boxId, boxData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await boxService.updateBox(boxId, boxData);

      // Update local state
      const index = boxes.value.findIndex((b) => b.box_id === boxId);
      if (index !== -1) {
        boxes.value[index] = { ...boxes.value[index], ...boxData };
      }

      return response;
    } catch (err) {
      error.value = err.message || "Failed to update box";
      console.error("Error updating box:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete box
  const deleteBox = async (boxId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await boxService.deleteBox(boxId);

      // Remove from local state
      boxes.value = boxes.value.filter((b) => b.box_id !== boxId);
      totalBoxes.value = Math.max(0, totalBoxes.value - 1);

      // Refresh metadata
      await fetchBoxesMeta();

      return response;
    } catch (err) {
      error.value = err.message || "Failed to delete box";
      console.error("Error deleting box:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Clear cache
  const clearCache = () => {
    boxes.value = [];
    totalItems.value = 0;
    totalBoxes.value = 0;
    activeBoxes.value = 0;
    emptyBoxes.value = 0;
    totalComponents.value = 0;
    recentAdditions.value = 0;
  };

  return {
    boxes,
    totalItems,
    loading,
    error,
    totalBoxes,
    activeBoxes,
    emptyBoxes,
    totalComponents,
    recentAdditions,
    fetchBoxes,
    fetchBoxesMeta,
    getNextBoxId,
    createBox,
    updateBox,
    deleteBox,
    clearCache,
  };
});

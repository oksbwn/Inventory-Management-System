import { defineStore } from "pinia";
import { ref } from "vue";
import categoryService from "@/api/services/categoryService";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // Metadata refs
  const metadata = ref(null);
  const totalCategories = ref(0);
  const activeCategories = ref(0);
  const emptyCategories = ref(0);
  const totalComponents = ref(0);
  const recentAdditions = ref(0);
  const statistics = ref({});
  const timeline = ref({});
  const insights = ref({});

  const fetchCategories = async (params = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryService.getCategories(params);
      categories.value = response || [];
      totalItems.value = response.length || 0;
      await fetchCategoryMetadata();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const fetchCategoryMetadata = async () => {
    try {
      const response = await categoryService.getCategoryMetadata();
      metadata.value = response[0];
      console.log()
      // Extract summary data
      const summary = response[0].summary || {};
      totalCategories.value = summary.totalCategories || 0;
      activeCategories.value = summary.activeCategories || 0;
      emptyCategories.value = summary.emptyCategories || 0;
      totalComponents.value = summary.totalComponents || 0;
      recentAdditions.value = summary.recentAdditions || 0;
      
      // Extract additional metadata
      statistics.value = response[0].statistics || {};
      timeline.value = response[0].timeline || {};
      insights.value = response[0].insights || {};
      
      return response[0];
    } catch (err) {
      // Reset metadata on error
      totalCategories.value = 0;
      activeCategories.value = 0;
      emptyCategories.value = 0;
      totalComponents.value = 0;
      recentAdditions.value = 0;
      statistics.value = {};
      timeline.value = {};
      insights.value = {};
      return null;
    }
  };

  const allCategories = async () => {
    const res = await categoryService.getCategories();
    return res;
  };

  const createCategory = async (categoryData) => {
    loading.value = true;
    error.value = null;
    try {
      const createdCategory = await categoryService.createCategory(categoryData);
      categories.value.push(createdCategory);
      totalItems.value++;
      return createdCategory;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id, categoryData) => {
    loading.value = true;
    error.value = null;
    try {
      const payload = {
        category_id: id,
        category_name: categoryData.category_name,
      };

      const updatedCategory = await categoryService.updateCategory(id, payload);

      // Update local list
      const index = categories.value.findIndex((c) => c.category_id === id);
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...updatedCategory };
      }

      return updatedCategory;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id) => {
    const res = await categoryService.deleteCategory(id);
    return res;
  };

  const clearCache = () => {
    categories.value = [];
    metadata.value = null;
    totalCategories.value = 0;
    activeCategories.value = 0;
    emptyCategories.value = 0;
    totalComponents.value = 0;
    recentAdditions.value = 0;
    statistics.value = {};
    timeline.value = {};
    insights.value = {};
  };

  return {
    // Category data
    categories,
    totalItems,
    loading,
    error,
    
    // Metadata
    metadata,
    totalCategories,
    activeCategories,
    emptyCategories,
    totalComponents,
    recentAdditions,
    statistics,
    timeline,
    insights,
    
    // Methods
    fetchCategories,
    fetchCategoryMetadata,
    allCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCache,
  };
});

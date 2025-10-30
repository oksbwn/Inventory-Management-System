import { defineStore } from "pinia";
import { useBaseStore } from "@/composables/useBaseStore";
import stockService from "@/api/services/stockService";
import { ref } from "vue";

// Service adapter with proper ES imports
const stockServiceAdapter = {
  getItems: (params) => stockService.getStocks(params),
  createItem: (data) => stockService.createStock(data),
  updateItem: (id, data) => stockService.updateStock(id, data),
  deleteItem: (id) => stockService.deleteStock(id),
  getGist: () => stockService.getStockGist(),
};

export const useStockStore = defineStore("stock", () => {
  const baseStore = useBaseStore("StockStore", stockServiceAdapter, {
    cacheTimeout: 5 * 60 * 1000,
    defaultItemsPerPage: 10,
    itemName: "stock",
    pluralItemName: "stocks",
  });

  const stockGist = ref({
    total_items: 0,
    in_stock: 0,
    low_stock: 0,
    no_stock: 0,
  });

  const purchaseHistory = ref([]);
  const purchaseHistoryLoading = ref(false);
  const purchaseHistoryError = ref(null);
  const stocks = baseStore.items;
  const fetchStocks = baseStore.fetchItems;
  const createStock = baseStore.createItem;
  const updateStock = baseStore.updateItem;
  const deleteStock = baseStore.deleteItem;
  const generalUsage = ref([]);
  const generalUsageLoading = ref(false);
  const generalUsageError = ref(null);
  const projectUsage = ref([]);
  const projectUsageLoading = ref(false);
  const projectUsageError = ref(null);

  const fetchStockGist = async () => {
    const res = await stockServiceAdapter.getGist();
    stockGist.value = res[0];
  };

  const allComponents = async () => {
    const res = await stockService.getAllComponents();
    return res;
  };

  const fetchPurchaseHistory = async (componentId) => {
    purchaseHistoryLoading.value = true;
    purchaseHistoryError.value = null;
    try {
      const history = await stockService.getPurchaseHistory(componentId);
      purchaseHistory.value = history.items || [];
      return history.items;
    } catch (err) {
      purchaseHistoryError.value =
        err.message || "Failed to fetch purchase history";
      purchaseHistory.value = [];
      throw err;
    } finally {
      purchaseHistoryLoading.value = false;
    }
  };

  const fetchProjectUsage = async (componentId) => {
    projectUsageLoading.value = true;
    projectUsageError.value = null;

    try {
      const response = await stockService.getProjectUsage(componentId);
      let data = typeof response === "string" ? JSON.parse(response) : response;
      if (Array.isArray(data)) {
        projectUsage.value = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        projectUsage.value = data.data;
      } else {
        projectUsage.value = [];
      }

      return projectUsage.value;
    } catch (err) {
      projectUsageError.value = err.message || "Failed to fetch project usage";
      projectUsage.value = [];
      throw err;
    } finally {
      projectUsageLoading.value = false;
    }
  };

  const fetchGeneralUsage = async (componentId) => {
    generalUsageLoading.value = true;
    generalUsageError.value = null;

    try {
      const response = await stockService.getGeneralUsage(componentId);
      let data = typeof response === "string" ? JSON.parse(response) : response;

      if (Array.isArray(data)) {
        generalUsage.value = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        generalUsage.value = data.data;
      } else {
        generalUsage.value = [];
      }

      return generalUsage.value;
    } catch (err) {
      generalUsageError.value = err.message || "Failed to fetch general usage";
      generalUsage.value = [];
      throw err;
    } finally {
      generalUsageLoading.value = false;
    }
  };

  const createComponent = async (componentData) => {
    try {
      const response = await stockService.createComponent(componentData);
      
      // Parse response if it's a string
      const newComponent = typeof response === 'string' ? JSON.parse(response)[0] : response[0] || response;
      
      // Add the new component to local state
      stocks.value.unshift(newComponent);
      
      // Update total items count
      if (baseStore.totalItems) {
        baseStore.totalItems.value++;
      }
      
      // Clear cache to force refresh on next fetch
      baseStore.clearCache();
      
      return newComponent;
    } catch (err) {
      console.error('Failed to create component:', err);
      throw err;
    }
  };

  const updateComponent = async (componentId, updateData) => {
    try {
      const response = await stockService.updateComponent(componentId, updateData);
      
      // Parse response if it's a string
      const updatedComponent = typeof response === 'string' ? JSON.parse(response)[0] : response[0] || response;
      
      // Update the component in local state
      const index = stocks.value.findIndex(s => s.id === componentId || s.component_id === componentId);
      if (index !== -1) {
        stocks.value[index] = { ...stocks.value[index], ...updatedComponent };
      }
      
      // Clear cache to ensure fresh data on next fetch
      baseStore.clearCache();
      
      return updatedComponent;
    } catch (err) {
      console.error('Failed to update component:', err);
      throw err;
    }
  };

  return {
    // State
    stocks,
    loading: baseStore.loading,
    error: baseStore.error,
    totalItems: baseStore.totalItems,
    itemsPerPage: baseStore.itemsPerPage,
    currentPage: baseStore.currentPage,
    search: baseStore.search,

    // Getters
    isCacheValid: baseStore.isCacheValid,

    // Actions
    fetchStocks,
    createStock,
    updateStock,
    deleteStock,
    clearCache: baseStore.clearCache,
    stockGist,
    fetchStockGist,
    allComponents,
    fetchPurchaseHistory,
    fetchProjectUsage,
    fetchGeneralUsage,
    createComponent,
    updateComponent
  };
});

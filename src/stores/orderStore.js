// src/stores/orderStore.js

import { defineStore } from "pinia";
import { ref } from "vue";
import orderService from "@/api/services/orderService";

export const useOrderStore = defineStore("order", () => {
  const orders = ref([]);
  const currentOrder = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const meta = ref([]);

  const fetchOrders = async (filters = {}) => {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await orderService.getOrders(filters);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchOrdersMeta = async () => {
    try {
      meta.value = await orderService.getOrdersMeta();
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const fetchOrder = async (order_id) => {
    loading.value = true;
    error.value = null;
    try {
      currentOrder.value = await orderService.getOrderById(order_id);
      return currentOrder.value;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (orderData) => {
    loading.value = true;
    error.value = null;
    try {
      const res = await orderService.createOrder(orderData);
      orders.value.unshift(res);
      return res;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteOrder = async (order_id) => {
    loading.value = true;
    error.value = null;
    try {
      await orderService.deleteOrder(order_id);
      orders.value = orders.value.filter((o) => o.order_id !== order_id);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    currentOrder,
    loading,
    error,
    meta,
    fetchOrders,
    fetchOrdersMeta,
    fetchOrder,
    createOrder,
    deleteOrder,
  };
});

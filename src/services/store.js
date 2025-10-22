// services/salesService.js
import api from "./Api";

export const storeService = {
  getStores: async (filters = {}) => {
    const response = await api.get("/stores/", { params: filters });
    return response.data;
  },

  getStoreById: async (id) => {
    const response = await api.get(`/stores/${id}/`);
    return response.data;
  },

  updateStore: async (id, data) => {
    const response = await api.put(`/stores/${id}/`, data);
    return response.data;
  },

  deleteStore: async (id) => {
    const response = await api.delete(`/stores/${id}/`);
    return response.data;
  },

  createStore: async (data) => {
    const response = await api.post("/stores/", data);
    return response.data;
  },
};

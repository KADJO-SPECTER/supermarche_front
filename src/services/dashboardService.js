// services/dashboardService.js
import api from './Api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRevenue: async (period) => {
    const response = await api.get(`/dashboard/revenue?period=${period}`);
    return response.data;
  },

  getSalesAnalysis: async () => {
    const response = await api.get('/dashboard/sales');
    return response.data;
  },

  getProductTypes: async () => {
    const response = await api.get('/dashboard/products');
    return response.data;
  }
};

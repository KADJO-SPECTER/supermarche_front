// services/salesService.js
import api from './Api';

export const salesService = {
  getSales: async (filters = {}) => {
    const response = await api.get('/sales/', { params: filters });
    return response.data;
  },

  getSaleById: async (id) => {
    const response = await api.get(`/sales/${id}/`);
    return response.data;
  },

  createSale: async (saleData) => {
    const response = await api.post('/sales/', saleData);
    return response.data;
  },
};

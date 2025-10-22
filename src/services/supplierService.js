// services/salesService.js
import api from './Api';

export const supplierService = {
  getSuppliers: async (filters = {}) => {
    const response = await api.get('/suppliers/', { params: filters });
    return response.data;
  },

  getSupplierById: async (id) => {
    const response = await api.get(`/suppliers/${id}/`);
    return response.data;
  },

  createSupplier: async (data) => {
    const response = await api.post('/suppliers/', data);
    return response.data;
  },
};

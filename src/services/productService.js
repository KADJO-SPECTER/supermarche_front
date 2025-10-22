// services/salesService.js
import api from './Api';

export const productService = {
  getProducts: async (filters = {}) => {
    const response = await api.get('/products/', { params: filters });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}/`);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}/`, data);
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post('/products/', data);
    return response.data;
  },
};

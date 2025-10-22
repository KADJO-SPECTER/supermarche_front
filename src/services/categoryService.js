// services/salesService.js
import api from './Api';

export const categoryService = {
  getCategories: async (filters = {}) => {
    const response = await api.get('/categories/', { params: filters });
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/categories/', data);
    return response.data;
  },
};

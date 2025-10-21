// services/authService.js
import api from './Api';

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('accessToken', token);
    return { token, user };
  },

  logout: () => {
    localStorage.removeItem('accessToken');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export default AuthService
// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://giant-masks-draw.loca.lt/api',
  timeout: 10000,
});

// Intercepteur pour ajouter le token à chaque requête
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs (token expiré, etc.)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// services/authService.js
import api from './Api';

export const AuthService = {
  // Connexion
  login: async (email, password) => {
    const response = await api.post('/auth/login/', {
      email,
      password,
    });

    const { access, refresh, user } = response.data;
    
    // Stocker les tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    return { access, refresh, user };
  },

  // Déconnexion
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Vérifier l'authentification
  checkAuth: async () => {
    const response = await api.get('/auth/check/');
    return response.data;
  },

  // Rafraîchir le token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/auth/refresh/', {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem('access_token', access);
    
    return access;
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Obtenir les informations de l'utilisateur connecté
  getCurrentUser: async () => {
    const response = await api.get('/users/me/');
    return response.data;
  },
};

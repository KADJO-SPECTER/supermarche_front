// services/userService.js
import api from './Api';

export const userService = {
  // Liste des utilisateurs
  getUsers: async (page = 1, showAll = false) => {
    const response = await api.get('/users/', {
      params: { page, show_all: showAll },
    });
    return response.data;
  },

  // Détails d'un utilisateur
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Créer un utilisateur
  createUser: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  // Modifier un utilisateur
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}/`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}/`);
    return response.data;
  },

  // Activer un utilisateur
  activateUser: async (id) => {
    const response = await api.post(`/users/${id}/activate/`);
    return response.data;
  },

  // Désactiver un utilisateur
  deactivateUser: async (id) => {
    const response = await api.post(`/users/${id}/deactivate/`);
    return response.data;
  },

  // Assigner un rôle
  assignAuthority: async (id, authorityId, action = 'add') => {
    const response = await api.post(`/users/${id}/assign_authority/`, {
      authority_id: authorityId,
      action,
    });
    return response.data;
  },

  // Changer le mot de passe
  changePassword: async (oldPassword, newPassword, newPasswordConfirm) => {
    const response = await api.post('/users/change_password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
    return response.data;
  },
};

// services/statsService.js
import api from './Api';

export const statsService = {
  // Obtenir les statistiques des ventes
  getSalesStatistics: async (days = 30) => {
    const response = await api.get('/sales/statistics/', {
      params: { days },
    });
    console.log('Statistiques des ventes reçues:', response);
    return response.data;
  },

  // Ventes du jour
  getTodaySales: async () => {
    const response = await api.get('/sales/today/');
    return response.data;
  },

  // Top performers (employés)
  getTopPerformers: async () => {
    const response = await api.get('/performances/top_performers/');
    return response.data;
  },

  // Statistiques générales pour le dashboard
  getDashboardStats: async () => {
    try {
      // Récupérer les statistiques des 30 derniers jours
      const salesStats = await statsService.getSalesStatistics(30);
      
      return {
        total_revenue: salesStats.total_revenue || 0,
        average_basket: salesStats.average_basket || 0,
        average_affluence: salesStats.total_sales || 0,
        retention_rate: salesStats.retention_rate || 0,
        // Variations (calculées par l'API ou par défaut)
        revenue_change: salesStats.revenue_change || 13.9,
        basket_change: salesStats.basket_change || 1.5,
        affluence_change: salesStats.affluence_change || 0.9,
        retention_change: salesStats.retention_change || 10.97,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      throw error;
    }
  },
};

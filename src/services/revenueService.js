// services/revenueService.js
import api from './Api';

export const revenueService = {
  // Statistiques des ventes (contient les revenus)
  getSalesStatistics: async (days = 7) => {
    const response = await api.get('/sales/statistics/', {
      params: { days },
    });
    return response.data;
  },

  // Ventes du jour
  getTodaySales: async () => {
    const response = await api.get('/sales/today/');
    return response.data;
  },

  // Obtenir les ventes avec filtres de date
  getSalesByDateRange: async (startDate, endDate) => {
    const response = await api.get('/sales/', {
      params: {
        startdate: startDate,
        enddate: endDate,
      },
    });
    return response.data;
  },

  // Calculer les revenus par jour de la semaine
  getWeeklyRevenue: async () => {
    try {
      // Calculer les dates pour les 7 derniers jours
      const today = new Date();
      const days = [];
      const dailyRevenue = {};

      // Récupérer les statistiques des 7 derniers jours
      const stats = await revenueService.getSalesStatistics(7);

      // Si l'API retourne directement les données par jour
      if (stats.daily_revenue) {
        return stats.daily_revenue;
      }

      // Sinon, récupérer toutes les ventes de la semaine
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);

      const salesResponse = await revenueService.getSalesByDateRange(
        startDate.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );

      const sales = salesResponse.results || salesResponse;

      // Initialiser les jours de la semaine
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = dayNames[date.getDay()];
        days.push(dayName);
        dailyRevenue[dayName] = 0;
      }

      // Calculer le total par jour
      if (Array.isArray(sales)) {
        sales.forEach((sale) => {
          const saleDate = new Date(sale.date);
          const dayName = dayNames[saleDate.getDay()];
          if (dailyRevenue.hasOwnProperty(dayName)) {
            dailyRevenue[dayName] += parseFloat(sale.total_amount || 0);
          }
        });
      }

      return {
        days,
        values: days.map((day) => dailyRevenue[day]),
        total: Object.values(dailyRevenue).reduce((a, b) => a + b, 0),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus hebdomadaires:', error);
      throw error;
    }
  },
};

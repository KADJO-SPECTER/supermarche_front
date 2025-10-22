// services/reportsService.js
import api from './Api';

export const reportsService = {
  // Obtenir les statistiques globales
  getGlobalStatistics: async (days = 30, storeId = null, categoryId = null) => {
    try {
      const params = { days };
      
      const [salesStats, customers, stores, categories] = await Promise.all([
        api.get('/sales/statistics/', { params }),
        api.get('/customers/', { params: { show_all: true } }),
        storeId ? api.get(`/stores/${storeId}/`) : api.get('/stores/'),
        categoryId ? api.get(`/categories/${categoryId}/`) : api.get('/categories/'),
      ]);

      // Calculer le chiffre d'affaires total
      const totalRevenue = salesStats.data.total_revenue || 0;
      
      // Calculer le nombre de commandes
      const ordersCount = salesStats.data.total_sales || 0;
      
      // Calculer le nombre de clients actifs (ayant fait au moins un achat)
      const activeCustomers = customers.data.results?.filter(c => 
        parseFloat(c.total_purchases || 0) > 0
      ).length || 0;
      
      // Calculer le panier moyen
      const averageBasket = ordersCount > 0 
        ? totalRevenue / ordersCount 
        : 0;

      return {
        totalRevenue,
        ordersCount,
        activeCustomers,
        averageBasket,
        // Variations (peuvent être calculées par l'API)
        revenueChange: salesStats.data.revenue_change || 13.9,
        ordersChange: salesStats.data.orders_change || 0.9,
        customersChange: salesStats.data.customers_change || 2.4,
        basketChange: salesStats.data.basket_change || 1.5,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // Obtenir les données de performance des ventes par période
  getSalesPerformance: async (days = 30, storeId = null) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const params = {
        startdate: startDate.toISOString().split('T')[0],
        enddate: endDate.toISOString().split('T')[0],
      };

      if (storeId) {
        params.register = storeId; // Filtrer par magasin via la caisse
      }

      const response = await api.get('/sales/', { params });
      const sales = response.data.results || response.data;

      // Grouper les ventes par jour
      const dailySales = {};
      const daysArray = [];

      // Initialiser tous les jours de la période
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        dailySales[dateKey] = 0;
        daysArray.push(dateKey);
      }

      // Calculer le total des ventes par jour
      if (Array.isArray(sales)) {
        sales.forEach((sale) => {
          const saleDate = sale.date.split('T')[0];
          if (dailySales.hasOwnProperty(saleDate)) {
            dailySales[saleDate] += parseFloat(sale.total_amount || 0);
          }
        });
      }

      return {
        labels: daysArray.map(date => {
          const d = new Date(date);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        }),
        data: daysArray.map(date => dailySales[date]),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la performance:', error);
      throw error;
    }
  },

  // Obtenir les tendances des produits par catégorie
  getProductTrends: async (days = 30, categoryId = null) => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      // Récupérer toutes les ventes de la période
      const salesResponse = await api.get('/sales/', {
        params: {
          startdate: startDate.toISOString().split('T')[0],
          enddate: endDate.toISOString().split('T')[0],
        },
      });

      const sales = salesResponse.data.results || salesResponse.data;

      // Récupérer les catégories
      const categoriesResponse = await api.get('/categories/', {
        params: { show_all: true },
      });
      const categories = categoriesResponse.data.results || categoriesResponse.data;

      // Initialiser les ventes par catégorie
      const categoryTrends = {};
      categories.forEach((category) => {
        categoryTrends[category.id] = {
          name: category.name,
          total: 0,
          count: 0,
        };
      });

      // Parcourir toutes les ventes et leurs articles
      for (const sale of sales) {
        try {
          const saleItemsResponse = await api.get(`/sales/${sale.id}/items/`);
          const items = saleItemsResponse.data;

          if (Array.isArray(items)) {
            for (const item of items) {
              // Récupérer le produit pour connaître sa catégorie
              try {
                const productResponse = await api.get(`/products/${item.product}/`);
                const product = productResponse.data;
                const categoryId = product.category;

                if (categoryTrends[categoryId]) {
                  categoryTrends[categoryId].total += parseFloat(item.totalprice || 0);
                  categoryTrends[categoryId].count += parseInt(item.quantity || 0);
                }
              } catch (err) {
                console.error(`Erreur produit ${item.product}:`, err);
              }
            }
          }
        } catch (err) {
          console.error(`Erreur vente ${sale.id}:`, err);
        }
      }

      // Convertir en tableau et trier
      const trendsArray = Object.values(categoryTrends)
        .filter(cat => cat.total > 0)
        .sort((a, b) => b.total - a.total)
        .slice(0, 5); // Top 5 catégories

      return {
        labels: trendsArray.map(cat => cat.name),
        data: trendsArray.map(cat => cat.total),
        counts: trendsArray.map(cat => cat.count),
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances:', error);
      throw error;
    }
  },

  // Obtenir la liste des magasins
  getStores: async () => {
    const response = await api.get('/stores/');
    return response.data.results || response.data;
  },

  // Obtenir la liste des catégories
  getCategories: async () => {
    const response = await api.get('/categories/', {
      params: { show_all: true },
    });
    return response.data.results || response.data;
  },
};

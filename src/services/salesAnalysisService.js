// services/salesAnalysisService.js
import api from './Api';

export const salesAnalysisService = {
  // Obtenir toutes les ventes avec filtres
  getSales: async (filters = {}) => {
    const response = await api.get('/sales/', { params: filters });
    return response.data;
  },

  // Obtenir tous les magasins
  getStores: async () => {
    const response = await api.get('/stores/');
    return response.data;
  },

  // Obtenir les caisses d'un magasin
  getStoreRegisters: async (storeId) => {
    const response = await api.get(`/stores/${storeId}/registers/`);
    return response.data;
  },

  // Obtenir les ventes d'une caisse
  getCashRegisterSales: async (registerId) => {
    const response = await api.get(`/cash-registers/${registerId}/sales/`);
    return response.data;
  },

  // Calculer les ventes par magasin
  getSalesByStore: async (days = 30) => {
    try {
      // 1. Récupérer tous les magasins
      const storesResponse = await salesAnalysisService.getStores();
      const stores = storesResponse.results || storesResponse;

      // 2. Calculer la période
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      // 3. Pour chaque magasin, calculer les ventes
      const storesAnalysis = await Promise.all(
        stores.map(async (store) => {
          try {
            // Récupérer les caisses du magasin
            const registersResponse = await this.getStoreRegisters(store.id);
            const registers = registersResponse.results || registersResponse || [];

            let totalSales = 0;
            let salesCount = 0;

            // Pour chaque caisse, récupérer les ventes
            for (const register of registers) {
              const salesResponse = await salesAnalysisService.getCashRegisterSales(register.id);
              const sales = salesResponse.results || salesResponse || [];

              // Filtrer par date et calculer le total
              const filteredSales = Array.isArray(sales) 
                ? sales.filter((sale) => {
                    const saleDate = new Date(sale.date);
                    return saleDate >= startDate && saleDate <= endDate;
                  })
                : [];

              totalSales += filteredSales.reduce(
                (sum, sale) => sum + parseFloat(sale.total_amount || 0),
                0
              );
              salesCount += filteredSales.length;
            }

            // Calculer la performance (pourcentage par rapport au total)
            return {
              id: store.id,
              name: store.name,
              totalSales,
              salesCount,
              address: store.address,
            };
          } catch (error) {
            console.error(`Erreur pour le magasin ${store.name}:`, error);
            return {
              id: store.id,
              name: store.name,
              totalSales: 0,
              salesCount: 0,
              address: store.address,
            };
          }
        })
      );

      // 4. Calculer le total général
      const grandTotal = storesAnalysis.reduce(
        (sum, store) => sum + store.totalSales,
        0
      );

      // 5. Ajouter le pourcentage de performance
      const storesWithPerformance = storesAnalysis.map((store) => ({
        ...store,
        performance: grandTotal > 0 
          ? ((store.totalSales / grandTotal) * 100).toFixed(1)
          : '0.0',
      }));

      // 6. Trier par montant de ventes (du plus élevé au plus bas)
      storesWithPerformance.sort((a, b) => b.totalSales - a.totalSales);

      return {
        stores: storesWithPerformance,
        grandTotal,
        period: days,
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse des ventes:', error);
      throw error;
    }
  },

  // Version simplifiée si l'API retourne déjà les statistiques
  getStoresStatistics: async () => {
    try {
      // Si votre API a un endpoint pour les stats par magasin
      const response = await api.get('/stores/statistics/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des magasins:', error);
      // Sinon utiliser la méthode getSalesByStore
      return salesAnalysisService.getSalesByStore();
    }
  },
};

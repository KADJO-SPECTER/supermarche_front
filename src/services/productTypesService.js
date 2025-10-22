// services/productTypesService.js
import api from './Api';

export const productTypesService = {
  // Obtenir toutes les catégories
  getCategories: async () => {
    const response = await api.get('/categories/', {
      params: { show_all: true },
    });
    return response.data;
  },

  // Obtenir les produits d'une catégorie
  getCategoryProducts: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}/products/`);
    return response.data;
  },

  // Obtenir toutes les ventes avec leurs articles
  getSales: async (days = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const response = await api.get('/sales/', {
      params: {
        startdate: startDate.toISOString().split('T')[0],
        enddate: endDate.toISOString().split('T')[0],
        show_all: true,
      },
    });
    return response.data;
  },

  // Analyser les ventes par catégorie
  getSalesByCategory: async (days = 30) => {
    try {
      // 1. Récupérer toutes les catégories
      const categoriesResponse = await productTypesService.getCategories();
      const categories = categoriesResponse.results || categoriesResponse;

      // 2. Récupérer toutes les ventes de la période
      const salesResponse = await productTypesService.getSales(days);
      const sales = salesResponse.results || salesResponse;

      // 3. Initialiser les statistiques par catégorie
      const categoriesMap = {};
      categories.forEach((category) => {
        categoriesMap[category.id] = {
          id: category.id,
          name: category.name,
          totalSales: 0,
          itemsCount: 0,
        };
      });

      // 4. Parcourir toutes les ventes et leurs articles
      let grandTotal = 0;
      
      for (const sale of sales) {
        if (Array.isArray(sale.items)) {
          // Si les items sont déjà inclus dans la réponse
          for (const item of sale.items) {
            if (item.product && item.product.category) {
              const categoryId = item.product.category;
              if (categoriesMap[categoryId]) {
                categoriesMap[categoryId].totalSales += parseFloat(item.totalprice || 0);
                categoriesMap[categoryId].itemsCount += parseInt(item.quantity || 0);
                grandTotal += parseFloat(item.totalprice || 0);
              }
            }
          }
        } else {
          // Sinon, récupérer les détails de la vente
          try {
            const saleDetailResponse = await api.get(`/sales/${sale.id}/`);
            const saleDetail = saleDetailResponse.data;
            
            if (Array.isArray(saleDetail.items)) {
              for (const item of saleDetail.items) {
                // Récupérer les infos du produit pour connaître sa catégorie
                try {
                  const productResponse = await api.get(`/products/${item.product}/`);
                  const product = productResponse.data;
                  const categoryId = product.category;
                  
                  if (categoriesMap[categoryId]) {
                    categoriesMap[categoryId].totalSales += parseFloat(item.totalprice || 0);
                    categoriesMap[categoryId].itemsCount += parseInt(item.quantity || 0);
                    grandTotal += parseFloat(item.totalprice || 0);
                  }
                } catch (error) {
                  console.error(`Erreur produit ${item.product}:`, error);
                }
              }
            }
          } catch (error) {
            console.error(`Erreur vente ${sale.id}:`, error);
          }
        }
      }

      // 5. Calculer les pourcentages
      const categoriesArray = Object.values(categoriesMap)
        .filter((cat) => cat.totalSales > 0) // Garder seulement les catégories avec des ventes
        .map((cat) => ({
          ...cat,
          percentage: grandTotal > 0 
            ? ((cat.totalSales / grandTotal) * 100).toFixed(1)
            : 0,
        }))
        .sort((a, b) => b.totalSales - a.totalSales); // Trier par ventes

      return {
        categories: categoriesArray,
        grandTotal,
        period: days,
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse des catégories:', error);
      throw error;
    }
  },
};

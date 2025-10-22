// components/ProductTypes.jsx
import { useEffect, useState } from 'react';
import { productTypesService } from '../services/productTypesService';

const ProductTypes = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);

  // Couleurs pour les catégories
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-orange-500',
  ];

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoading(true);
        const data = await productTypesService.getSalesByCategory(30);
        console.log('Données des ventes par catégorie:', data);
        // Assigner une couleur à chaque catégorie
        const categoriesWithColors = data.categories.map((category, index) => ({
          ...category,
          color: colors[index % colors.length],
        }));

        setCategories(categoriesWithColors);
        setTotalSales(data.grandTotal);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, []);

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M XOF`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k XOF`;
    }
    return `${amount.toFixed(0)} XOF`;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Type de produits</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Chargement des catégories...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Type de produits</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: {error}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Type de produits</h2>
        <div className="text-center text-gray-500 py-8">
          Aucune donnée de vente par catégorie disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Type de produits</h2>
      <p className="text-gray-500 mb-6">Au cours des 30 derniers jours</p>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Graphique circulaire simplifié avec total */}
        <div className="md:w-1/3 flex flex-col justify-center items-center">
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center shadow-lg">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <span className="text-lg font-bold text-gray-900">
              {formatAmount(totalSales)}
            </span>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              {categories.length} catégories
            </p>
          </div>
        </div>
        
        {/* Barres de progression */}
        <div className="md:w-2/3">
          {categories.map((category, index) => (
            <div key={category.id} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1 items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    {category.itemsCount} articles
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {category.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full ${category.color} transition-all duration-500 ease-out`}
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {formatAmount(category.totalSales)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductTypes;

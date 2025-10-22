// components/SalesAnalysis.jsx
import { useEffect, useState } from 'react';
import { salesAnalysisService } from '../services/salesAnalysisService';

const SalesAnalysis = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesAnalysis = async () => {
      try {
        setLoading(true);
        const data = await salesAnalysisService.getSalesByStore(30);
        
        // Formater les données pour l'affichage
        const formattedStores = data.stores.map((store) => ({
          id: store.id,
          name: store.name,
          sales: formatAmount(store.totalSales),
          performance: `${store.performance}%`,
          salesCount: store.salesCount,
        }));

        setStores(formattedStores);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'analyse:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesAnalysis();
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
        <h2 className="text-lg font-semibold mb-4">Analyse des ventes en magasin</h2>
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">Chargement de l'analyse...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Analyse des ventes en magasin</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: {error}
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Analyse des ventes en magasin</h2>
        <div className="text-center text-gray-500 py-8">
          Aucune donnée de vente disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Analyse des ventes en magasin</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Point de vente
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant des ventes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de ventes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {store.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {store.sales}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    parseFloat(store.performance) > 30 
                      ? 'bg-green-100 text-green-800'
                      : parseFloat(store.performance) > 20
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {store.performance}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {store.salesCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 border-t pt-3">
        Données des 30 derniers jours
      </div>
    </div>
  );
};

export default SalesAnalysis;

// pages/ReportsPage.jsx
import { useState, useEffect } from 'react';
import { MdTrendingUp, MdShoppingCart, MdPeople, MdAttachMoney } from 'react-icons/md';
import { reportsService } from '../services/reportsService';

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtres
  const [period, setPeriod] = useState('30');
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Données
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    activeCustomers: 0,
    averageBasket: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    basketChange: 0,
  });
  
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salesPerformance, setSalesPerformance] = useState({ labels: [], data: [] });
  const [productTrends, setProductTrends] = useState({ labels: [], data: [] });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadReportData();
  }, [period, selectedStore, selectedCategory]);

  const loadInitialData = async () => {
    try {
      const [storesData, categoriesData] = await Promise.all([
        reportsService.getStores(),
        reportsService.getCategories(),
      ]);

      setStores(storesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Erreur lors du chargement initial:', err);
    }
  };

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const days = parseInt(period);
      const storeId = selectedStore !== 'all' ? parseInt(selectedStore) : null;
      const categoryId = selectedCategory !== 'all' ? parseInt(selectedCategory) : null;

      const [statsData, performanceData, trendsData] = await Promise.all([
        reportsService.getGlobalStatistics(days, storeId, categoryId),
        reportsService.getSalesPerformance(days, storeId),
        reportsService.getProductTrends(days, categoryId),
      ]);

      setStats(statsData);
      setSalesPerformance(performanceData);
      setProductTrends(trendsData);
    } catch (err) {
      console.error('Erreur lors du chargement des rapports:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toFixed(0);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case '7': return '7 derniers jours';
      case '30': return '30 derniers jours';
      case '90': return '3 derniers mois';
      case '365': return 'Cette année';
      default: return '30 derniers jours';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#40514E] mb-4">Rapports et Statistiques</h2>
        
        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Erreur: {error}
          </div>
        )}
        
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">3 derniers mois</option>
            <option value="365">Cette année</option>
          </select>
          
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="all">Tous les magasins</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <button 
            onClick={loadReportData}
            disabled={loading}
            className="bg-[#40514E] text-white rounded-lg px-4 py-2 hover:bg-[#2F3E3C] transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Générer rapport'}
          </button>
        </div>

        {loading && !stats.totalRevenue ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Chargement des données...</div>
          </div>
        ) : (
          <>
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Chiffre d'affaires total</h3>
                    <p className="text-2xl font-bold text-[#40514E] mt-1">
                      {formatAmount(stats.totalRevenue)} XOF
                    </p>
                    <p className={`text-sm mt-1 ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <MdAttachMoney className="text-green-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Commandes</h3>
                    <p className="text-2xl font-bold text-[#40514E] mt-1">{stats.ordersCount}</p>
                    <p className={`text-sm mt-1 ${stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MdShoppingCart className="text-blue-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Clients actifs</h3>
                    <p className="text-2xl font-bold text-[#40514E] mt-1">{stats.activeCustomers}</p>
                    <p className={`text-sm mt-1 ${stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MdPeople className="text-purple-600 text-2xl" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Panier moyen</h3>
                    <p className="text-2xl font-bold text-[#40514E] mt-1">
                      {formatAmount(stats.averageBasket)} XOF
                    </p>
                    <p className={`text-sm mt-1 ${stats.basketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.basketChange >= 0 ? '+' : ''}{stats.basketChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <MdTrendingUp className="text-yellow-600 text-2xl" />
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques de rapports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance des ventes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Performance des ventes</h3>
                  <span className="text-sm text-gray-500">{getPeriodLabel()}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded p-4">
                  {salesPerformance.data.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Début</span>
                        <span>Fin</span>
                      </div>
                      <div className="h-48 flex items-end justify-between gap-1">
                        {salesPerformance.data.map((value, index) => {
                          const maxValue = Math.max(...salesPerformance.data);
                          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                          
                          return (
                            <div key={index} className="flex-1 flex flex-col items-center group">
                              <div className="relative w-full">
                                <div
                                  className="bg-[#40514E] hover:bg-[#6FCF97] transition-colors rounded-t cursor-pointer"
                                  style={{ height: `${height}%`, minHeight: value > 0 ? '4px' : '0' }}
                                  title={`${salesPerformance.labels[index]}: ${formatAmount(value)} XOF`}
                                ></div>
                                <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  {formatAmount(value)} XOF
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-2">
                        Total: {formatAmount(salesPerformance.data.reduce((a, b) => a + b, 0))} XOF
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      Aucune donnée disponible
                    </div>
                  )}
                </div>
              </div>

              {/* Tendances des produits */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Top catégories</h3>
                  <span className="text-sm text-gray-500">{getPeriodLabel()}</span>
                </div>
                <div className="bg-white border border-gray-200 rounded p-4">
                  {productTrends.labels.length > 0 ? (
                    <div className="space-y-3">
                      {productTrends.labels.map((label, index) => {
                        const maxValue = Math.max(...productTrends.data);
                        const percentage = maxValue > 0 ? (productTrends.data[index] / maxValue) * 100 : 0;
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-gray-700">{label}</span>
                              <span className="text-gray-600">
                                {formatAmount(productTrends.data[index])} XOF
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[#6FCF97] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-500">
                      Aucune donnée disponible
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;

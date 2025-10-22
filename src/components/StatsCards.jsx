// components/StatsCards.jsx
import { useEffect, useState } from 'react';
import { statsService } from '../services/statsService';

const StatsCards = () => {
  const [stats, setStats] = useState({
    total_revenue: '0k',
    average_basket: '0k',
    average_affluence: '0',
    retention_rate: '0%',
    revenue_change: '0%',
    basket_change: '0%',
    affluence_change: '0%',
    retention_change: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await statsService.getDashboardStats();

        // console.log('Données des statistiques reçues:', data);
        
        setStats({
          total_revenue: `${(data.total_revenue / 1000).toFixed(0)}k`,
          average_basket: `${(data.average_basket / 1000).toFixed(1)}k`,
          average_affluence: data.average_affluence.toString(),
          retention_rate: `${data.retention_rate.toFixed(1)}%`,
          revenue_change: `${data.revenue_change.toFixed(1)}%`,
          basket_change: `${data.basket_change.toFixed(1)}%`,
          affluence_change: `${data.affluence_change.toFixed(1)}%`,
          retention_change: `${data.retention_change.toFixed(2)}%`,
        });
      } catch (err) {
        console.error('Erreur lors du chargement des stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="col-span-4 flex justify-center items-center p-6">
        <div className="text-gray-500">Chargement des statistiques...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-4 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: {error}
        </div>
      </div>
    );
  }

  const statsData = [
    { 
      title: "Recettes totales", 
      value: stats.total_revenue, 
      change: stats.revenue_change, 
      positive: true 
    },
    { 
      title: "Panier moyen", 
      value: stats.average_basket, 
      change: stats.basket_change, 
      positive: true 
    },
    { 
      title: "Affluence moyenne", 
      value: stats.average_affluence, 
      change: stats.affluence_change, 
      positive: true 
    },
    { 
      title: "Taux de fidélisation", 
      value: stats.retention_rate, 
      change: stats.retention_change, 
      positive: true 
    }
  ];

  return (
    <>
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-semibold text-gray-900">
              {stat.value}
            </span>
            <span className={`ml-2 text-sm font-medium ${
              stat.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsCards;

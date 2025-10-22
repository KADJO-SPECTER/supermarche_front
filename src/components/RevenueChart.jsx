// components/RevenueChart.jsx
import { useEffect, useState } from 'react';
import { revenueService } from '../services/revenueService';

const RevenueChart = () => {
  const [chartData, setChartData] = useState({
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [0, 0, 0, 0, 0, 0, 0],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const data = await revenueService.getWeeklyRevenue();
        
        // Normaliser les données pour le graphique
        const maxValue = Math.max(...data.values);
        const normalizedValues = data.values.map((value) => 
          maxValue > 0 ? (value / maxValue) * 100 : 0
        );

        setChartData({
          days: data.days,
          values: normalizedValues,
          actualValues: data.values,
          total: data.total,
          maxValue: maxValue,
        });
      } catch (err) {
        console.error('Erreur lors du chargement des revenus:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  console.log('Données du graphique des revenus:', chartData);
  console.log('Chargement:', loading, 'Erreur:', error);


  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Chargement des revenus...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: {error}
        </div>
      </div>
    );
  }

  // Formater le montant total
  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`;
    }
    return amount.toFixed(0);
  };

  // Calculer les valeurs pour l'échelle
  const maxScale = chartData.maxValue || 100000;
  const midScale = maxScale / 2;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Revenus totaux - Cette semaine</h2>
        <span className="text-xl font-bold">
          {formatAmount(chartData.total)} XOF
        </span>
      </div>
      <p className="text-gray-500 mb-6">7 derniers jours</p>
      
      <div className="relative h-64">
        {/* Grille de fond */}
        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="border-t border-gray-200"></div>
          <div className="border-t border-gray-200"></div>
          <div className="border-t border-gray-200"></div>
        </div>

        <div className="relative flex items-end justify-between h-full pl-12">
          {chartData.days.map((day, index) => (
            <div key={day} className="flex flex-col items-center flex-1 mx-1 group">
              <div className="relative w-full flex justify-center">
                {/* Barre */}
                <div 
                  className="bg-blue-500 hover:bg-blue-600 rounded-t transition-all duration-300 cursor-pointer"
                  style={{ 
                    height: `${chartData.values[index]}%`,
                    width: '70%',
                    minHeight: chartData.values[index] > 0 ? '4px' : '0'
                  }}
                  title={`${day}: ${formatAmount(chartData.actualValues[index])} XOF`}
                ></div>

                {/* Tooltip au survol */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                  {formatAmount(chartData.actualValues[index])} XOF
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
              
              <span className="mt-2 text-xs text-gray-500 font-medium">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Échelle verticale */}
        <div className="absolute left-0 top-0 flex flex-col justify-between h-full text-xs text-gray-400 pr-2">
          <span>{formatAmount(maxScale)}</span>
          <span>{formatAmount(midScale)}</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;

// pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { dashboardService } from '../services/dashboardService';
import StatsCards from '../components/StatsCards';
import RevenueChart from '../components/RevenueChart';
import SalesAnalysis from '../components/SalesAnalysis';
import ProductTypes from '../components/ProductTypes';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-[#40514E]">ShopSync Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Bienvenue, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCards data={stats} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <SalesAnalysis />
        </div>
        
        <div className="mt-6">
          <ProductTypes />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

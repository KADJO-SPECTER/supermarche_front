import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardPage from "../pages/DashboardPage";
import UsersPage from "../pages/UsersPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import ProductsPage from "./ProductsPage";
import PointsDeVentePage from "./PointsDeVentePage";


const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "produits":
        return <ProductsPage />;
      case "utilisateurs":
        return <UsersPage />;
      case "points-vente":
        return <PointsDeVentePage />;
      case "rapports":
        return <ReportsPage />;
      case "configurations":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header sur toute la largeur */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar à gauche */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={onLogout}
        />

        {/* Contenu principal à droite */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

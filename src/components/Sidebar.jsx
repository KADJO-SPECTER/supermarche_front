import {
  MdDashboard,
  MdPeople,
  MdBarChart,
  MdSettings,
  MdExitToApp,
  MdInventory,
  MdStore,
} from "react-icons/md";

const Sidebar = ({ activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "points-vente", label: "Points de vente", icon: MdStore },
    { id: "produits", label: "Produits", icon: MdInventory },
    { id: "utilisateurs", label: "Utilisateurs", icon: MdPeople },
    { id: "rapports", label: "Rapports", icon: MdBarChart },
    { id: "configurations", label: "Configurations", icon: MdSettings },
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  return (
    <div className="bg-white flex flex-col justify-between text-gray-800 w-64 h-full py-7 px-2 shadow-md">
      <div>
        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-[#669B7C] bg-opacity-12 text-[#40514E] font-bold border-r-4 border-[#40514E]"
                    : "text-[#669B7C] font-regular hover:text-[#40514E]"
                }`}
              >
                <IconComponent
                  className={`mr-3 text-lg ${
                    activeTab === item.id ? "text-[#40514E]" : "text-[#669B7C]"
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Déconnexion en bas */}
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-[#669B7C] font-regular hover:text-[#40514E]"
        >
          <MdExitToApp className="mr-3 text-lg" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

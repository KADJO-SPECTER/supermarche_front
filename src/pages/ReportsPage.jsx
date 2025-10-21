const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#40514E] mb-4">Rapports et Statistiques</h2>
        
        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
            <option>Période: 30 derniers jours</option>
            <option>7 derniers jours</option>
            <option>3 derniers mois</option>
            <option>Cette année</option>
          </select>
          
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
            <option>Tous les magasins</option>
            <option>ESATIC</option>
            <option>CHU</option>
            <option>POSTE</option>
          </select>
          
          <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
            <option>Toutes les catégories</option>
            <option>Électronique</option>
            <option>Épicerie</option>
            <option>Meubles</option>
          </select>
          
          <button className="bg-[#40514E] text-white rounded-lg px-4 py-2 hover:bg-[#2F3E3C] transition duration-200">
            Générer rapport
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Chiffre d'affaires total</h3>
            <p className="text-2xl font-bold text-[#40514E]">203K XOF</p>
            <p className="text-sm text-green-600">+13.9%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Commandes</h3>
            <p className="text-2xl font-bold text-[#40514E]">683</p>
            <p className="text-sm text-green-600">+0.9%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Clients actifs</h3>
            <p className="text-2xl font-bold text-[#40514E]">2.4K</p>
            <p className="text-sm text-green-600">+2.4%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Panier moyen</h3>
            <p className="text-2xl font-bold text-[#40514E]">3.4K XOF</p>
            <p className="text-sm text-green-600">+1.5%</p>
          </div>
        </div>

        {/* Graphiques de rapports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Performance des ventes</h3>
            <div className="h-64 bg-white border border-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Graphique des performances</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Tendances des produits</h3>
            <div className="h-64 bg-white border border-gray-200 rounded flex items-center justify-center">
              <p className="text-gray-500">Graphique des tendances</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
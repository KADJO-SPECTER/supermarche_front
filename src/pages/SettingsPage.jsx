const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-[#40514E] mb-6">Paramètres et Configurations</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation des paramètres */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-[#669B7C] bg-opacity-12 text-[#40514E] font-bold rounded-lg border-r-4 border-[#40514E]">
                Général
              </button>
              <button className="w-full text-left px-4 py-3 text-[#669B7C] hover:text-[#40514E] rounded-lg transition duration-200">
                Notifications
              </button>
              <button className="w-full text-left px-4 py-3 text-[#669B7C] hover:text-[#40514E] rounded-lg transition duration-200">
                Sécurité
              </button>
              <button className="w-full text-left px-4 py-3 text-[#669B7C] hover:text-[#40514E] rounded-lg transition duration-200">
                Intégrations
              </button>
              <button className="w-full text-left px-4 py-3 text-[#669B7C] hover:text-[#40514E] rounded-lg transition duration-200">
                Sauvegarde
              </button>
            </nav>
          </div>

          {/* Contenu des paramètres */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-4">Paramètres généraux</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
                    placeholder="ShopSync"
                    defaultValue="ShopSync"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Devise par défaut
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
                    <option>XOF - Franc CFA</option>
                    <option>EUR - Euro</option>
                    <option>USD - Dollar US</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuseau horaire
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
                    <option>Afrique/Abidjan (UTC+0)</option>
                    <option>Europe/Paris (UTC+1)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-[#40514E] text-white px-6 py-2 rounded-lg hover:bg-[#2F3E3C] transition duration-200">
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
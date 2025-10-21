import { MdSearch, MdNotifications, MdPerson } from 'react-icons/md'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto py-4 px-6 flex justify-between items-center">
        {/* Titre principal */}
        <div className='flex items-center'>
          <h4 className="text-xl font-bold text-[#40514E]">
            ShopSync 
          </h4>
          <h4 className="text-xl ml-5 font-bold text-[#6FCF97]">
            Panel d'administration 
          </h4>
        </div>

        {/* Section droite avec recherche, notifications et profil */}
        <div className="flex items-center space-x-6">
          {/* Barre de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] w-64 transition duration-200"
            />
          </div>

          {/* Icône de notifications */}
          <button className="relative p-2 text-gray-600 hover:text-[#40514E] transition duration-200">
            <MdNotifications className="h-6 w-6" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Profil utilisateur */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-[#40514E] rounded-full flex items-center justify-center">
              <MdPerson className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#40514E]">Claude G.</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
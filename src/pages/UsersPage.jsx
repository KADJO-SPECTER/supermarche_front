import { useState } from 'react'
import { MdEdit, MdDelete, MdAdd, MdPerson, MdSearch, MdEmail, MdPhone } from 'react-icons/md'
import AddUserModal from '../components/AddUserModal'

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // Données mock pour les utilisateurs
  const users = [
    {
      id: 1,
      nom: "Claude G.",
      email: "claude@shopsync.com",
      telephone: "+225 01 23 45 67 89",
      role: "Administrateur",
      dateInscription: "15/01/2024",
      statut: "Actif"
    },
    {
      id: 2,
      nom: "Marie Traoré",
      email: "marie@shopsync.com",
      telephone: "+225 07 89 12 34 56",
      role: "Gestionnaire",
      dateInscription: "20/02/2024",
      statut: "Actif"
    },
    {
      id: 3,
      nom: "Jean Koffi",
      email: "jean@shopsync.com",
      telephone: "+225 05 67 89 01 23",
      role: "Vendeur",
      dateInscription: "10/03/2024",
      statut: "Actif"
    },
    {
      id: 4,
      nom: "Alice Bamba",
      email: "alice@shopsync.com",
      telephone: "+225 01 98 76 54 32",
      role: "Vendeur",
      dateInscription: "05/01/2024",
      statut: "Inactif"
    },
    {
      id: 5,
      nom: "Pierre Gnahoué",
      email: "pierre@shopsync.com",
      telephone: "+225 03 21 43 65 87",
      role: "Gestionnaire",
      dateInscription: "12/02/2024",
      statut: "Actif"
    }
  ]

  const stats = [
    { title: "Utilisateurs totaux", value: "1,248", change: "+12%", positive: true },
    { title: "Utilisateurs actifs", value: "892", change: "+8%", positive: true },
    { title: "Nouveaux inscrits", value: "156", change: "+5%", positive: true },
    { title: "Taux d'activation", value: "94%", change: "+2%", positive: true }
  ]

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800'
      case 'Inactif': return 'bg-red-100 text-red-800'
      case 'En attente': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrateur': return 'bg-purple-100 text-purple-800'
      case 'Gestionnaire': return 'bg-blue-100 text-blue-800'
      case 'Vendeur': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOpenModal = (user = null) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleAddUser = (userData) => {
    if (editingUser) {
      // Logique de modification
      console.log('Modifier utilisateur:', userData)
      // Mettre à jour l'utilisateur dans la liste
    } else {
      // Logique d'ajout
      console.log('Nouvel utilisateur:', userData)
      // Ajouter l'utilisateur à la liste
    }
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#40514E]">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{backgroundColor: "#40514E", border: "none"}}
          className="text-white px-4 py-2 rounded-lg hover:bg-[#2F3E3C] transition duration-200 flex items-center"
        >
          <MdAdd className="mr-2" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                  <span className={`ml-2 text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#669B7C] bg-opacity-10 rounded-lg">
                <MdPerson className="text-[#40514E] text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
              <option>Tous les rôles</option>
              <option>Administrateur</option>
              <option>Gestionnaire</option>
              <option>Vendeur</option>
            </select>
            
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>Inactif</option>
              <option>En attente</option>
            </select>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#40514E] rounded-lg flex items-center justify-center text-white font-bold">
                        {user.nom.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <MdEmail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <MdPhone className="w-3 h-3 mr-1" />
                        {user.telephone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.dateInscription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.statut)}`}>
                      {user.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleOpenModal(user)}
                        className="text-[#40514E] hover:text-[#2F3E3C]"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">5</span> sur <span className="font-medium">1,248</span> utilisateurs
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 border border-[#40514E] bg-[#40514E] text-white rounded-md text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddUser={handleAddUser}
        initialData={editingUser}
      />
    </div>
  )
}

export default UsersPage
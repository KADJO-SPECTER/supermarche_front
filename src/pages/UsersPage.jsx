// pages/UsersPage.jsx
import { useState, useEffect } from 'react';
import { MdEdit, MdDelete, MdAdd, MdPerson, MdSearch, MdEmail, MdPhone, MdCheckCircle, MdCancel } from 'react-icons/md';
import AddUserModal from '../components/AddUserModal';
import { userService } from '../services/userService';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    activationRate: 0,
  });
  
  // Filtres
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Charger les utilisateurs et les rôles au montage
  useEffect(() => {
    loadUsers();
    loadAuthorities();
  }, [currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(currentPage, true);
      
      setUsers(response.results || []);
      setTotalCount(response.count || 0);
      setTotalPages(Math.ceil((response.count || 0) / 10)); // 10 items par page
      
      // Calculer les statistiques
      const allUsers = response.results || [];
      const activeUsers = allUsers.filter(u => u.is_active);
      const newUsers = allUsers.filter(u => {
        const createdDate = new Date(u.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      });
      
      setStats({
        total: allUsers.length,
        active: activeUsers.length,
        new: newUsers.length,
        activationRate: allUsers.length > 0 
          ? ((activeUsers.length / allUsers.length) * 100).toFixed(0)
          : 0,
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAuthorities = async () => {
    try {
      const response = await userService.getAvailableAuthorities();
      // console.log("les role",response)
      setAuthorities(response.results || response || []);
    } catch (err) {
      console.error('Erreur lors du chargement des rôles:', err);
    }
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleAddUser = async (userData) => {
    try {
      if (editingUser) {
        // Modifier un utilisateur existant
        await userService.updateUser(editingUser.id, userData);
      } else {
        // Créer un nouvel utilisateur
        await userService.createUser(userData);
      }
      
      handleCloseModal();
      loadUsers(); // Recharger la liste
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      alert('Erreur: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      loadUsers();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      if (user.is_active) {
        await userService.deactivateUser(user.id);
      } else {
        await userService.activateUser(user.id);
      }
      loadUsers();
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      alert('Erreur lors du changement de statut');
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.authority_names && user.authority_names.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || 
      (user.authority_names && user.authority_names.includes(roleFilter));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (roles) => {
    if (!roles) return 'bg-gray-100 text-gray-800';
    if (roles.includes('ADMIN')) return 'bg-purple-100 text-purple-800';
    if (roles.includes('MANAGER')) return 'bg-blue-100 text-blue-800';
    if (roles.includes('CASHIER')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Chargement des utilisateurs...</div>
      </div>
    );
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

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erreur: {error}
        </div>
      )}

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Utilisateurs totaux</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-semibold text-gray-900">{totalCount}</span>
              </div>
            </div>
            <div className="p-3 bg-[#669B7C] bg-opacity-10 rounded-lg">
              <MdPerson className="text-[#40514E] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Utilisateurs actifs</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-semibold text-gray-900">{stats.active}</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MdCheckCircle className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Nouveaux (30j)</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-semibold text-gray-900">{stats.new}</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdPerson className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Taux d'activation</h3>
              <div className="flex items-baseline mt-1">
                <span className="text-2xl font-semibold text-gray-900">{stats.activationRate}%</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <MdCheckCircle className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
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
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              {authorities.map((auth) => (
                <option key={auth.id} value={auth.name}>
                  {auth.name}
                </option>
              ))}
            </select>
            
            <select 
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôles
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-[#40514E] rounded-lg flex items-center justify-center text-white font-bold">
                          {getInitials(user.email)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MdEmail className="w-4 h-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.authority_names)}`}>
                        {user.authority_names || 'Aucun rôle'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${getStatusColor(user.is_active)}`}
                      >
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="text-[#40514E] hover:text-[#2F3E3C]"
                          title="Modifier"
                        >
                          <MdEdit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <MdDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">{filteredUsers.length}</span> sur <span className="font-medium">{totalCount}</span> utilisateurs
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === pageNum
                      ? 'border-[#40514E] bg-[#40514E] text-white'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'ajout/modification d'utilisateur */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddUser={handleAddUser}
        initialData={editingUser}
        authorities={authorities}
      />
    </div>
  );
};

export default UsersPage;

import { useState, useEffect } from 'react'
import Modal from './Modal'

const AddUserModal = ({ isOpen, onClose, onAddUser, initialData = null }) => {
  const [userData, setUserData] = useState({
    nom: '',
    email: '',
    telephone: '',
    role: 'Vendeur',
    statut: 'Actif'
  })

  useEffect(() => {
    if (initialData) {
      setUserData(initialData)
    } else {
      setUserData({
        nom: '',
        email: '',
        telephone: '',
        role: 'Vendeur',
        statut: 'Actif'
      })
    }
  }, [initialData, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddUser(userData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
      submitText={initialData ? "Modifier" : "Créer l'utilisateur"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom complet *
          </label>
          <input
            type="text"
            name="nom"
            value={userData.nom}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="Prénom Nom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="utilisateur@exemple.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={userData.telephone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="+225 00 00 00 00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <select
              name="role"
              value={userData.role}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            >
              <option value="Vendeur">Vendeur</option>
              <option value="Gestionnaire">Gestionnaire</option>
              <option value="Administrateur">Administrateur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut *
            </label>
            <select
              name="statut"
              value={userData.statut}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            >
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddUserModal
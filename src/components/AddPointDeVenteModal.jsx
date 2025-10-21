import { useState, useEffect } from 'react'
import Modal from './Modal'

const AddPointDeVenteModal = ({ isOpen, onClose, onAddPointDeVente, initialData = null }) => {
  const [pointDeVenteData, setPointDeVenteData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    responsable: '',
    statut: 'Actif'
  })

  // Réinitialiser les données quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPointDeVenteData(initialData)
      } else {
        setPointDeVenteData({
          nom: '',
          adresse: '',
          telephone: '',
          email: '',
          responsable: '',
          statut: 'Actif'
        })
      }
    }
  }, [isOpen, initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPointDeVenteData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddPointDeVente(pointDeVenteData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Modifier le point de vente" : "Nouveau Point de vente"}
      submitText={initialData ? "Modifier" : "Créer le point de vente"}
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du point de vente *
          </label>
          <input
            type="text"
            name="nom"
            value={pointDeVenteData.nom}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="Nom du magasin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse *
          </label>
          <input
            type="text"
            name="adresse"
            value={pointDeVenteData.adresse}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="Adresse complète"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone *
            </label>
            <input
              type="tel"
              name="telephone"
              value={pointDeVenteData.telephone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              placeholder="+225 00 00 00 00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={pointDeVenteData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              placeholder="email@exemple.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsable *
          </label>
          <input
            type="text"
            name="responsable"
            value={pointDeVenteData.responsable}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="Nom du responsable"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut *
          </label>
          <select
            name="statut"
            value={pointDeVenteData.statut}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
          >
            <option value="Actif">Actif</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}

export default AddPointDeVenteModal
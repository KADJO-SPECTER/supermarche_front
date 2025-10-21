import { useState, useEffect } from 'react'
import Modal from './Modal'

const AddProductModal = ({ isOpen, onClose, onAddProduct, initialData = null }) => {
  const [productData, setProductData] = useState({
    name: '',
    category: 'Électronique',
    price: '',
    stock: '',
    status: 'En stock'
  })

  // Réinitialiser les données quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setProductData(initialData)
      } else {
        setProductData({
          name: '',
          category: 'Électronique',
          price: '',
          stock: '',
          status: 'En stock'
        })
      }
    }
  }, [isOpen, initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProductData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddProduct(productData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Modifier le produit" : "Nouveau Produit"}
      submitText={initialData ? "Modifier" : "Créer le produit"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit *
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
            placeholder="Nom du produit"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
          >
            <option value="Électronique">Électronique</option>
            <option value="Épicerie">Épicerie</option>
            <option value="Meubles">Meubles</option>
            <option value="Mode">Mode</option>
            <option value="Cadence et jouets">Cadence et jouets</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix *
            </label>
            <input
              type="text"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              placeholder="0.00 XOF"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut *
          </label>
          <select
            name="status"
            value={productData.status}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
          >
            <option value="En stock">En stock</option>
            <option value="Stock limité">Stock limité</option>
            <option value="Rupture">Rupture</option>
          </select>
        </div>
      </div>
    </Modal>
  )
}

export default AddProductModal
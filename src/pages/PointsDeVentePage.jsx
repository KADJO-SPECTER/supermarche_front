import { useEffect, useState } from 'react'
import { MdEdit, MdDelete, MdAdd, MdLocationOn, MdPhone, MdEmail, MdStore, MdSearch } from 'react-icons/md'
import AddPointDeVenteModal from '../components/AddPointDeVenteModal'
import { storeService } from '../services/store'

const PointsDeVentePage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPointDeVente, setEditingPointDeVente] = useState(null)
  const [pointsDeVente, setPointsDeVente] = useState([])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: []
  })

  useEffect(() => {
    const loadPointsDeVenteData = async () => {
      try {
        const response = await storeService.getStores()
        setData(response)
        setPointsDeVente(response.results)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPointsDeVenteData()
  }, [])

  if (loading) {
    return <div className="p-6">Chargement...</div>
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce point de vente ?")) return
    try {
      await storeService.deleteStore(id)
      // Recharger les données après suppression
      const response = await storeService.getStores()
      setData(response)
      setPointsDeVente(response.results)
    } catch (error) {
      console.error("Erreur lors de la suppression : ", error)
      alert("Une erreur est survenue lors de la suppression")
    }
  }

   // Fonction pour calculer le chiffre d'affaires moyen
  const calculateAverageRevenue = () => {
    if (pointsDeVente.length === 0) return "0 XOF"
    
    const total = pointsDeVente.reduce((sum, point) => {
      const revenue = parseFloat(point.chiffre_affaire) || 0
      return sum + revenue
    }, 0)
    
    const average = total / pointsDeVente.length
    return formatCurrency(average)
  }

    // Fonction pour calculer la performance moyenne
  const calculateAveragePerformance = () => {
    if (pointsDeVente.length === 0) return "+0%"
    
    const total = pointsDeVente.reduce((sum, point) => {
      // Extraire le nombre de la chaîne de performance (ex: "+23%" -> 23)
      const performance = parseFloat(point.performance) || 0
      return sum + performance
    }, 0)
    
    const average = total / pointsDeVente.length
    return `${average >= 0 ? '+' : ''}${average.toFixed(1)}%`
  }

   // Fonction pour formater la devise
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M XOF`
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K XOF`
    }
    return `${amount.toFixed(0)} XOF`
  }


  // Calcul des statistiques basées sur les données réelles
  const stats = [
    { 
      title: "Total Points de vente", 
      value: data.count.toString(), 
      change: "+0", 
      positive: true 
    },
    { 
      title: "Points actifs", 
      value: pointsDeVente.filter(p => p.statut === 'Actif').length.toString(), 
      change: "+0", 
      positive: true 
    },
    { 
      title: "Chiffre d'affaires moyen", 
      value: calculateAverageRevenue(), 
      change: "+0%", 
      positive: true 
    },
    { 
      title: "Performance moyenne", 
      value: calculateAveragePerformance(), 
      change: "+0%", 
      positive: true 
    }
  ]

 

  const filteredPoints = pointsDeVente.filter(point =>
    point.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    point.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800'
      case 'En maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Fermé': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (performance) => {
    return performance.startsWith('+') ? 'text-green-600' : 'text-red-600'
  }

  const handleOpenModal = (pointDeVente = null) => {
    setEditingPointDeVente(pointDeVente)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPointDeVente(null)
  }

  const handleAddPointDeVente = (pointDeVenteData) => {
    if (editingPointDeVente) {
      // Logique de modification
      console.log('Modifier point de vente:', pointDeVenteData)
    } else {
      // Logique d'ajout
      console.log('Nouveau point de vente:', pointDeVenteData)
    }
    handleCloseModal()
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#40514E]">Points de vente</h1>
          <p className="text-gray-600">Gérez vos magasins et suivez leurs performances</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{backgroundColor: "#40514E", border: "none"}} 
          className="text-white px-4 py-2 rounded-lg hover:bg-[#2F3E3C] transition duration-200 flex items-center"
        >
          <MdAdd className="mr-2" />
          Nouveau Point de vente
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
                <MdStore className="text-[#40514E] text-xl" />
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
              placeholder="Rechercher un point de vente..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
              <option>Tous les statuts</option>
              <option>Actif</option>
              <option>En maintenance</option>
              <option>Fermé</option>
            </select>
            
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
              <option>Trier par performance</option>
              <option>Performance croissante</option>
              <option>Performance décroissante</option>
              <option>Chiffre d'affaires</option>
            </select>
          </div>
        </div>

        {/* Tableau des points de vente */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Point de vente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsable
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chiffre d'affaires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
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
              {filteredPoints.map((point) => (
                <tr key={point.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#40514E] rounded-lg flex items-center justify-center text-white">
                        <MdStore className="w-5 h-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{point.nom}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MdLocationOn className="w-3 h-3 mr-1" />
                          {point.adresse}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <MdPhone className="w-3 h-3 mr-1" />
                        {point.telephone}
                      </div>
                      <div className="flex items-center mt-1">
                        <MdEmail className="w-3 h-3 mr-1" />
                        {point.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {point.responsable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(parseFloat(point.chiffre_affaire))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={getPerformanceColor(point.performance)}>
                      {point.performance}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(point.statut)}`}>
                      {point.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleOpenModal(point)}
                        className="text-[#40514E] hover:text-[#2F3E3C]"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(point.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Carte de visualisation géographique */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Localisation des points de vente</h3>
          <div className="h-64 bg-white border border-gray-200 rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MdLocationOn className="w-12 h-12 mx-auto mb-2 text-[#40514E]" />
              <p>Carte des points de vente</p>
              <p className="text-sm">Intégration avec Google Maps ou OpenStreetMap</p>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{pointsDeVente.length}</span> sur <span className="font-medium">{data.count}</span> points de vente
          </div>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50"
              disabled={!data.previous}
            >
              Précédent
            </button>
            <button className="px-3 py-1 border border-[#40514E] bg-[#40514E] text-white rounded-md text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'ajout de point de vente */}
      <AddPointDeVenteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddPointDeVente={handleAddPointDeVente}
        initialData={editingPointDeVente}
      />
    </div>
  )
}

export default PointsDeVentePage
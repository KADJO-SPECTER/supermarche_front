import { useEffect, useState } from "react";
import { MdEdit, MdDelete, MdAdd, MdInventory, MdSearch } from "react-icons/md";
import AddProductModal from "../components/AddProductModal";
import { productService } from "../services/productService";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });

  useEffect(() => {
    const loadProductsData = async () => {
      try {
        const response = await productService.getProducts();
        setData(response);
        setProducts(response.results);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductsData();
  }, []);

  if (loading) {
    return <div className="p-6">Chargement...</div>;
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await productService.deleteProduct(id);
    } catch (error) {
      console.error("Erreur lors de la suppression : ", error);
      alert("Une erreur est survenue lors de la suppression");
    }
  };

  // Fonction pour formater le prix
  const formatPrice = (priceString) => {
    const number = parseFloat(priceString);
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Calcul des statistiques basées sur les données réelles
  const stats = [
    {
      title: "Total Produits",
      value: data.count.toString(),
      change: "+0%",
      positive: true,
    },
    {
      title: "Produits Actifs",
      value: products.filter((p) => p.is_active).length.toString(),
      change: "+0%",
      positive: true,
    },
    {
      title: "Stock Faible",
      value: products
        .filter((p) => p.quantity <= p.alert_threshold)
        .length.toString(),
      change: "+0%",
      positive: false,
    },
    {
      title: "Catégories",
      value: [
        ...new Set(products.map((p) => p.category_name)),
      ].length.toString(),
      change: "+0",
      positive: true,
    },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "En stock":
        return "bg-green-100 text-green-800";
      case "Stock limité":
        return "bg-yellow-100 text-yellow-800";
      case "Rupture":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (quantity, alertThreshold) => {
    if (quantity === 0) return "Rupture";
    if (quantity <= alertThreshold) return "Stock limité";
    return "En stock";
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleAddProduct = (productData) => {
    if (editingProduct) {
      // Logique de modification
      console.log("Modifier produit:", productData);
    } else {
      // Logique d'ajout
      console.log("Nouveau produit:", productData);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#40514E]">
            Gestion des Produits
          </h1>
          <p className="text-gray-600">
            Gérez votre inventaire et suivez les performances
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          style={{ backgroundColor: "#40514E", border: "none" }}
          className="text-white px-4 py-2 rounded-lg hover:bg-[#2F3E3C] transition duration-200 flex items-center"
        >
          <MdAdd className="mr-2" />
          Nouveau Produit
        </button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 text-sm font-medium">
                  {stat.title}
                </h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </span>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      stat.positive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#669B7C] bg-opacity-10 rounded-lg">
                <MdInventory className="text-[#40514E] text-xl" />
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
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
              <option>Toutes les catégories</option>
              {[...new Set(products.map((p) => p.category_name))].map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              )}
            </select>

            <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E]">
              <option>Tous les statuts</option>
              <option>En stock</option>
              <option>Stock limité</option>
              <option>Rupture</option>
            </select>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seuil d'alerte
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
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#40514E] rounded-lg flex items-center justify-center text-white font-bold">
                        {product.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.is_active ? "Actif" : "Inactif"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.supplier_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(product.unit_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.alert_threshold.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        getStockStatus(
                          product.quantity,
                          product.alert_threshold
                        )
                      )}`}
                    >
                      {getStockStatus(
                        product.quantity,
                        product.alert_threshold
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-[#40514E] hover:text-[#2F3E3C]"
                      >
                        <MdEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à{" "}
            <span className="font-medium">{products.length}</span> sur{" "}
            <span className="font-medium">{data.count}</span> produits
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

      {/* Modal d'ajout de produit */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddProduct={handleAddProduct}
        initialData={editingProduct}
      />
    </div>
  );
};

export default ProductsPage;

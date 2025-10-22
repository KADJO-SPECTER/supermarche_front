import { useState, useEffect } from "react";
import Modal from "./Modal";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { supplierService } from "../services/supplierService";

const AddProductModal = ({
  isOpen,
  onClose,
  onAddProduct,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    supplier: "",
    unit_price: "",
    quantity: "",
    alert_threshold: "",
    is_active: true,
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Réinitialiser les données quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      setError(""); // Reset errors when modal opens

      if (initialData) {
        // Pour l'édition, utiliser les données existantes
        setFormData({
          name: initialData.name || "",
          category: initialData.category || "",
          supplier: initialData.supplier || "",
          unit_price: initialData.unit_price || "",
          quantity: initialData.quantity?.toString() || "",
          alert_threshold: initialData.alert_threshold?.toString() || "",
          is_active:
            initialData.is_active !== undefined ? initialData.is_active : true,
        });
      } else {
        // Pour la création, initialiser avec des valeurs par défaut
        setFormData({
          name: "",
          category: "",
          supplier: "",
          unit_price: "",
          quantity: "",
          alert_threshold: "",
          is_active: true,
        });
      }

      // Charger les options si elles ne sont pas déjà chargées
      if (categories.length === 0 || suppliers.length === 0) {
        loadOptions();
      }
    }
  }, [isOpen, initialData, categories.length, suppliers.length]);

  // Charger les catégories et fournisseurs disponibles
  const loadOptions = async () => {
    setLoading(true);
    try {
      const [categoriesResponse, suppliersResponse] = await Promise.all([
        categoryService.getCategories(),
        supplierService.getSuppliers(),
      ]);

      console.log("Catégories récupérées :", categoriesResponse.results);
      console.log("Fournisseurs récupérés :", suppliersResponse.results);

      // Extraction correcte selon ta structure
      setCategories(categoriesResponse.results || []);
      setSuppliers(suppliersResponse.results || []);
    } catch (error) {
      console.error("Erreur lors du chargement des options:", error);
      setError("Erreur lors du chargement des catégories ou des fournisseurs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validation basique
    if (
      !formData.name ||
      !formData.category ||
      !formData.supplier ||
      !formData.unit_price ||
      !formData.quantity ||
      !formData.alert_threshold
    ) {
      setError("Veuillez remplir tous les champs obligatoires");
      setSubmitting(false);
      return;
    }

    try {
      // Préparer les données pour l'API
      const productData = {
        name: formData.name,
        category: parseInt(formData.category),
        supplier: parseInt(formData.supplier),
        unit_price: formData.unit_price,
        quantity: parseInt(formData.quantity),
        alert_threshold: parseInt(formData.alert_threshold),
        is_active: formData.is_active,
      };

      let response;
      if (initialData) {
        // Modification d'un produit existant
        response = await productService.updateProduct(
          initialData.id,
          productData
        );
      } else {
        // Création d'un nouveau produit
        response = await productService.createProduct(productData);
      }

      // Appeler la callback du parent
      onAddProduct(response.data);
      onClose();
    } catch (error) {
      console.error("Erreur détaillée:", error);

      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        setError(
          `Erreur serveur: ${error.response.status} - ${
            error.response.data?.message || "Endpoint non trouvé"
          }`
        );
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        setError(
          "Impossible de contacter le serveur. Vérifiez votre connexion."
        );
      } else {
        // Quelque chose s'est mal passé lors de la configuration de la requête
        setError(`Erreur: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  console.log("cate", categories);
  console.log("supplier", suppliers);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Modifier le produit" : "Nouveau Produit"}
      submitText={
        submitting ? "Envoi..." : initialData ? "Modifier" : "Créer le produit"
      }
      disabled={submitting}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
            placeholder="Nom du produit"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={submitting || loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
            >
              <option value="">
                {loading
                  ? "Chargement des catégories..."
                  : "Sélectionnez une catégorie"}
              </option>
              {!loading &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur *
            </label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              required
              disabled={submitting || loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
            >
              <option value="">
                {loading
                  ? "Chargement des fournisseurs..."
                  : "Sélectionnez un fournisseur"}
              </option>
              {!loading &&
                suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix unitaire (XOF) *
          </label>
          <input
            type="text"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité en stock *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="0"
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seuil d'alerte *
            </label>
            <input
              type="number"
              name="alert_threshold"
              value={formData.alert_threshold}
              onChange={handleInputChange}
              required
              min="0"
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            id="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            disabled={submitting}
            className="h-4 w-4 text-[#40514E] focus:ring-[#40514E] border-gray-300 rounded disabled:bg-gray-100"
          />
          <label
            htmlFor="is_active"
            className="ml-2 block text-sm text-gray-700"
          >
            Produit actif
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default AddProductModal;

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { storeService } from "../services/store";


const AddPointDeVenteModal = ({
  isOpen,
  onClose,
  onAddPointDeVente,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    responsable: "",
    statut: "Actif",
  });


  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Réinitialiser les champs quand le modal s'ouvre ou reçoit des données
  useEffect(() => {
    if (isOpen) {
      setError("");

      if (initialData) {
        setFormData({
          nom: initialData.nom || "",
          adresse: initialData.adresse || "",
          telephone: initialData.telephone || "",
          email: initialData.email || "",
          responsable: initialData.responsable || "",
          statut: initialData.statut || "Actif",
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFormData({
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      responsable: "",
      statut: "Actif",
    });
  };

  // Gérer les changements de champ
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Soumettre les données
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validation basique
    if (
      !formData.nom ||
      !formData.adresse ||
      !formData.telephone ||
      !formData.email ||
      !formData.responsable
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setSubmitting(false);
      return;
    }

    try {
      let response;

      if (initialData) {
        // 🔄 Mise à jour d’un point de vente existant
        response = await storeService.updateStore(initialData.id, formData);
      } else {
        // 🆕 Création d’un nouveau point de vente
        response = await storeService.createStore(formData);
      }

      // Appeler le callback du parent pour rafraîchir la liste
      onAddPointDeVente(response);
      onClose();
    } catch (err) {
      console.error("Erreur API :", err);

      if (err.response) {
        setError(
          `Erreur ${err.response.status} : ${
            err.response.data?.message || "Une erreur est survenue"
          }`
        );
      } else if (err.request) {
        setError("Aucune réponse du serveur. Vérifiez votre connexion.");
      } else {
        setError(`Erreur : ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={initialData ? "Modifier le point de vente" : "Nouveau Point de vente"}
      submitText={
        submitting ? "Envoi..." : initialData ? "Modifier" : "Créer le point de vente"
      }
      disabled={submitting}
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du point de vente *
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
            disabled={submitting}
            placeholder="Nom du magasin"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse *
          </label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleInputChange}
            required
            disabled={submitting}
            placeholder="Adresse complète"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
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
              value={formData.telephone}
              onChange={handleInputChange}
              required
              disabled={submitting}
              placeholder="+225 00 00 00 00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={submitting}
              placeholder="email@exemple.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
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
            value={formData.responsable}
            onChange={handleInputChange}
            required
            disabled={submitting}
            placeholder="Nom du responsable"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut *
          </label>
          <select
            name="statut"
            value={formData.statut}
            onChange={handleInputChange}
            required
            disabled={submitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] disabled:bg-gray-100"
          >
            <option value="Actif">Actif</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Fermé">Fermé</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default AddPointDeVenteModal;

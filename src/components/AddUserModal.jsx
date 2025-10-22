// components/AddUserModal.jsx
import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

const AddUserModal = ({ isOpen, onClose, onAddUser, initialData, authorities }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    authority_ids: [],
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        password: '',
        password_confirm: '',
        authority_ids: initialData.authorities?.map(a => a.authority) || [],
        is_active: initialData.is_active ?? true,
      });
    } else {
      setFormData({
        email: '',
        password: '',
        password_confirm: '',
        authority_ids: [],
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!initialData && formData.password !== formData.password_confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const submitData = { ...formData };
    
    // Si c'est une modification et qu'il n'y a pas de nouveau mot de passe
    if (initialData && !formData.password) {
      delete submitData.password;
      delete submitData.password_confirm;
    }

    onAddUser(submitData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleToggle = (authorityId) => {
    setFormData(prev => {
      const newAuthorityIds = prev.authority_ids.includes(authorityId)
        ? prev.authority_ids.filter(id => id !== authorityId)
        : [...prev.authority_ids, authorityId];
      
      return {
        ...prev,
        authority_ids: newAuthorityIds,
      };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* En-tête */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-[#40514E]">
            {initialData ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] transition-all"
              placeholder="utilisateur@example.com"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe {!initialData && '*'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!initialData}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] transition-all"
              placeholder={initialData ? 'Laisser vide pour ne pas changer' : 'Mot de passe'}
            />
          </div>

          {/* Confirmation mot de passe */}
          {!initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40514E] focus:border-[#40514E] transition-all"
                placeholder="Confirmer le mot de passe"
              />
            </div>
          )}

          {/* Rôles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôles
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {authorities.map((authority) => (
                <label key={authority.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.authority_ids.includes(authority.id)}
                    onChange={() => handleRoleToggle(authority.id)}
                    className="rounded text-[#40514E] focus:ring-[#40514E]"
                  />
                  <span className="text-sm text-gray-700">
                    {authority.name} {authority.description && `- ${authority.description}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="rounded text-[#40514E] focus:ring-[#40514E]"
            />
            <label className="text-sm font-medium text-gray-700">
              Compte actif
            </label>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{backgroundColor: "#40514E"}}
              className="px-4 py-2 text-white rounded-lg hover:bg-[#2F3E3C] transition-colors"
            >
              {initialData ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

import { MdClose } from 'react-icons/md'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitText = "Créer",
  cancelText = "Annuler",
  size = "md"
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        {/* En-tête du modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-xl font-bold text-[#40514E]">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu du modal */}
        <form onSubmit={onSubmit} className="p-6">
          {children}
          
          {/* Pied du modal */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              style={{backgroundColor: "#40514E", border: "none"}}
              className="px-4 py-2 text-white rounded-lg hover:bg-[#2F3E3C] transition duration-200"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
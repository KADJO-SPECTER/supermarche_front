import { useState } from 'react'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Ici, vous ajouterez votre logique d'authentification
    onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6FCF97] py-12 px-4 sm:px-6 lg:px-8 w-screen">
      <div className="max-w-md w-full">
        {/* Carte principale */}
        <div className="bg-white  p-8 space-y-8">
          {/* En-tête */}
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-[#40514E]">
              ShopSync
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous à votre compte administrateur
            </p>
          </div>

          {/* Formulaire */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 border-none py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                className="group relative w-full bg-[#40514E] flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-whit focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40514E] transition duration-200"
              >
                Se connecter
              </button>
            </div>
          </form>

          {/* Pied de page */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2025 ShopSync. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
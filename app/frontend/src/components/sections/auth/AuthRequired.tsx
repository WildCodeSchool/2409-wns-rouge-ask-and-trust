/**
 * @fileoverview Authentication required component that displays when a user needs to be authenticated
 * @module AuthRequired
 */

import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"
import { Lock } from "lucide-react"

/**
 * AuthRequired Component
 * 
 * Displays a message when authentication is required to access a page.
 * Provides buttons for login and registration, and a link to return to the home page.
 * 
 * @component
 * @returns {JSX.Element} The rendered AuthRequired component
 */
export default function AuthRequired() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="bg-primary-50 rounded-full p-4">
            <Lock className="h-12 w-12 text-primary-600" />
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Authentification requise
        </h1>
        
        <p className="mb-6 text-gray-600">
          Vous devez être connecté pour accéder à cette page. Veuillez vous connecter ou créer un compte pour continuer.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button
            to="/connexion"
            variant="primary"
            fullWidth
            ariaLabel="Se connecter"
          >
            Se connecter
          </Button>
          
          <Button
            to="/register"
            variant="outline"
            fullWidth
            ariaLabel="S'inscrire"
          >
            S'inscrire
          </Button>
          
          <Link
            to="/"
            className="mt-2 text-sm text-gray-500 hover:text-primary-600 hover:underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
} 
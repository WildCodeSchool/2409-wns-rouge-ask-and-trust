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
						<Lock className="text-primary-600 h-12 w-12" />
					</div>
				</div>

				<h1 className="text-black-default mb-2 text-2xl font-bold">
					Authentification requise
				</h1>

				<p className="text-black-default mb-6">
					Vous devez être connecté pour accéder à cette page. Veuillez
					vous connecter ou créer un compte pour continuer.
				</p>

				<nav className="flex flex-col gap-3">
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
						className="hover:text-primary-600 text-black-default mt-2 text-sm hover:underline"
					>
						Retour à l'accueil
					</Link>
				</nav>
			</div>
		</div>
	)
}

import { Button } from "@/components/ui/Button"
import { Shield, ArrowLeft } from "lucide-react"

export default function PasswordReset() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Shield className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Réinitialisation de mot de passe
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Utilisez vos codes de récupération pour réinitialiser
						votre mot de passe en toute sécurité
					</p>
				</div>

				<div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
					<div className="text-center">
						<Shield className="mx-auto mb-3 h-8 w-8 text-blue-600" />
						<h3 className="mb-2 text-lg font-semibold text-blue-900">
							Codes de Récupération
						</h3>
						<p className="mb-4 text-blue-700">
							Pour des raisons de sécurité, nous utilisons
							maintenant des codes de récupération au lieu
							d'emails pour réinitialiser les mots de passe.
						</p>
						<p className="mb-4 text-sm text-blue-600">
							Ces codes sont générés dans votre profil utilisateur
							et peuvent être utilisés une seule fois chacun.
						</p>
					</div>
				</div>

				<div className="space-y-4">
					<Button
						to="/code-de-recuperation"
						variant="primary"
						fullWidth
						role="link"
						ariaLabel="Utiliser un code de récupération"
					>
						Utiliser un code de récupération
					</Button>

					<div className="space-y-2 text-center">
						<p className="text-sm text-gray-600">
							Vous n'avez pas de codes de récupération ?
						</p>
						<Button
							to="/connexion"
							variant="transparent"
							role="link"
							ariaLabel="Retour à la connexion"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Retour à la connexion
						</Button>
						<p className="mt-2 text-xs text-gray-500">
							Vous pourrez générer des codes dans votre profil
							après connexion
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

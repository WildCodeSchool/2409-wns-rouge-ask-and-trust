import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/useToast"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "@/hooks/useAuthContext"
import { AuthButtonsProps } from "@/types/types"

export default function AuthButtons({
	isHorizontalCompact = false,
	isInHeader,
	isInFooter,
}: AuthButtonsProps) {
	const { user, logout } = useAuthContext()
	const navigate = useNavigate()
	const location = useLocation()
	const { showToast } = useToast()

	const pathname = location.pathname
	const isOnLanding = pathname === "/"
	const isOnSurveys = pathname === "/surveys"
	const isOnProfile = pathname === "/profil"
	const isOnAdmin = pathname === "/admin"
	const shouldHideButtonsInHeader =
		isHorizontalCompact && isOnSurveys && isInHeader

	const onSignOut = async () => {
		await logout()
		navigate("/surveys")
		showToast({
			type: "success",
			title: "Déconnexion réussie !",
			description: "À bientôt sur Ask&Trust !",
		})
	}

	if (shouldHideButtonsInHeader) {
		return null
	}

	if (!user) {
		// === CAS NON CONNECTÉ ===

		// === CAS SPÉCIFIQUE : Landing Page ===
		if (isOnLanding) {
			// Footer → uniquement bouton connexion
			if (!isInHeader) {
				return (
					<Button
						to="/connexion"
						variant="primary"
						role="link"
						ariaLabel="Se connecter"
					>
						Se connecter
					</Button>
				)
			}

			// Header → bouton inscription + connexion
			return (
				<div className="flex w-full flex-col items-center justify-center gap-5">
					<Button
						to="/register"
						variant="secondary"
						role="link"
						fullWidth
						ariaLabel="S'inscrire"
					>
						S'inscrire
					</Button>
					<Button
						to="/connexion"
						variant="primary"
						role="link"
						fullWidth
						ariaLabel="Se connecter"
					>
						Se connecter
					</Button>
				</div>
			)
		}

		// === CAS GÉNÉRAL POUR TOUTES LES AUTRES PAGES (y compris /surveys) ===

		// Footer → uniquement le bouton connexion
		if (isInFooter) {
			return (
				<Button
					to="/connexion"
					variant="transparent"
					role="link"
					ariaLabel="Se connecter"
				>
					Se connecter
				</Button>
			)
		}

		// Header → bouton "Créer une enquête" + "Connexion"
		return (
			<div className="flex items-center justify-center gap-6">
				<Button
					to="/surveys/create"
					variant="tertiary"
					role="link"
					ariaLabel="Créer une enquête"
					className="max-sm:hidden"
				>
					Créer une enquête
				</Button>
				<Button
					to="/connexion"
					variant="transparent"
					role="link"
					ariaLabel="Se connecter"
				>
					Se connecter
				</Button>
			</div>
		)
	}

	// === CAS CONNECTÉ ===

	// Pages "profil" ou "admin" → bouton de déconnexion
	if (isOnProfile || isOnAdmin) {
		return (
			<Button
				variant="destructive"
				ariaLabel="Se déconnecter d'Ask&Trust"
				onClick={onSignOut}
			>
				Se déconnecter
			</Button>
		)
	}

	// Bouton "secondaire" selon le rôle
	const secondaryButton =
		user?.role === "admin" ? (
			<Button
				to="/admin"
				variant="transparent"
				role="link"
				ariaLabel="Accéder au panel admin"
			>
				Admin
			</Button>
		) : (
			<Button
				to="/profil"
				variant="transparent"
				role="link"
				ariaLabel="Accéder à sa page profil utilisateur"
			>
				Profil
			</Button>
		)

	// Footer : 1 seul bouton (le secondaire)
	if (isInFooter) {
		return (
			<div className="flex items-center justify-center">
				{secondaryButton}
			</div>
		)
	}

	// Sinon (header), 2 boutons
	return (
		<div className="flex items-center justify-center gap-6">
			<Button
				to="/surveys/create"
				variant="tertiary"
				role="link"
				ariaLabel="Créer une enquête"
				className="max-sm:hidden"
			>
				Créer une enquête
			</Button>
			{secondaryButton}
		</div>
	)
}

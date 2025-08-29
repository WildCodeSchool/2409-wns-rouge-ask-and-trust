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
		// === CASE: NOT LOGGED IN ===

		// === SPECIFIC CASE: Landing Page ===
		if (isOnLanding) {
			// Footer → only login button
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

			// Header → register + login buttons
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

		// === GENERAL CASE: All other pages (including /surveys) ===

		// Footer → only login button
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

		// Header → "Create a survey" + "Login" buttons
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

	// === CASE: LOGGED IN ===

	// "Secondary" button depends on the page and role
	const secondaryButton =
		isOnProfile || isOnAdmin ? (
			<Button
				variant="destructive"
				ariaLabel="Se déconnecter d'Ask&Trust"
				onClick={onSignOut}
			>
				Se déconnecter
			</Button>
		) : user?.role === "admin" ? (
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

	// Footer: only 1 button (the secondary one)
	if (isInFooter) {
		return (
			<div className="flex items-center justify-center">
				{secondaryButton}
			</div>
		)
	}

	// Otherwise (header): 2 buttons
	return (
		<div className="flex items-center justify-center gap-6">
			<Button
				to="/surveys/create"
				variant="tertiary"
				role="link"
				ariaLabel="Créer une enquête"
				className="max-lg:hidden"
			>
				Créer une enquête
			</Button>
			{secondaryButton}
		</div>
	)
}

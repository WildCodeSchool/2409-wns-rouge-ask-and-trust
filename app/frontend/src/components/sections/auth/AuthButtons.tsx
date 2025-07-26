import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/useToast"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "@/hooks/useAuthContext"
import { cn } from "@/lib/utils"
import { AuthButtonsProps } from "@/types/types"

export default function AuthButtons({
	isHorizontalCompact = false,
}: AuthButtonsProps) {
	const { user, logout } = useAuthContext()
	const navigate = useNavigate()
	const location = useLocation()
	const { showToast } = useToast()

	const onSignOut = async () => {
		await logout()
		navigate("/surveys")
		showToast({
			type: "success",
			title: "Déconnexion réussie !",
			description: "À bientôt sur Ask&Trust !",
		})
	}

	const isOnAdmin = location.pathname === "/admin"
	const isOnProfile = location.pathname === "/profil"
	const isOnSurveys = location.pathname === "/surveys"
	const isOnSurveyDetails =
		location.pathname.startsWith("/surveys") &&
		location.pathname !== "/surveys"

	if (user) {
		if (user.role === "admin") {
			if (isOnAdmin) {
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

			if (!isHorizontalCompact || isOnSurveyDetails) {
				return (
					<div className="flex items-center justify-center gap-6">
						<Button
							to="/surveys/create"
							variant="tertiary"
							role="link"
							ariaLabel="Créer une enquête"
						>
							Créer une enquête
						</Button>
						<Button
							to="/admin"
							variant="transparent"
							role="link"
							ariaLabel="Accéder au panel admin"
						>
							Admin
						</Button>
					</div>
				)
			}

			return null
		}

		if (isOnProfile) {
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

		if (!isHorizontalCompact) {
			return (
				<div className="flex items-center justify-center gap-6">
					<Button
						to="/surveys/create"
						variant="tertiary"
						role="link"
						ariaLabel="Créer une enquête"
					>
						Créer une enquête
					</Button>
					<Button
						to="/profil"
						variant="transparent"
						role="link"
						ariaLabel="Accéder à sa page profil utilisateur"
					>
						Profil
					</Button>
				</div>
			)
		}

		return null
	}

	if (isOnSurveys) {
		return (
			<div className="flex items-center justify-center gap-6">
				<Button
					to="/surveys/create"
					variant="tertiary"
					role="link"
					ariaLabel="Créer une enquête"
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

	return (
		<div
			className={cn(
				"flex items-center justify-center gap-6",
				isHorizontalCompact && "w-full flex-col gap-5"
			)}
		>
			<Button
				to="/connexion"
				variant="primary"
				role="link"
				fullWidth={isHorizontalCompact}
				ariaLabel="Se connecter"
			>
				Se connecter
			</Button>
		</div>
	)
}

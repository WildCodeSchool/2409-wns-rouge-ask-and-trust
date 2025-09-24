import { Button } from "@/components/ui/Button"
import { useSurveyMutations } from "@/hooks/survey/useSurveyMutations"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { AuthButtonsProps } from "@/types/types"
import { PlusCircle } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"

export default function AuthButtons({
	isHorizontalCompact = false,
	isInHeader,
	isInFooter,
}: AuthButtonsProps) {
	const { user, logout } = useAuthContext()
	const {
		createSurvey,
		createSurveyError,
		isCreatingSurvey,
		resetCreateSurveyError,
	} = useSurveyMutations()
	const navigate = useNavigate()
	const location = useLocation()
	const { showToast } = useToast()

	useToastOnChange({
		trigger: createSurveyError,
		resetTrigger: resetCreateSurveyError,
		type: "error",
		title: "Erreur pour créer l'enquête",
		description: "Nous n'avons pas réussi à créer l'enquête",
	})

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

	const onCreateSurveyAndNavigate = async () => {
		try {
			const newSurvey = await createSurvey({
				title: "Nouvelle enquête",
				description: "",
				public: false,
				category: "",
			})

			if (!newSurvey?.id) {
				throw new Error(
					"Impossible de récupérer l'ID de la nouvelle enquête"
				)
			}

			navigate(`/surveys/build/${newSurvey.id}`)
		} catch (error) {
			console.error(error)
			showToast({
				type: "error",
				title: "Erreur",
				description: "La création de l'enquête a échoué",
			})
		}
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
					onClick={onCreateSurveyAndNavigate}
					variant="tertiary"
					role="button"
					ariaLabel="Créer une enquête"
					className="max-sm:hidden"
				>
					S'inscrire
				</Button>
				<Button
					to="/connexion"
					variant="transparent"
					role="link"
					ariaLabel="Se connecter"
					className="max-lg:hidden"
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
				onClick={onCreateSurveyAndNavigate}
				icon={PlusCircle}
				loadingSpinner={isCreatingSurvey}
				variant="tertiary"
				role="button"
				ariaLabel="Créer une enquête"
				className="max-lg:hidden"
			>
				Créer une enquête
			</Button>
			{secondaryButton}
		</div>
	)
}

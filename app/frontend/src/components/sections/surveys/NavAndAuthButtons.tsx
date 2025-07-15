import { WHOAMI, LOGOUT } from "@/graphql/auth"
import SearchForm from "./SearchForm"
import { Button } from "@/components/ui/Button"
import { useMutation } from "@apollo/client"
import { useToast } from "@/hooks/useToast"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "@/hooks/useAuthContext"

export default function NavAndAuthButtons({
	isHorizontalCompact,
}: {
	isHorizontalCompact: boolean
}) {
	const { user } = useAuthContext()
	const navigate = useNavigate()
	const location = useLocation()
	const { showToast } = useToast()

	const [doSignOut] = useMutation(LOGOUT, { refetchQueries: [WHOAMI] })

	const onSignOut = () => {
		doSignOut()
		navigate("/")
		showToast({
			type: "success",
			title: "Déconnexion réussie !",
			description: "A bientôt sur Ask&Trust !",
		})
	}

	return (
		<nav
			className="flex w-full flex-1 items-center justify-center gap-6"
			role="navigation"
		>
			<SearchForm />
			{!isHorizontalCompact &&
				(user ? (
					user.role === "admin" ? (
						location.pathname === "/admin" ? (
							<Button
								variant="transparent"
								ariaLabel="Se déconnecter d'Ask&Trust"
								onClick={onSignOut}
							>
								Se déconnecter
							</Button>
						) : (
							<>
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
							</>
						)
					) : location.pathname === "/profil" ? (
						<Button
							variant="transparent"
							ariaLabel="Se déconnecter d'Ask&Trust"
							onClick={onSignOut}
						>
							Se déconnecter
						</Button>
					) : (
						<>
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
						</>
					)
				) : (
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
				))}
		</nav>
	)
}

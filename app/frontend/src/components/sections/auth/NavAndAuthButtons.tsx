import { WHOAMI, LOGOUT } from "@/graphql/auth"
import SearchForm from "../surveys/SearchForm"
import { Button } from "@/components/ui/Button"
import { useMutation } from "@apollo/client"
import { useToast } from "@/hooks/useToast"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuthContext } from "@/hooks/useAuthContext"
import { NavAndAuthButtonsProps } from "@/types/types"
import { cn } from "@/lib/utils"
import Links from "@/components/ui/Links"

export default function NavAndAuthButtons({
	links,
	isHorizontalCompact,
	isInSurveys,
}: NavAndAuthButtonsProps) {
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
			className={cn(
				"flex w-full flex-1 items-center justify-between gap-12",
				!isInSurveys && "justify-end"
			)}
			role="navigation"
			aria-label="Navigation du site"
		>
			{links && (
				<div className="flex flex-1 items-center justify-center gap-12">
					<ul className="flex items-center justify-center gap-12">
						{links.map(link => (
							<li
								className="list-none transition-transform hover:scale-105"
								key={link.href}
								role="link"
							>
								<Links {...link} />
							</li>
						))}
					</ul>
				</div>
			)}
			{isInSurveys && <SearchForm />}
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
				) : location.pathname === "/surveys" ? (
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
				) : (
					<div className="flex items-center justify-center gap-6">
						<Button
							to="/register"
							variant="tertiary"
							role="link"
							ariaLabel="S'inscrire"
						>
							S'inscrire
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

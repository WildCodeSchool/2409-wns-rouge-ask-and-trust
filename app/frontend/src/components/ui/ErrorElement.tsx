import {
	useRouteError,
	isRouteErrorResponse,
	useNavigate,
} from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { ErrorLayoutProps } from "@/types/types"

/**
 * Error messages
 * @type {Object}
 */
const errorMessages = {
	400: {
		title: "Requête incorrecte",
		message: "La requête envoyée au serveur n'est pas valide.",
		image: "/img/errors/undraw_cancel_7zdh.svg",
	},
	401: {
		title: "Non autorisé",
		message: "Vous devez être connecté pour accéder à cette ressource.",
		image: "/img/errors/undraw_access-denied_krem.svg",
	},
	403: {
		title: "Accès refusé",
		message:
			"Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
		image: "/img/errors/undraw_access-denied_krem.svg",
	},
	500: {
		title: "Erreur serveur",
		message:
			"Une erreur est survenue sur nos serveurs. Nos équipes ont été notifiées.",
		image: "/img/errors/undraw_server-down_lxs9.svg",
	},
	default: {
		title: "Erreur inattendue",
		message:
			"Une erreur inattendue s'est produite. Veuillez réessayer plus tard.",
		image: "/img/errors/undraw_fixing-bugs_13mt.svg",
	},
}

/**
 * Error element
 * @returns {JSX.Element}
 */
export default function ErrorElement() {
	const error = useRouteError()

	const getErrorContent = (status?: number) => {
		return (
			errorMessages[status as keyof typeof errorMessages] ||
			errorMessages.default
		)
	}

	// Check if the error is a Response
	if (error instanceof Response) {
		const errorContent = getErrorContent(error.status)

		return (
			<ErrorLayout>
				<img
					src={errorContent.image}
					alt={`Illustration erreur ${error.status}`}
					className="mx-auto mb-6 h-64 w-64"
					role="image"
				/>
				<h1 className="text-destructive-medium mb-2 text-4xl font-bold">
					{error.status} - {errorContent.title}
				</h1>
				<p className="text-black-default mb-6">
					{errorContent.message}
				</p>
				<ButtonGroup />
			</ErrorLayout>
		)
	}

	// Standard route error handling
	if (isRouteErrorResponse(error)) {
		const errorContent = getErrorContent(error.status)

		return (
			<ErrorLayout>
				<img
					src={errorContent.image}
					alt={`Illustration erreur ${error.status}`}
					className="mx-auto mb-6 h-40 w-40 sm:h-64 sm:w-64"
				/>
				<h1 className="text-destructive-medium mb-2 text-2xl font-bold sm:text-4xl">
					{error.status} - {errorContent.title}
				</h1>
				<h2 className="text-destructive-medium mb-4 text-lg font-semibold sm:text-xl">
					{error.statusText}
				</h2>
				<p className="text-black-default mb-6 text-sm sm:text-base">
					{error.data?.message || errorContent.message}
				</p>
				<ButtonGroup />
			</ErrorLayout>
		)
	}

	// Generic error handling
	const errorContent = getErrorContent()

	return (
		<ErrorLayout>
			<img
				src={errorContent.image}
				alt="Illustration erreur générique"
				className="mx-auto mb-6 h-40 w-40 sm:h-64 sm:w-64"
				role="image"
			/>
			<h1 className="text-destructive-medium mb-4 text-2xl font-bold sm:text-4xl">
				{errorContent.title}
			</h1>
			<p className="text-black-default mb-6 text-sm sm:text-base">
				{errorContent.message}
			</p>
			<ButtonGroup />
		</ErrorLayout>
	)
}

/**
 * Button group for the error element
 * @returns {JSX.Element}
 */
const ButtonGroup = () => {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<nav
				className="flex flex-col gap-4 sm:flex-row sm:justify-center"
				role="navigation"
				aria-label="Navigation de récupération"
			>
				<Button
					onClick={() => navigate("/")}
					ariaLabel="Retourner à la page d'accueil"
					size="lg"
					className="w-full sm:w-auto"
				>
					Retour à l'accueil
				</Button>
				<Button
					onClick={() => navigate(-1)}
					ariaLabel="Retourner à la page précédente"
					size="lg"
					className="w-full sm:w-auto"
				>
					Page précédente
				</Button>
			</nav>
		</div>
	)
}

/**
 * Layout for the error element
 * @param {ErrorLayoutProps} param0 - Children
 * @returns {JSX.Element}
 */
const ErrorLayout = ({ children }: ErrorLayoutProps) => (
	<div className="bg-bg relative flex min-h-screen items-center justify-center p-4">
		<div
			className="w-full max-w-lg p-4 text-center"
			role="alert"
			aria-live="polite"
		>
			{children}
		</div>
	</div>
)

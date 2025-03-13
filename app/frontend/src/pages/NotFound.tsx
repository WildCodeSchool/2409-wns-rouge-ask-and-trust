import { useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet";

export default function NotFound() {
	const navigate = useNavigate()

	useEffect(() => {
		const automaticRedirect = setInterval(() => {
			navigate("/", { replace: true })
		}, 5000)

		return () => clearInterval(automaticRedirect)
	}, [navigate])

	const handleReturnHome = () => {
		navigate("/", { replace: true })
	}

	return (
		<>
			{/* Update of the metadata */}
			<Helmet>
				<title>404 - Page non trouvée | Nom de votre site</title>
				<meta
					name="description"
					content="La page que vous recherchez n'existe pas ou a été déplacée."
				/>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>

			<main
				role="main"
				className="bg--color-bg relative flex min-h-screen items-center justify-center"
			>
				<div className="p-8 text-center">
					<img
						src="/img/errors/undraw_page-not-found_6wni.svg"
						alt="Illustration page non trouvée"
						className="mx-auto mb-8 h-auto w-96"
						role="presentation"
					/>
					<h1 className="mb-4 text-xl sm:text-3xl">
						<span className="font-bold">Erreur</span> 404 : Page non
						trouvée
					</h1>
					<p
						className="text-l mx-auto mb-4 max-w-md sm:text-lg"
						aria-live="polite"
					>
						Retour à la page d'accueil automatique dans 5 secondes
					</p>
					<Button
						onClick={handleReturnHome}
						ariaLabel="Retourner à la page d'accueil"
						size="lg"
						className="max-w-md"
					>
						Retour à la page d'accueil
					</Button>
				</div>
			</main>
		</>
	)
}

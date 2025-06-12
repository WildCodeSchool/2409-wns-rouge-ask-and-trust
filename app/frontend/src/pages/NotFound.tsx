import { useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"
import { WHOAMI } from "@/graphql/auth"
import { useQuery } from "@apollo/client"

export default function NotFound() {
	const { data: whoamiData } = useQuery(WHOAMI)
	const me = whoamiData?.whoami
	const navigate = useNavigate()

	useEffect(() => {
		const automaticRedirect = setInterval(() => {
			navigate(me ? "/surveys" : "/", { replace: true })
		}, 5000)

		return () => clearInterval(automaticRedirect)
	}, [navigate, me])

	const handleReturnHome = () => {
		navigate(me ? "/surveys" : "/", { replace: true })
	}

	return (
		<>
			{/* Update of the metadata */}
			<Helmet>
				<title>404 - Page non trouvée | Ask&Trust</title>
				<meta
					name="description"
					content="La page que vous recherchez n'existe pas ou a été déplacée."
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta
					property="og:title"
					content="404 - Page non trouvée | Ask&Trust"
				/>
				<meta
					property="og:description"
					content="La page que vous recherchez n'existe pas ou a été déplacée."
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:title"
					content="404 - Page non trouvée | Ask&Trust"
				/>
				<meta
					name="twitter:description"
					content="La page que vous recherchez n'existe pas ou a été déplacée."
				/>
			</Helmet>

			<main
				lang="fr"
				role="main"
				className="bg-bg relative flex min-h-screen items-center justify-center"
			>
				<div className="p-8 text-center">
					<img
						src="/img/errors/undraw_page-not-found_6wni.svg"
						alt="Illustration page non trouvée"
						className="mx-auto mb-8 h-auto w-96"
						role="presentation"
						aria-label="Illustration page non trouvée"
						aria-hidden="false"
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

import SurveyCard from "@/components/sections/surveys/SurveyCard"
import img from "/img/dev.webp"
import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { Helmet } from "react-helmet"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer"

export default function Surveys() {
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		if (isMobile) {
			document.body.classList.add("hide-scrollbar")
		} else {
			document.body.classList.remove("hide-scrollbar")
		}

		return () => {
			document.body.classList.remove("hide-scrollbar")
		}
	}, [isMobile])

	return (
		<>
			{/* Update of the metadata */}
			<Helmet>
				<title>Liste des enquêtes disponibles</title>
				<meta
					name="description"
					content="Page présentant toutes les enquêtes disponibles sur Ask$Trust."
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta
					property="og:title"
					content="Liste des enquêtes disponibles"
				/>
				<meta
					property="og:description"
					content="Page présentant toutes les enquêtes disponibles sur Ask$Trust."
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:title"
					content="Liste des enquêtes disponibles"
				/>
				<meta
					name="twitter:description"
					content="Page présentant toutes les enquêtes disponibles sur Ask$Trust."
				/>
			</Helmet>
			<section className={clsx("px-20 max-sm:px-5", isMobile && "pb-10")}>
				<h1
					className={clsx(
						"text-fg text-center text-3xl font-bold max-lg:text-xl",
						isMobile ? "mb-14" : "mb-20"
					)}
				>
					Liste des enquêtes disponibles
				</h1>
				<div
					className={clsx(
						"grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] justify-items-center",
						isMobile ? "gap-14" : "gap-20"
					)}
				>
					<SurveyCard
						href="/surveys"
						picture={img}
						title="Pratiquez vous une activité physique?"
						content="Dites-nous si le sport fait partie de votre quotidien. Vos réponses aideront à mieux comprendre les habitudes d'activité physique."
						tag="Sport"
						estimateTime={5}
						timeLeft="Un mois"
					/>
				</div>
				<SurveyTableContainer />
			</section>
			{!isMobile && (
				<div className="flex items-center justify-center">
					<Button
						variant="primary"
						ariaLabel="Création d'une enquête"
						children="Créer une enquête"
						to="/surveys/create"
					/>
				</div>
			)}
		</>
	)
}

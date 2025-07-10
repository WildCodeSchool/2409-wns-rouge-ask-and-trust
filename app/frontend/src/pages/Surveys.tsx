import SurveyCard from "@/components/sections/surveys/SurveyCard"
import img from "/img/dev.webp"
import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { cn } from "@/lib/utils"
import { useQuery } from "@apollo/client"
import { GET_SURVEYS } from "@/graphql/survey/survey"
import { SurveyCardType } from "@/types/types"

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

	const { data, loading: isFetching } = useQuery(GET_SURVEYS)
	const surveys = data?.surveys || []

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
			<section
				className={cn(
					"px-20 max-sm:px-5",
					isMobile ? "pb-10" : "mb-20"
				)}
			>
				<h1
					className={cn(
						"text-fg text-center text-3xl font-bold max-lg:text-xl",
						isMobile ? "mb-14" : "mb-20"
					)}
				>
					Liste des enquêtes disponibles
				</h1>
				{isFetching && (
					<div className="flex items-center justify-center">
						<p>Chargement des enquêtes...</p>
					</div>
				)}
				<div
					className={cn(
						"grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] justify-items-center",
						isMobile ? "gap-14" : "gap-20"
					)}
				>
					{surveys.map((survey: SurveyCardType) => (
						// Implémenter l'image, le temps estimé et la durée de disponibilité de l'enquête

						<SurveyCard
							key={survey.id}
							id={survey.id}
							picture={img}
							title={survey.title}
							description={survey.description}
							category={survey.category}
							estimateTime={5}
							timeLeft="Un mois"
						/>
					))}
				</div>
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

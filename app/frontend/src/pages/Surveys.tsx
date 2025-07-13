import SurveyCard from "@/components/sections/surveys/SurveyCard"
import img from "/img/dev.webp"
import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { cn } from "@/lib/utils"
import { useQuery } from "@apollo/client"
import { GET_SURVEYS } from "@/graphql/survey/survey"
import { AllSurveysHome, SurveyCardType } from "@/types/types"
import Pagination from "@/components/ui/Pagination"
import { useSearchParams } from "react-router-dom"
import Loader from "@/components/ui/Loader"
import useResponsive from "@/hooks/useResponsive"

export default function Surveys() {
	const isMobile = useResponsive()
	const [searchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const surveysPerPage = 9

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

	const categoryId = searchParams.get("categoryId")

	const {
		data,
		loading: isFetching,
		error,
	} = useQuery<AllSurveysHome>(GET_SURVEYS, {
		variables: {
			filters: {
				page: currentPage,
				limit: surveysPerPage,
				search: searchParams.get("search") || "",
				categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
				// sortBy: "estimatedDuration",
				// order: "DESC",
			},
		},
	})
	if (error) {
		console.error("GraphQL Error:", error)
	}

	const allSurveysData = data?.surveys?.allSurveys ?? []
	const totalCount = data?.surveys?.totalCount ?? 0

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
				{isFetching ? (
					<div className="flex items-center justify-center">
						<Loader />
					</div>
				) : (
					<div
						className={cn(
							"grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] justify-items-center",
							isMobile ? "gap-14" : "gap-20"
						)}
					>
						{allSurveysData.map((survey: SurveyCardType) => (
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
				)}
				<Pagination
					className="mx-auto mt-20 mb-0 w-max"
					currentPage={currentPage}
					totalCount={totalCount}
					perPage={surveysPerPage}
					onPageChange={setCurrentPage}
				/>
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

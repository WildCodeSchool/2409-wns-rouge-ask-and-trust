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
import SurveyDurationFilter from "@/components/sections/surveys/ui/SurveyDurationFilter"
import { useResponsivity } from "@/hooks/useResponsivity"

export default function Surveys() {
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)
	const [searchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [sortTimeOption, setSortTimeOption] = useState<string>("")
	const surveysPerPage = 12

	useEffect(() => {
		if (isHorizontalCompact) {
			document.body.classList.add("hide-scrollbar")
		} else {
			document.body.classList.remove("hide-scrollbar")
		}

		return () => {
			document.body.classList.remove("hide-scrollbar")
		}
	}, [isHorizontalCompact])

	const categoryId = searchParams.get("categoryId")

	const getSortParams = (sortTimeOption: string) => {
		if (!sortTimeOption)
			return { sortBy: "estimatedDuration", order: "DESC" }

		const [field, direction] = sortTimeOption.split("_")
		return {
			sortBy: field as "estimatedDuration" | "availableDuration",
			order: direction as "ASC" | "DESC",
		}
	}

	const { sortBy, order } = getSortParams(sortTimeOption)

	const { data, loading: isFetching } = useQuery<AllSurveysHome>(
		GET_SURVEYS,
		{
			variables: {
				filters: {
					page: currentPage,
					limit: surveysPerPage,
					search: searchParams.get("search") || "",
					categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
					sortBy,
					order,
				},
			},
		}
	)

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
					isHorizontalCompact ? "pb-10" : "mb-20"
				)}
				ref={rootRef}
			>
				<h1
					className={cn(
						"text-fg text-center text-3xl font-bold max-lg:text-xl",
						isHorizontalCompact ? "mb-14" : "mb-20"
					)}
				>
					Liste des enquêtes disponibles
				</h1>
				<SurveyDurationFilter
					sortTimeOption={sortTimeOption}
					setSortTimeOption={setSortTimeOption}
					isHorizontalCompact={isHorizontalCompact}
				/>
				{isFetching ? (
					<div className="flex items-center justify-center">
						<Loader />
					</div>
				) : (
					<div
						className={cn(
							"grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] justify-items-center",
							isHorizontalCompact ? "gap-14" : "gap-20"
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
								estimatedDuration={survey.estimatedDuration}
								availableDuration={survey.availableDuration}
							/>
						))}
					</div>
				)}
				{totalCount === 0 && (
					<div className="flex w-full items-center justify-center">
						<p className="text-black-default text-xl font-medium">
							Aucune enquête ne correspond à votre recherche...
						</p>
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
			{!isHorizontalCompact && (
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

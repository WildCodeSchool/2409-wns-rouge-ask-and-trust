import { withSEO } from "@/components/hoc/withSEO"
import SurveyCard from "@/components/sections/surveys/SurveyCard"
import SurveyDurationFilter from "@/components/sections/surveys/ui/SurveyDurationFilter"
import { Button } from "@/components/ui/Button"
import Pagination from "@/components/ui/Pagination"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useSurvey } from "@/hooks/useSurvey"
import { cn } from "@/lib/utils"
import { SurveyCardType, SurveyStatus } from "@/types/types"
import { useEffect } from "react"
import { useAuthContext } from "@/hooks/useAuthContext"
import img from "/img/dev.webp"
import SurveyCardSkeleton from "@/components/sections/surveys/ui/SurveyCardSkeleton"

function Surveys() {
	const { user: owner } = useAuthContext()
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)

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

	const {
		surveys,
		isFetching,
		allSurveysError,
		currentPage,
		PER_PAGE,
		setCurrentPage,
		sortTimeOption,
		setSortTimeOption,
		totalCount,
	} = useSurvey<SurveyCardType>({ mode: "home" })

	if (!surveys && allSurveysError) {
		const isNotFoundError = allSurveysError.graphQLErrors.some(error =>
			error.message.includes("Failed to fetch surveys")
		)

		if (isNotFoundError) {
			throw new Response("Surveys not found", { status: 404 })
		}

		// Pour les autres erreurs GraphQL
		throw new Response("Error loading surveys", { status: 500 })
	}

	if (!isFetching && !surveys) {
		throw new Response("Survey nots found", { status: 404 })
	}

	const allSurveys =
		surveys?.allSurveys?.map(survey => ({
			...survey,
			isOwner: !!(owner && survey.user && owner.id === survey.user.id),
		})) ?? []

	const publishedSurveys =
		allSurveys?.filter(
			survey => survey.status === SurveyStatus.Published
		) ?? []

	return (
		<section
			className={cn(
				"px-5 py-10 pb-[calc(var(--footer-height)+40px)] md:min-h-[calc(100vh_-_var(--header-height))] md:px-10 md:pb-10"
			)}
			ref={rootRef}
		>
			<h1 className="text-fg mb-10 text-center text-3xl font-bold max-lg:text-xl">
				Liste des enquêtes disponibles
			</h1>
			<SurveyDurationFilter
				sortTimeOption={sortTimeOption}
				setSortTimeOption={setSortTimeOption}
			/>
			{isFetching ? (
				<div className="flex flex-col gap-10 md:grid md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] md:justify-items-center md:gap-20">
					{Array.from({ length: PER_PAGE.all }).map((_, index) => (
						<SurveyCardSkeleton key={index} />
					))}
				</div>
			) : publishedSurveys.length > 0 ? (
				<div className="flex flex-col gap-10 md:grid md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] md:justify-items-center md:gap-20">
					{publishedSurveys.map(survey => (
						<SurveyCard
							key={survey.id}
							id={survey.id}
							picture={img}
							title={survey.title}
							description={survey.description}
							category={survey.category}
							estimatedDuration={survey.estimatedDuration}
							availableDuration={survey.availableDuration}
							isOwner={survey.isOwner}
						/>
					))}
				</div>
			) : (
				<div className="flex w-full items-center justify-center text-center">
					<p className="text-black-default text-xl font-medium">
						Aucune enquête n'a encore été publiée...
					</p>
				</div>
			)}
			<Pagination
				className="mx-auto mt-20 mb-0 w-max"
				currentPage={currentPage}
				totalCount={totalCount}
				perPage={PER_PAGE.home}
				onPageChange={setCurrentPage}
			/>
			{!isHorizontalCompact && (
				<div className="mt-10 flex items-center justify-center">
					<Button
						variant="primary"
						ariaLabel="Création d'une enquête"
						children="Créer une enquête"
						to="/surveys/create"
					/>
				</div>
			)}
		</section>
	)
}

const SurveysWithSEO = withSEO(Surveys, "surveys")
export default SurveysWithSEO

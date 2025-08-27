import SurveyCard from "@/components/sections/surveys/SurveyCard"
import img from "/img/dev.webp"
import { Button } from "@/components/ui/Button"
import { useEffect } from "react"
import { withSEO } from "@/components/hoc/withSEO"
import { cn } from "@/lib/utils"
import Pagination from "@/components/ui/Pagination"
import Loader from "@/components/ui/Loader"
import SurveyDurationFilter from "@/components/sections/surveys/ui/SurveyDurationFilter"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useSurvey } from "@/hooks/useSurvey"

function Surveys() {
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)
	const {
		isFetching,
		allSurveys,
		currentPage,
		PER_PAGE,
		setCurrentPage,
		sortTimeOption,
		setSortTimeOption,
		totalCount,
	} = useSurvey()

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

	const publishedSurveys = allSurveys.filter(
		survey => survey.status === "publiée"
	)

	return (
		<section
			className={cn(
				"px-20 py-20 max-sm:px-5",
				totalCount === 0 &&
					"h-[calc(100vh_-_var(--header-height))] pb-0",
				isHorizontalCompact && "pb-[calc(var(--footer-height)+80px)]"
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
			) : publishedSurveys.length > 0 ? (
				<div
					className={cn(
						"grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] justify-items-center",
						isHorizontalCompact ? "gap-14" : "gap-20"
					)}
				>
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
			{totalCount === 0 && (
				<div className="flex w-full items-center justify-center text-center">
					<p className="text-black-default text-xl font-medium">
						Aucune enquête ne correspond à votre recherche...
					</p>
				</div>
			)}
			<Pagination
				className="mx-auto mt-20 mb-0 w-max"
				currentPage={currentPage}
				totalCount={totalCount}
				perPage={PER_PAGE.all}
				onPageChange={setCurrentPage}
			/>
			{!isHorizontalCompact && (
				<div className="mt-20 flex items-center justify-center">
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

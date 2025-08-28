import { withSEO } from "@/components/hoc/withSEO"
import SurveyCard from "@/components/sections/surveys/SurveyCard"
import SurveyDurationFilter from "@/components/sections/surveys/ui/SurveyDurationFilter"
import { Button } from "@/components/ui/Button"
import Loader from "@/components/ui/Loader"
import Pagination from "@/components/ui/Pagination"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useSurvey } from "@/hooks/useSurvey"
import { cn } from "@/lib/utils"
import { SurveyStatus } from "@/types/types"
import { useEffect } from "react"
import img from "/img/dev.webp"

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
		survey => survey.status === SurveyStatus.Published
	)

	return (
		<section
			className={cn(
				"px-5 py-10 pb-[calc(var(--footer-height)+40px)] md:px-10 md:pb-10"
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
				<div className="flex items-center justify-center">
					<Loader />
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
				perPage={PER_PAGE.all}
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

import { withSEO } from "@/components/hoc/withSEO"
import SurveyCard from "@/components/sections/surveys/SurveyCard"
import SurveyCardPlaceholder from "@/components/sections/surveys/ui/SurveyCardPlaceholder"
import SurveyDurationFilter from "@/components/sections/surveys/ui/SurveyDurationFilter"
import SurveyPageSkeleton from "@/components/sections/surveys/ui/SurveyPageSkeleton"
import { Button } from "@/components/ui/Button"
import Pagination from "@/components/ui/Pagination"
import { useSurveyMutations } from "@/hooks/survey/useSurveyMutations"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { cn } from "@/lib/utils"
import { SurveyCardType } from "@/types/types"
import { PlusCircle } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import img from "/img/dev.webp"
import { useSurveysData } from "@/hooks/survey/useSurveysData"

function Surveys() {
	const { user } = useAuthContext()
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)

	const {
		createSurvey,
		createSurveyError,
		isCreatingSurvey,
		resetCreateSurveyError,
	} = useSurveyMutations()

	useToastOnChange({
		trigger: createSurveyError,
		resetTrigger: resetCreateSurveyError,
		type: "error",
		title: "Erreur pour créer l'enquête",
		description: "Nous n'avons pas réussi à créer l'enquête",
	})

	const navigate = useNavigate()
	const { showToast } = useToast()

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
		isLoadingSurveys,
		surveysError,
		currentPage,
		PER_PAGE,
		setCurrentPage,
		sortTimeOption,
		setSortTimeOption,
		totalCount,
	} = useSurveysData<SurveyCardType>({ mode: "home" })

	if (!surveys && surveysError) {
		const isNotFoundError = surveysError.graphQLErrors.some(error =>
			error.message.includes("Failed to fetch surveys")
		)

		if (isNotFoundError) {
			throw new Response("Surveys not found", { status: 404 })
		}

		// Pour les autres erreurs GraphQL
		throw new Response("Error loading surveys", { status: 500 })
	}

	if (!isLoadingSurveys && !surveys) {
		throw new Response("Survey nots found", { status: 404 })
	}

	const allSurveys =
		surveys?.allSurveys?.map(survey => ({
			...survey,
			isOwner: !!(user && survey.user && user.id === survey.user.id),
		})) ?? []

	// Calculate how many placeholder cards to show to reach a minimum of 4 cards
	const minCardsToShow = 4
	const placeholdersCount = Math.max(0, minCardsToShow - allSurveys.length)
	const placeholders = Array.from(
		{ length: placeholdersCount },
		(_, index) => index
	)

	const onCreateSurveyAndNavigate = async () => {
		try {
			const newSurvey = await createSurvey({
				title: "Nouvelle enquête",
				description: "",
				public: false,
				category: "",
			})

			if (!newSurvey?.id) {
				throw new Error(
					"Impossible de récupérer l'ID de la nouvelle enquête"
				)
			}

			navigate(`/surveys/build/${newSurvey.id}`)
		} catch (error) {
			console.error(error)
			showToast({
				type: "error",
				title: "Erreur",
				description: "La création de l'enquête a échoué",
			})
		}
	}

	return isLoadingSurveys ? (
		<SurveyPageSkeleton />
	) : (
		<section
			className={cn(
				"larger-screen:w-4/5 larger-screen:mx-auto px-5 py-10 pb-[calc(var(--footer-height)+40px)] md:min-h-[calc(100vh_-_var(--header-height))] md:px-10 md:pb-10"
			)}
			ref={rootRef}
		>
			<h1 className="text-fg mb-5 text-center text-3xl font-bold max-lg:text-xl">
				Liste des enquêtes disponibles
			</h1>
			<SurveyDurationFilter
				sortTimeOption={sortTimeOption}
				setSortTimeOption={setSortTimeOption}
			/>
			{allSurveys.length > 0 ? (
				<div className="grid w-full justify-between gap-20 max-md:grid-cols-2 max-md:gap-10 max-sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
					{allSurveys.map(survey => (
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
					{placeholders.map(index => (
						<SurveyCardPlaceholder key={`placeholder-${index}`} />
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
			{!isHorizontalCompact && user && (
				<div className="mt-10 flex items-center justify-center">
					<Button
						icon={PlusCircle}
						loadingSpinner={isCreatingSurvey}
						onClick={onCreateSurveyAndNavigate}
						variant="primary"
						role="button"
						ariaLabel="Créer une enquête"
						children="Créer une enquête"
					/>
				</div>
			)}
		</section>
	)
}

const SurveysWithSEO = withSEO(Surveys, "surveys")
export default SurveysWithSEO

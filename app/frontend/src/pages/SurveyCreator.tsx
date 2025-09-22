import { withSEO } from "@/components/hoc/withSEO"
import { Canvas } from "@/components/sections/canvas/Canvas"
import { SurveyCreatorHeader } from "@/components/sections/surveys/buildSurvey/question/SurveyCreatorHeader"
import { SurveyCreatorSkeleton } from "@/components/sections/surveys/buildSurvey/question/SurveyCreatorSkeleton"

import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { Button } from "@/components/ui/Button"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useQuestions } from "@/hooks/useQuestions"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { useSurvey } from "@/hooks/useSurvey"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { QuestionType, SurveyWithoutQuestions } from "@/types/types"
import { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

function SurveyCreator() {
	//  Get survey's id from params
	const { id: surveyId } = useParams()
	// Focused question ID for the current question in the canvas
	const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(
		null
	)
	// Load addQuestion function from the API
	const {
		addQuestion,
		isCreateQuestionLoading,
		createQuestionError,
		resetCreateQuestionError,
	} = useQuestions()

	const { survey, surveyLoading, surveyError, refetchSurvey } =
		useSurvey(surveyId)

	const { showToast } = useToast()
	const { isMobile } = useScreenDetector()
	const { user } = useAuthContext()
	useToastOnChange({
		trigger: createQuestionError,
		resetTrigger: resetCreateQuestionError,
		type: "error",
		title: "Oops, nous avons rencontré une erreur",
		description:
			createQuestionError?.message ??
			"La question n'a pas pu être ajoutée",
	})

	// Memoize questions to avoid unnecessary re-renders
	const questions = useMemo(() => {
		return survey?.questions ?? []
	}, [survey?.questions])

	const handleAddQuestion = useCallback(
		async (type: QuestionType | undefined) => {
			if (!surveyId) return

			const result = await addQuestion({
				surveyId: Number(surveyId),
				type,
			})

			if (result?.id) {
				showToast({
					type: "success",
					title: "Question ajoutée !",
				})
				setFocusedQuestionId(result.id)
			}
		},
		[addQuestion, showToast, surveyId]
	)

	// Create a survey object without questions for the header
	const surveyWithoutQuestions: SurveyWithoutQuestions | undefined =
		useMemo(() => {
			if (!survey) return undefined
			const { questions, ...rest } = survey
			void questions
			return rest
		}, [survey])

	if (surveyLoading) {
		return <SurveyCreatorSkeleton />
	}

	const surveyUser = survey?.user.id
	const connectedUser = user?.id
	const isOwner = surveyUser === connectedUser

	return (
		// @TODO check this, keep it for after rebase
		// <div className="2xl:max-w-larger mx-auto flex h-[calc(100vh_-_var(--header-height))] max-w-7xl flex-col bg-gray-50">
		// 	{!data || !isOwner ? (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-gray-50 max-md:h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))]">
			{surveyError && !survey ? (
				<ErrorData
					type="surveyfetcherror"
					refetch={refetchSurvey}
					loading={surveyLoading}
				/>
			) : !survey || !isOwner ? (
				<ErrorData type={!isOwner ? "notowner" : "nosurvey"} />
			) : (
				<>
					{surveyWithoutQuestions && (
						<SurveyCreatorHeader
							survey={surveyWithoutQuestions}
							isQuestions={!!questions.length}
						/>
					)}
					<section className="box-border flex h-full w-full flex-row gap-4 overflow-hidden p-4 lg:gap-4 lg:p-4">
						{!isMobile && (
							<Toolbox onAddQuestion={handleAddQuestion} />
						)}
						{!survey?.questions ? (
							<ErrorData
								type="noquestions"
								refetch={refetchSurvey}
								loading={surveyLoading}
							/>
						) : (
							<Canvas
								onAddQuestion={handleAddQuestion}
								isCreateQuestionLoading={
									isCreateQuestionLoading
								}
								questions={questions}
								focusedQuestionId={focusedQuestionId}
								setFocusedQuestionId={setFocusedQuestionId}
							/>
						)}
					</section>
				</>
			)}
		</div>
	)
}

function ErrorData({
	type,
	refetch,
	loading,
}: {
	type: "nosurvey" | "surveyfetcherror" | "noquestions" | "notowner"
	refetch?: () => void
	loading?: boolean
}) {
	let title: string
	let description: string

	switch (type) {
		case "surveyfetcherror":
			title = "Erreur lors du chargement"
			description =
				"Impossible de récupérer l'enquête. Essayez à nouveau."
			break
		case "nosurvey":
			title = "Aucune enquête trouvée"
			description = "Nous n'avons pas trouvé l'enquête demandée"

			break
		case "noquestions":
			title = "Impossible de charger les questions"
			description =
				"Une erreur est survenue lors de la récupération des questions de l'enquête"
			break

		case "notowner":
			title = "Accès refusé"
			description = "Vous n'êtes pas autorisé à accéder à cette enquête"
			break

		default:
			throw new Error(
				`error's type >> ${type} << in survey creator ErrorData is not handled`
			)
	}

	return (
		<div className="m-auto flex flex-col items-center justify-center gap-8">
			<div className="flex flex-col items-center justify-center text-center">
				<img
					src="/img/errors/undraw_access-denied_krem.svg"
					alt="Aucune enquête disponible"
					className="mb-6 h-48 w-48"
				/>
				<h2 className="text-xl font-semibold">{title}</h2>
				<p className="text-gray-600">{description}</p>
			</div>
			<div className="flex gap-4">
				<Button ariaLabel="Aller à la liste des enquêtes" to="/surveys">
					Aller à la liste des enquêtes
				</Button>
				{type === "noquestions" && refetch && (
					<Button
						ariaLabel="Réessayer"
						onClick={refetch}
						disabled={loading}
						loadingSpinner={loading}
					>
						"Réessayer"
					</Button>
				)}
			</div>
		</div>
	)
}

const SurveyCreatorWithSEO = withSEO(SurveyCreator, "surveyCreator")
export default SurveyCreatorWithSEO

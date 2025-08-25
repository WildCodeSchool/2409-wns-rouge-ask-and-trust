import { Canvas } from "@/components/sections/canvas/Canvas"
import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { QuestionType, Survey } from "@/types/types"
import { useQuery } from "@apollo/client"
import { withSEO } from "@/components/hoc/withSEO"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/Skeleton"

function SurveyCreator() {
	//  Get survey's id from params
	const { id: surveyId } = useParams()
	// Focused question ID for the current question in the canvas
	const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(
		null
	)
	// Load addQuestion function from the API
	const { addQuestion, createQuestionError, resetCreateQuestionError } =
		useQuestions()
	// @TODO mayse getQuestions here and getSurvey infos in Survey details
	const { data, loading: loadingSurvey } = useQuery<{
		survey: Survey
	}>(GET_SURVEY, {
		variables: {
			surveyId,
		},
		fetchPolicy: "cache-first",
	})

	const { showToast } = useToast()

	// Show a toast notification if there is an error after creating a question
	useEffect(() => {
		if (createQuestionError) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: "La question n'a pas pu être ajoutée.",
			})
			resetCreateQuestionError() // Reset the error to avoid permanent toast error
		}
	}, [createQuestionError, resetCreateQuestionError, showToast])

	// Memoize questions to avoid unnecessary re-renders
	const questions = useMemo(() => {
		return data?.survey?.questions ?? []
	}, [data?.survey?.questions])

	const handleAddQuestion = useCallback(
		async (type: QuestionType | undefined) => {
			if (!surveyId) return

			setFocusedQuestionId(null)

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

	if (loadingSurvey) {
		return <SurveyCreatorSkeleton />
	}

	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-gray-50">
			{/* @TODO create a SurveyDetails component to edit survey's title, description, settings... */}
			<section className="p-4 pb-0 lg:p-4 lg:pb-0">
				<div className="border-black-50 shadow-default flex items-center justify-between rounded-xl border bg-white p-4">
					<h1 className="h-fit text-2xl font-semibold text-gray-900">
						Création de l'enquête
					</h1>
				</div>
			</section>
			<section className="box-border flex h-full w-full flex-row gap-4 overflow-hidden p-4 lg:gap-4 lg:p-4">
				<Toolbox onAddQuestion={handleAddQuestion} />
				<Canvas
					onAddQuestion={handleAddQuestion}
					questions={questions}
					focusedQuestionId={focusedQuestionId}
					setFocusedQuestionId={setFocusedQuestionId}
				/>
			</section>
		</div>
	)
}

const SurveyCreatorWithSEO = withSEO(SurveyCreator, "surveyCreator")
export default SurveyCreatorWithSEO

export function SurveyCreatorSkeleton() {
	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-white">
			<section className="p-4 pb-0 lg:p-4 lg:pb-0">
				<div className="border-black-50 shadow-default rounded-xl border bg-white p-4">
					<Skeleton className="h-8 w-64" />
				</div>
			</section>
			<section className="box-border flex h-full w-full flex-row gap-4 overflow-hidden p-4">
				{/* Toolbox Skeleton */}
				<div className="border-black-50 shadow-default flex h-full w-[250px] flex-col gap-4 rounded-xl border bg-white p-4">
					<Skeleton className="h-6 w-full" />
					<div className="flex flex-col gap-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				</div>

				{/* Canvas Skeleton */}
				<div className="flex w-full flex-col gap-6 overflow-y-auto">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
						>
							<Skeleton className="mb-2 h-6 w-1/3" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/2" />
						</div>
					))}
					<Skeleton className="h-10 w-48 self-center" />
				</div>

				{/* Table of Content Skeleton
				 */}
				<div className="border-black-50 shadow-default flex h-full w-[250px] flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4">
					{Array.from({ length: 14 }).map((_, i) => (
						<div className="flex items-center gap-1" key={i}>
							<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
							<Skeleton className="h-4 w-full" />
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

import { Canvas } from "@/components/sections/canvas/Canvas"
import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { QuestionType, Survey } from "@/types/types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

function SurveyCreator() {
	//  Get survey's id from params
	const { id: surveyId } = useParams()
	// @TODO add errors handling
	const [newQuestionId, setNewQuestionId] = useState<number | null>(null)
	// Focused question ID for the current question in the canvas
	// Use this to focus the question when clicking in the Table of Content
	const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(
		null
	)
	const { addQuestion, createQuestionError, resetCreateQuestionError } =
		useQuestions()

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
				setNewQuestionId(result.id)
			}
		},
		[addQuestion, showToast, surveyId]
	)

	const questions = useMemo(() => {
		return data?.survey?.questions ?? []
	}, [data?.survey?.questions])

	if (loadingSurvey) {
		return <SurveyCreatorSkeleton />
	}

	return (
		<>
			<Helmet>
				<title>Survey Creator</title>
				<meta
					name="description"
					content="Page de création de l'enquête."
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta property="og:title" content="Création de l'enquête" />
				<meta
					property="og:description"
					content="Page de création de l'enquête."
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Création de l'enquête" />
				<meta
					name="twitter:description"
					content="Page de création de l'enquête."
				/>
			</Helmet>
			<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-gray-50">
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
						newQuestionId={newQuestionId}
						setNewQuestionId={setNewQuestionId}
						questions={questions}
						focusedQuestionId={focusedQuestionId}
						setFocusedQuestionId={setFocusedQuestionId}
					/>
				</section>
			</div>
		</>
	)
}

export default SurveyCreator

import { Skeleton } from "@/components/ui/Skeleton"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { useQuery } from "@apollo/client"

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

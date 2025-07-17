import { Canvas } from "@/components/sections/canvas/Canvas"
import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import "@/styles/toolbox.css"
import { QuestionType, Survey } from "@/types/types"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

function SurveyCreator() {
	//  Get survey's id from params
	const { id: surveyId } = useParams()
	// @TODO add errors handling
	const { data, loading: loadingSurvey } = useQuery<{ survey: Survey }>(
		GET_SURVEY,
		{
			variables: {
				surveyId,
			},
		}
	)
	const [newQuestionId, setNewQuestionId] = useState<number | null>(null)
	const { addQuestion, createQuestionError, resetCreateQuestionError } =
		useQuestions()
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

	const handleAddQuestion = async (type: QuestionType | undefined) => {
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
			setNewQuestionId(result.id)
		}
	}

	return (
		<>
			{loadingSurvey && <div className="loader">Chargement...</div>}
			{data && (
				<>
					<Helmet>
						<title>Survey Creator</title>
						<meta
							name="description"
							content="Page de création de l'enquête."
						/>
						<meta name="robots" content="noindex, nofollow" />
						{/* Open Graph */}
						<meta
							property="og:title"
							content="Création de l'enquête"
						/>
						<meta
							property="og:description"
							content="Page de création de l'enquête."
						/>
						<meta property="og:type" content="website" />
						{/* Twitter Card */}
						<meta name="twitter:card" content="summary" />
						<meta
							name="twitter:title"
							content="Création de l'enquête"
						/>
						<meta
							name="twitter:description"
							content="Page de création de l'enquête."
						/>
					</Helmet>
					<div className="min-h-screen bg-gray-50">
						<section className="bg-white shadow-sm">
							<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
								<h1 className="text-2xl font-semibold text-gray-900">
									Création de l'enquête
								</h1>
							</div>
						</section>

						<section className="mx-auto py-6 sm:px-6 lg:px-8">
							<div className="flex h-[calc(100vh-160px)]">
								<Toolbox
									onAddQuestion={handleAddQuestion}
									className="h-full"
								/>
								<div className="flex-grow overflow-auto px-4 sm:px-6 lg:px-8">
									<Canvas
										className="w-full"
										questions={data?.survey.questions}
										newQuestionId={newQuestionId}
										setNewQuestionId={setNewQuestionId}
									/>
								</div>
							</div>
						</section>
					</div>
				</>
			)}
		</>
	)
}

export default SurveyCreator

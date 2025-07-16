import { useMutation, useQuery } from "@apollo/client"
import {
	CREATE_ANSWER,
	GET_ANSWERS_BY_SURVEY,
	DELETE_ANSWERS_BY_SURVEY,
} from "@/graphql/survey/answers"
import { SurveyResponseFormData, QuestionResponse } from "@/types/types"
import { useCallback } from "react"

export type SubmitAnswerInput = {
	content: string
	questionId: number
}

export type SubmitSurveyResponseInput = {
	surveyId: number
	responses: SurveyResponseFormData
}

export type ExistingAnswer = {
	id: string
	content: string
	questionId: number
	userId: number
	createdAt: string
	question: {
		id: number
		title: string
		type: string
	}
}

export function useAnswers(surveyId?: number) {
	const [
		createAnswerMutation,
		{ loading: isCreatingAnswer, error: createAnswerError },
	] = useMutation(CREATE_ANSWER)

	const [
		deleteAnswersBySurveyMutation,
		{ loading: isDeletingAnswers, error: deleteAnswersError },
	] = useMutation(DELETE_ANSWERS_BY_SURVEY)

	// Query pour récupérer les réponses existantes d'un utilisateur pour un sondage
	const {
		data: existingAnswersData,
		loading: isLoadingAnswers,
		error: answersError,
		refetch: refetchAnswers,
	} = useQuery(GET_ANSWERS_BY_SURVEY, {
		variables: { surveyId },
		skip: !surveyId, // Skip if no surveyId provided
		fetchPolicy: "cache-and-network",
	})

	const submitAnswer = async (input: SubmitAnswerInput) => {
		try {
			const result = await createAnswerMutation({
				variables: {
					data: {
						content: input.content,
						questionId: input.questionId,
					},
				},
			})
			return result.data?.createAnswer
		} catch (error) {
			console.error("Error submitting answer:", error)
			throw error
		}
	}

	const submitSurveyResponse = async (input: SubmitSurveyResponseInput) => {
		try {
			const responses: QuestionResponse[] = []

			// Convert form data to individual answers
			for (const [fieldName, value] of Object.entries(input.responses)) {
				if (fieldName.startsWith("question_")) {
					const questionId = parseInt(
						fieldName.replace("question_", "")
					)

					// Handle different types of responses
					let content: string
					if (Array.isArray(value)) {
						content = value.join(", ")
					} else if (typeof value === "boolean") {
						content = value ? "Oui" : "Non"
					} else {
						content = String(value)
					}

					// Skip empty responses
					if (content && content.trim() !== "") {
						responses.push({
							questionId,
							value: content,
						})
					}
				}
			}

			// Submit each answer individually
			const results = await Promise.all(
				responses.map(response =>
					submitAnswer({
						content: response.value as string,
						questionId: response.questionId,
					})
				)
			)

			// Refetch answers to update cache
			if (surveyId) {
				await refetchAnswers()
			}

			return results
		} catch (error) {
			console.error("Error submitting survey response:", error)
			throw error
		}
	}

	// Helper function to get existing answers formatted for form
	const getExistingAnswersForForm = useCallback(() => {
		if (!existingAnswersData?.answersBySurvey) {
			return {}
		}

		const formData: Record<string, string | boolean | string[]> = {}

		existingAnswersData.answersBySurvey.forEach(
			(answer: ExistingAnswer) => {
				const fieldName = `question_${answer.questionId}`

				// Parse content based on question type
				let value: string | boolean | string[] = answer.content

				switch (answer.question.type) {
					case "boolean":
						// Handle boolean responses based on content
						value = answer.content === "Oui"
						break

					case "multiple_choice":
						// Handle multiple choice responses (always split by comma)
						value = answer.content.includes(", ")
							? answer.content.split(", ")
							: [answer.content]
						break

					case "select":
					case "text":
					default:
						// Keep as string for select and text types
						value = answer.content
						break
				}

				formData[fieldName] = value
			}
		)

		return formData
	}, [existingAnswersData?.answersBySurvey])

	// Function to delete all answers for a survey
	const deleteAllAnswers = async () => {
		try {
			if (!surveyId) {
				throw new Error("Survey ID is required")
			}

			const result = await deleteAnswersBySurveyMutation({
				variables: { surveyId: surveyId.toString() },
			})

			// Refetch answers to update cache
			await refetchAnswers()

			return result.data?.deleteAnswersBySurvey
		} catch (error) {
			console.error("Error deleting survey answers:", error)
			throw error
		}
	}

	return {
		submitAnswer,
		submitSurveyResponse,
		deleteAllAnswers,
		isCreatingAnswer,
		isDeletingAnswers,
		createAnswerError,
		deleteAnswersError,
		existingAnswers: existingAnswersData?.answersBySurvey || [],
		isLoadingAnswers,
		answersError,
		getExistingAnswersForForm,
		refetchAnswers,
	}
}

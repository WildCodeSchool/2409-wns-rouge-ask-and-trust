import {
	CREATE_QUESTION,
	DELETE_QUESTION,
	GET_QUESTION,
	UPDATE_QUESTION,
} from "@/graphql/survey/question"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { useMutation, useQuery } from "@apollo/client"
import { AnswerObject } from "./../../../backend/src/graphql/inputs/create/survey/create-questions-input"

export type CreateQuestionInput = {
	title?: string
	type?: QuestionType
	answers?: AnswerObject[]
	surveyId: number
}

export type UpdateQuestionInput = Omit<CreateQuestionInput, "surveyId"> & {
	id: number
}

const DEFAULT_ANSWERS_MULTIPLE: AnswerObject[] = [
	{ value: "Réponse 1" },
	{ value: "Réponse 2" },
]

const DEFAULT_ANSWERS_BOOLEAN: AnswerObject[] = [
	{ value: "Vrai" },
	{ value: "Faux" },
]

export function getDefaultQuestion(question: {
	title?: string
	type?: QuestionType
	answers?: AnswerObject[]
	surveyId: number
}): {
	title: string
	type: QuestionType
	answers: AnswerObject[]
	surveyId: number
} {
	const type = question.type ?? TypesOfQuestion.Text
	let defaultAnswers: AnswerObject[] = []
	const isNotAnswers = !question.answers || question.answers.length === 0
	const isQuestionMultipleTypes =
		type === TypesOfQuestion.Select ||
		type === TypesOfQuestion.Multiple_Choice

	if (isNotAnswers) {
		if (isQuestionMultipleTypes) {
			defaultAnswers = DEFAULT_ANSWERS_MULTIPLE
		} else if (type === TypesOfQuestion.Boolean) {
			defaultAnswers = DEFAULT_ANSWERS_BOOLEAN
		}
	}
	return {
		title: question.title ?? "Nouvelle question",
		type: type,
		answers: question.answers ?? defaultAnswers,
		surveyId: question.surveyId,
	}
}

export function useQuestions() {
	const [
		createQuestionMutation,
		{
			loading: isCreateQuestionLoading,
			error: createQuestionError,
			reset: resetCreateQuestionError,
		},
	] = useMutation(CREATE_QUESTION, {
		refetchQueries: [GET_SURVEY],
	})

	const [
		updateQuestionMutation,
		{
			loading: isUpdateQuestionLoading,
			error: updateQuestionError,
			reset: resetUpdateQuestionError,
		},
	] = useMutation(UPDATE_QUESTION)

	const [
		deleteQuestionMutation,
		{
			loading: isDeleteQuestionLoading,
			error: deleteQuestionError,
			reset: resetDeleteQuestionError,
		},
	] = useMutation(DELETE_QUESTION)

	const addQuestion = async (question: CreateQuestionInput) => {
		if (isCreateQuestionLoading) return // Prevent multiple submissions
		const completedQuestion = getDefaultQuestion(question)

		const result = await createQuestionMutation({
			variables: { data: completedQuestion },
		})

		return result.data?.createQuestion
	}

	const updateQuestion = async (question: UpdateQuestionInput) => {
		if (isUpdateQuestionLoading) return // Prevent multiple submissions
		// Clean answers if question type is Text
		if (question.type === TypesOfQuestion.Text) {
			question.answers = []
		}

		const result = await updateQuestionMutation({
			variables: { data: question },
			refetchQueries: [
				{
					query: GET_QUESTION,
					variables: { questionId: question.id },
				},
			],
			awaitRefetchQueries: true,
		})

		return result
	}
	const deleteQuestion = async (id: number, surveyId: number) => {
		if (isDeleteQuestionLoading) return // Prevent multiple submissions
		const result = await deleteQuestionMutation({
			variables: { deleteQuestionId: id },
			refetchQueries: [
				{
					query: GET_SURVEY,
					variables: { surveyId },
				},
			],
			awaitRefetchQueries: true,
		})

		return result
	}

	return {
		addQuestion,
		isCreateQuestionLoading,
		createQuestionError,
		resetCreateQuestionError,

		updateQuestion,
		isUpdateQuestionLoading,
		updateQuestionError,
		resetUpdateQuestionError,

		deleteQuestion,
		isDeleteQuestionLoading,
		deleteQuestionError,
		resetDeleteQuestionError,
	}
}

export function useQuestion(questionId?: number) {
	const { data, loading, error, refetch } = useQuery<{
		question: QuestionUpdate // @TODO check if type ok
	}>(GET_QUESTION, {
		variables: { questionId },
		skip: !questionId, // Skip the query if questionId is not provided
	})

	const refetchQuestion = async (id: number) => {
		if (!id) return null
		const result = await refetch?.({ questionId: id })
		return result?.data?.question
	}

	return {
		question: data?.question,
		loading,
		error,
		refetchQuestion,
	}
}

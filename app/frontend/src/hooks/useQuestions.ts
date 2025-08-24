import {
	CREATE_QUESTION,
	DELETE_QUESTION,
	GET_QUESTION,
	UPDATE_QUESTION,
} from "@/graphql/survey/question"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { Question, QuestionType, TypesOfQuestion } from "@/types/types"
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
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

	return {
		title: question.title ?? "Nouvelle question",
		type,
		answers: question.answers ?? [],
		surveyId: question.surveyId,
	}
}

export function useQuestions() {
	// const [
	// 	createQuestionMutation,
	// 	{
	// loading: isCreateQuestionLoading,
	// error: createQuestionError,
	// reset: resetCreateQuestionError,
	// 	},
	// ] = useMutation(
	// 	CREATE_QUESTION
	// 	// 	{
	// 	// 	refetchQueries: [GET_SURVEY],
	// 	// }
	// )
	const [
		createQuestionMutation,
		{
			loading: isCreateQuestionLoading,
			error: createQuestionError,
			reset: resetCreateQuestionError,
		},
	] = useMutation(CREATE_QUESTION, {
		onCompleted: data => {
			console.log("GET_SURVEY complete", data)
		},
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

	const [fetchQuestionById] = useLazyQuery(GET_QUESTION)

	const addQuestion = async (question: CreateQuestionInput) => {
		if (isCreateQuestionLoading) return
		const completedQuestion = getDefaultQuestion(question)
		const result = await createQuestionMutation({
			variables: { data: completedQuestion },
			update: (cache, { data }) => {
				const newQuestion = data?.createQuestion
				if (!newQuestion) return

				cache.modify({
					id: cache.identify({
						__typename: "Survey",
						id: completedQuestion.surveyId,
					}),
					fields: {
						questions(existingQuestionsRefs = []) {
							const newQuestionRef = cache.writeFragment({
								data: newQuestion,
								fragment: gql`
									fragment NewQuestion on Questions {
										id
										title
										type
										answers {
											value
										}
									}
								`,
							})

							return [...existingQuestionsRefs, newQuestionRef]
						},
					},
				})
			},
		})

		const newQuestion = result.data?.createQuestion

		if (newQuestion?.id) {
			const { data } = await fetchQuestionById({
				variables: { questionId: newQuestion.id },
			})

			return data?.question || newQuestion
		}

		return newQuestion
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
		question: Question
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

// @TODO add hook to get questions by Survey id

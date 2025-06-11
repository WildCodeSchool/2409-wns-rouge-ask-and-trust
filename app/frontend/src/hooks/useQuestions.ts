import { useMutation } from "@apollo/client"
import { CREATE_QUESTION } from "@/graphql/question"
import { useState } from "react"
import { Question } from "@/types/types"
import { GET_SURVEYS } from "@/graphql/survey"

export type CreateQuestionInput = {
	content: string
	answers: string
}

export function useQuestions() {
	const [questions, setQuestions] = useState<Question[]>([])

	const [createQuestionMutation, { loading: isLoading, error }] = useMutation(CREATE_QUESTION, {
    refetchQueries: [GET_SURVEYS]
  })

	const addQuestion = async (input: CreateQuestionInput) => {
			const result = await createQuestionMutation({
				variables: { content: input },
			})
			if (result.data?.createQuestion) {
				setQuestions(prev => [...prev, result.data.createQuestion])
			}
			return result.data?.createQuestion
	}

	// updateQuestion, deleteQuestion à implémenter si besoin

	return {
		questions,
		addQuestion,
		isLoading,
		error,
	}
}

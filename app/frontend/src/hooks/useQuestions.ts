import { useMutation } from "@apollo/client"
import { CREATE_QUESTION } from "@/graphql/question"
import { useState } from "react"
import { Question } from "@/types/types"

export type CreateQuestionInput = {
	content: string
	answers: string
}

export function useQuestions() {
	const [questions, setQuestions] = useState<Question[]>([])
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const [createQuestionMutation] = useMutation(CREATE_QUESTION)

	const addQuestion = async (input: CreateQuestionInput) => {
		setIsLoading(true)
		setError(null)
		try {
			const result = await createQuestionMutation({
				variables: { content: input },
			})
			// Ajoute la question localement pour affichage immédiat
			if (result.data?.createQuestion) {
				setQuestions(prev => [...prev, result.data.createQuestion])
			}
			return result.data?.createQuestion
		} catch {
			setError("Erreur lors de l'ajout de la question.")
		} finally {
			setIsLoading(false)
		}
	}

	// updateQuestion, deleteQuestion à implémenter si besoin

	return {
		questions,
		addQuestion,
		isLoading,
		error,
	}
}

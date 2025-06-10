import { useQuery, useMutation } from "@apollo/client"
import { GET_SURVEYS, CREATE_SURVEY, UPDATE_SURVEY } from "@/graphql/survey"
import { useState, useEffect } from "react"
import { CreateSurveyInput } from "@/types/types"

// Number of items per page (modifiable as needed)
const PAGE_SIZE = 10

/**
 * Hook for the survey management.
 */
export function useSurvey() {
	const [page, setPage] = useState(1)
	const [surveys, setSurveys] = useState<CreateSurveyInput[]>([])
	const [error, setError] = useState<string | null>(null)

	// Apollo hooks
	const { data, loading, refetch } = useQuery(GET_SURVEYS)
	const [createSurveyMutation] = useMutation(CREATE_SURVEY)
	const [updateSurveyMutation] = useMutation(UPDATE_SURVEY)

	useEffect(() => {
		if (data && data.surveys) {
			setSurveys(data.surveys)
		}
	}, [data])

	const totalPages = Math.ceil(surveys.length / PAGE_SIZE)

	// Client-side pagination (should be improved on the backend if needed)
	const paginatedSurveys = surveys.slice(
		(page - 1) * PAGE_SIZE,
		page * PAGE_SIZE
	)

	const fetchSurveys = async () => {
		try {
			await refetch()
		} catch {
			setError("Error while loading surveys.")
		}
	}

	const addSurvey = async (survey: CreateSurveyInput): Promise<{ id: string } | undefined> => {
		setError(null)
		try {
			const result = await createSurveyMutation({ variables: { data: survey } })
			await refetch()
			//@note On suppose que la mutation retourne { data: { createSurvey: { id: ... } } }
			return result.data?.createSurvey
		} catch {
			setError("Error while adding the survey.")
		}
	}

	const updateSurvey = async (id: string, survey: Partial<CreateSurveyInput>) => {
		setError(null)
		try {
			await updateSurveyMutation({ variables: { id, data: survey } })
			await refetch()
		} catch {
			setError("Error while updating the survey.")
		}
	}

	// Deletion to be added on backend and frontend
	// const deleteSurvey = async (id: string) => {
	// 	setError("Deletion not implemented on the backend.")
	// }

	return {
		surveys: paginatedSurveys,
		isLoading: loading,
		error,
		page,
		totalPages,
		fetchSurveys,
		addSurvey,
		updateSurvey,
		//deleteSurvey,
		setPage,
	}
}

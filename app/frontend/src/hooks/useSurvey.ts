import { useQuery, useMutation } from "@apollo/client"
import { GET_SURVEYS, CREATE_SURVEY, UPDATE_SURVEY } from "@/graphql/survey/survey"
import { useState, useEffect } from "react"
import { CreateSurveyInput, UpdateSurveyType } from "@/types/types"

// Number of items per page (modifiable as needed)
const PAGE_SIZE = 10

/**
 * Hook for the survey management.
 */
export function useSurvey() {
	const [page, setPage] = useState(1)
	const [surveys, setSurveys] = useState<CreateSurveyInput[]>([])

	// Apollo hooks
	const { data, loading: isFetching, refetch } = useQuery(GET_SURVEYS)
	const [createSurvey, { loading: isCreating, error: createError }] =
		useMutation(CREATE_SURVEY, {
			refetchQueries: [{ query: GET_SURVEYS }],
		})
	const [updateSurveyMutation, { loading: isUpdating, error: updateError }] =
		useMutation(UPDATE_SURVEY, {
			refetchQueries: [{ query: GET_SURVEYS }],
		})

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
		await refetch()
	}

	const addSurvey = async (
		survey: CreateSurveyInput
	): Promise<{ id: string } | undefined> => {
		const result = await createSurvey({
			variables: { data: survey },
		})
		return result.data?.createSurvey
	}

	const updateSurvey = async (
		id: string,
		survey: Partial<UpdateSurveyType>
	) => {
		const result = await updateSurveyMutation({
			variables: {
				data: {
					...survey,
					id
				}
			}
		})
		return result.data?.updateSurvey
	}

	// Deletion to be added on backend and frontend
	// const deleteSurvey = async (id: string) => {
	// 	// Not implemented
	// }

	return {
		surveys: paginatedSurveys,
		isFetching,
		isCreating,
		isUpdating,
		createError,
		updateError,
		page,
		totalPages,
		fetchSurveys,
		addSurvey,
		updateSurvey,
		//deleteSurvey,
		setPage,
	}
}

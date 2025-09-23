import { useState, useCallback } from "react"
import { useQuery } from "@apollo/client"
import {
	GET_SURVEY_RESPONSES,
	GET_SURVEY_RESPONSE,
	GET_SURVEY_RESPONSE_STATS,
} from "@/graphql/survey/responses"
import {
	SurveyResponsesResult,
	SurveyResponse,
	SurveyResponseStats,
	SurveyResponsesQueryInput,
	ResponseSortField,
	SortDirection,
} from "@/types/types"

/**
 * Hook for managing survey responses
 */
export function useSurveyResponses(surveyId: number) {
	const [filters, setFilters] = useState<SurveyResponsesQueryInput>({
		page: 1,
		limit: 15,
		sortBy: ResponseSortField.SubmittedAt,
		sortDirection: SortDirection.Desc,
	})

	// Query for paginated responses
	const {
		data: responsesData,
		loading: isLoadingResponses,
		error: responsesError,
		refetch: refetchResponses,
	} = useQuery<{ surveyResponses: SurveyResponsesResult }>(
		GET_SURVEY_RESPONSES,
		{
			variables: { surveyId, filters },
			skip: !surveyId,
			errorPolicy: "all",
		}
	)

	// Query for statistics
	const {
		data: statsData,
		loading: isLoadingStats,
		error: statsError,
	} = useQuery<{ surveyResponseStats: SurveyResponseStats }>(
		GET_SURVEY_RESPONSE_STATS,
		{
			variables: { surveyId },
			skip: !surveyId,
			errorPolicy: "all",
		}
	)

	// Update filters and refetch
	const updateFilters = useCallback(
		(newFilters: Partial<SurveyResponsesQueryInput>) => {
			setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
		},
		[]
	)

	// Pagination helpers
	const goToPage = useCallback((page: number) => {
		setFilters(prev => ({ ...prev, page }))
	}, [])

	const nextPage = useCallback(() => {
		if (responsesData?.surveyResponses.hasNextPage) {
			setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))
		}
	}, [responsesData?.surveyResponses.hasNextPage])

	const previousPage = useCallback(() => {
		if (responsesData?.surveyResponses.hasPreviousPage) {
			setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))
		}
	}, [responsesData?.surveyResponses.hasPreviousPage])

	return {
		// Data
		responses: responsesData?.surveyResponses,
		stats: statsData?.surveyResponseStats,

		// Loading states
		isLoadingResponses,
		isLoadingStats,

		// Errors
		responsesError,
		statsError,

		// Filters and pagination
		filters,
		updateFilters,
		goToPage,
		nextPage,
		previousPage,

		// Actions
		refetchResponses,
	}
}

/**
 * Hook for getting a single survey response
 */
export function useSurveyResponse(surveyId: number, userId: number) {
	const { data, loading, error, refetch } = useQuery<{
		surveyResponse: SurveyResponse
	}>(GET_SURVEY_RESPONSE, {
		variables: { surveyId, userId },
		skip: !surveyId || !userId,
		errorPolicy: "all",
	})

	return {
		response: data?.surveyResponse,
		isLoading: loading,
		error,
		refetch,
	}
}

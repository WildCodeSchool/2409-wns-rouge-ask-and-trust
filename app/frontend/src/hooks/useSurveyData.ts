import { GET_SURVEY } from "@/graphql/survey/survey"
import { Survey } from "@/types/types"
import { useQuery } from "@apollo/client"

/**
 * Hook to get survey's data.
 * If you need to handle multiple surveys, use useSurveysData()
 */
export function useSurveyData(surveyId?: string) {
	const {
		data: surveyData,
		loading: isLoadingSurvey,
		error: surveyError,
		refetch: refetchSurvey,
	} = useQuery<{ survey: Survey }>(GET_SURVEY, {
		variables: { surveyId: surveyId },
		skip: !surveyId,
	})

	return {
		survey: surveyData?.survey,
		isLoadingSurvey,
		surveyError,
		refetchSurvey,
	}
}

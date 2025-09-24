import { GET_SURVEY } from "@/graphql/survey/survey"
import { Survey } from "@/types/types"
import { useQuery } from "@apollo/client"

/**
 * Hook to fetch a single survey's data by its ID.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch survey details.
 * If `surveyId` is not provided, the query is skipped.
 * For fetching multiple surveys, consider using `useSurveysData()`.
 *
 * @param {string} [surveyId] - Optional survey ID to fetch
 * @returns {Object} An object containing survey data and query state
 *
 * @property {Survey | undefined} survey - The survey object returned by the query, or undefined if not loaded
 * @property {boolean} isLoadingSurvey - Loading state of the query
 * @property {Error | undefined} surveyError - Error returned by the query, if any
 * @property {() => Promise<void>} refetchSurvey - Function to manually refetch the survey data
 *
 * @example
 * ```ts
 * const { survey, isLoadingSurvey, surveyError, refetchSurvey } = useSurveyData("abc123");
 *
 * if (isLoadingSurvey) return <p>Loading...</p>;
 * if (surveyError) return <p>Error: {surveyError.message}</p>;
 *
 * return (
 *   <div>
 *     <h1>{survey?.title}</h1>
 *     <p>{survey?.description}</p>
 *     <button onClick={() => refetchSurvey()}>Refresh</button>
 *   </div>
 * );
 * ```
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

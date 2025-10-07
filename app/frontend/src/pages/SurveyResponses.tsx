import { useParams, Navigate } from "react-router-dom"
import { SurveyResponsesContainer } from "../components/sections/survey-responses/SurveyResponsesContainer"
import { useAuthContext } from "../hooks/useAuthContext"
import { withSEO } from "@/components/hoc/withSEO"
import { useSurveyData } from "@/hooks/survey/useSurveyData"

/**
 * Page for viewing survey responses
 * Only accessible to survey owners and admins
 */
function SurveyResponses() {
	const { surveyId } = useParams<{ surveyId: string }>()
	const { user } = useAuthContext()

	// Parse survey ID
	const parsedSurveyId = surveyId ? parseInt(surveyId, 10) : null

	// Get survey data to check ownership
	const { survey, isLoadingSurvey, surveyError } = useSurveyData(
		parsedSurveyId?.toString()
	)

	// Show loading state
	if (isLoadingSurvey) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
					<p className="text-gray-600">Chargement...</p>
				</div>
			</div>
		)
	}

	// Handle errors
	if (surveyError) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="mb-4 text-red-600">
						Erreur lors du chargement du sondage
					</p>
					<p className="text-sm text-gray-600">
						{surveyError.message}
					</p>
				</div>
			</div>
		)
	}

	// Check if survey exists
	if (!survey) {
		return <Navigate to="/surveys" replace />
	}

	// Check authorization
	const isAuthorized =
		user && (user.role === "admin" || user.id === survey.user.id.toString())

	if (!isAuthorized) {
		throw new Response("Forbidden", { status: 403 })
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-7xl">
				<SurveyResponsesContainer surveyId={parsedSurveyId!} />
			</div>
		</div>
	)
}

const SurveyResponsesWithSEO = withSEO(SurveyResponses, "surveyResponses")
export default SurveyResponsesWithSEO

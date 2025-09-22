import { useParams, Navigate } from "react-router-dom"
import { SurveyResponsesContainer } from "../components/sections/survey-responses/SurveyResponsesContainer"
import { useAuthContext } from "../hooks/useAuthContext"
import { useSurvey } from "../hooks/useSurvey"

/**
 * Page for viewing survey responses
 * Only accessible to survey owners and admins
 */
export default function SurveyResponses() {
	const { surveyId } = useParams<{ surveyId: string }>()
	const { user } = useAuthContext()

	// Parse survey ID
	const parsedSurveyId = surveyId ? parseInt(surveyId, 10) : null

	// Get survey data to check ownership
	const {
		survey,
		surveyLoading: isLoadingSurvey,
		surveyError,
	} = useSurvey({ surveyId: parsedSurveyId?.toString() || "0" })

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
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-50">
				<div className="text-center">
					<h1 className="mb-4 text-2xl font-bold text-gray-900">
						Accès non autorisé
					</h1>
					<p className="mb-6 text-gray-600">
						Vous n'avez pas les permissions nécessaires pour
						consulter les réponses de ce sondage.
					</p>
					<button
						onClick={() => window.history.back()}
						className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					>
						Retour
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-7xl">
				<SurveyResponsesContainer surveyId={parsedSurveyId!} />
			</div>
		</div>
	)
}

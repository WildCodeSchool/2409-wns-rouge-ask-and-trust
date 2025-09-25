import { withSEO } from "@/components/hoc/withSEO"
import { useSurvey } from "@/hooks/useSurvey"
import { useParams } from "react-router-dom"
import { useAuthContext } from "@/hooks/useAuthContext"
import HeaderPreview from "@/components/sections/surveys/preview/HeaderPreview"
import ContentPreview from "@/components/sections/surveys/preview/ContentPreview"

function PreviewSurveyPage() {
	const { id } = useParams<{ id: string }>()
	const { user } = useAuthContext()

	const { survey, surveyLoading, surveyError } = useSurvey({ surveyId: id })
	const isOwner = user && survey && user.id === survey.user.id

	if (surveyLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div>Chargement de l'enquête...</div>
			</div>
		)
	}

	if (id) {
		if (!survey && surveyError) {
			const isNotFoundError = surveyError.graphQLErrors.some(error =>
				error.message.includes("Failed to fetch survey")
			)

			if (isNotFoundError) {
				throw new Response("Survey not found", { status: 404 })
			}

			// Pour les autres erreurs GraphQL
			throw new Response("Error loading survey", { status: 500 })
		}

		if (!surveyLoading && !survey) {
			throw new Response("Survey not found", { status: 404 })
		}
	}

	return (
		survey && (
			<div className="bg-black-50 min-h-[calc(100vh_-_var(--header-height))]">
				<HeaderPreview isOwner={isOwner} id={id} survey={survey} />
				<ContentPreview survey={survey} />
			</div>
		)
	)
}

const PreviewSurveyWithSEO = withSEO(PreviewSurveyPage, "previewSurvey")
export default PreviewSurveyWithSEO

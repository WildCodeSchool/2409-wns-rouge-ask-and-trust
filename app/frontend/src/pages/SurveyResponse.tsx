import { useDynamicSEO, withSEO } from "@/components/hoc/withSEO"
import ContentResponse from "@/components/sections/surveys/response/ContentResponse"
import HeaderResponse from "@/components/sections/surveys/response/HeaderResponse"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"
import { useSurvey } from "@/hooks/useSurvey"
import { useParams } from "react-router-dom"

function SurveyResponse() {
	const { id: surveyId } = useParams<{ id: string }>()
	const { user } = useAuthContext()
	const { copyToClipboard } = useCopyClipboard()

	const { survey, surveyLoading, surveyError } = useSurvey({
		surveyId: surveyId,
	})

	const isOwner = user && survey && user.id === survey.user.id

	// Update SEO dynamically when survey data is loaded
	useDynamicSEO(
		"surveyResponse",
		survey
			? { title: survey.title, description: survey.description }
			: undefined
	)

	if (surveyLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div>Chargement de l'enquête...</div>
			</div>
		)
	}

	if (surveyError) {
		// Let ErrorElement handle GraphQL errors
		throw new Response("Survey not found", { status: 404 })
	}

	if (!survey) {
		// Let ErrorElement handle survey absence
		throw new Response("Survey not found", { status: 404 })
	}

	const questions = survey.questions?.length > 0

	const onClickCopy = () => {
		if (!surveyId) return

		const surveyUrl = `${window.location.origin}/surveys/respond/${surveyId}`
		copyToClipboard(surveyUrl)
	}

	return (
		<div className="bg-black-50 min-h-[calc(100vh_-_var(--header-height))]">
			<HeaderResponse
				onClickCopy={onClickCopy}
				survey={survey}
				isOwner={isOwner}
				id={surveyId}
			/>
			<ContentResponse questions={questions} survey={survey} />
		</div>
	)
}

const SurveyResponseWithSEO = withSEO(SurveyResponse, "surveyResponse")
export default SurveyResponseWithSEO

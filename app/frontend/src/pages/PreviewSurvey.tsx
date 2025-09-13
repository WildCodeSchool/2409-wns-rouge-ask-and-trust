import { withSEO } from "@/components/hoc/withSEO"
import QuestionPreview from "@/components/sections/preview/QuestionPreview"
import { Badge } from "@/components/ui/Badge"
import { Callout } from "@/components/ui/Callout"
import { useSurvey } from "@/hooks/useSurvey"
import { Question } from "@/types/types"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

function PreviewSurveyPage() {
	const { id } = useParams<{ id: string }>()
	const { survey, surveyLoading, surveyError } = useSurvey(id)
	const navigate = useNavigate()

	if (id && surveyLoading) {
		return (
			<div className="flex items-center justify-center">
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

	const isDraft = survey.status === "draft"
	const buttonProps = isDraft
		? {
				to: `/surveys/build/${id}`,
				ariaLabel: "Retour sur la page de modification de l'enquête",
			}
		: {
				onClick: () => navigate(-1),
				ariaLabel: "Retour sur la page précédente",
			}

	return (
		survey && (
			<div className="mx-auto max-w-2xl rounded bg-white p-8 shadow">
				<div className="mb-4">
					<Button
						variant="ghost"
						size="sm"
						{...buttonProps}
						icon={ArrowLeft}
					>
						Retour
					</Button>
				</div>
				<h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
					{survey.title}
					<Badge variant="secondary">
						{typeof survey.category === "object"
							? survey.category.name
							: survey.category}
					</Badge>
				</h1>
				<Callout type="info" title="Description">
					{survey.description}
				</Callout>
				<h2 className="my-4 text-lg font-bold">Questions :</h2>
				{/* Render questions */}
				{surveyLoading ? (
					<p>Chargement...</p>
				) : survey.questions && survey.questions.length > 0 ? (
					survey.questions.map((q: Question) => (
						<QuestionPreview key={q.id} question={q} />
					))
				) : (
					<p>Aucune question à afficher.</p>
				)}
			</div>
		)
	)
}

const PreviewSurveyWithSEO = withSEO(PreviewSurveyPage, "previewSurvey")
export default PreviewSurveyWithSEO

import { withSEO } from "@/components/hoc/withSEO"
import QuestionPreview from "@/components/sections/preview/QuestionPreview"
import { Badge } from "@/components/ui/Badge"
import { Callout } from "@/components/ui/Callout"
import { useSurvey } from "@/hooks/useSurvey"
import { Question } from "@/types/types"
import { useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

function PreviewSurveyPage() {
	const { id } = useParams<{ id: string }>()
	// @TODO add a better error and loading components
	const { survey, surveyLoading, surveyError } = useSurvey(id)

	if (surveyError) {
		return <p>erreur pour fetch l'enquête</p>
	}

	return (
		survey && (
			<div className="mx-auto max-w-2xl rounded bg-white p-8 shadow">
				<div className="mb-4 flex items-center justify-between gap-5">
					<Button
						variant="ghost"
						size="sm"
						to={`/surveys/build/${id}`}
						icon={ArrowLeft}
						ariaLabel="Retour sur la page de modification de l'enquête"
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
				<h2 className="mb-4 text-lg font-bold">Questions :</h2>
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

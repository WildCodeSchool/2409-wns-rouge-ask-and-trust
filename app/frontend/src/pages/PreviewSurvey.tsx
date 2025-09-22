import { withSEO } from "@/components/hoc/withSEO"
import QuestionPreview from "@/components/sections/preview/QuestionPreview"
import { Badge } from "@/components/ui/Badge"
import { Callout } from "@/components/ui/Callout"
import { useSurvey } from "@/hooks/useSurvey"
import { Question } from "@/types/types"
import { useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useAuthContext } from "@/hooks/useAuthContext"

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
				<section className="bg-white shadow-sm">
					<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
						<div className="mb-4 flex items-center justify-between gap-4">
							<Button
								variant="ghost"
								size="sm"
								to="/surveys"
								icon={ArrowLeft}
								ariaLabel="Retour sur la page d'accueil"
							>
								Retour
							</Button>
							<div className="flex items-center justify-center gap-4">
								{isOwner && (
									<Button
										to={`/surveys/build/${id}`}
										ariaLabel="Aller sur la page de modification de l'enquête"
										size="sm"
									>
										Modifier l'enquête
									</Button>
								)}
							</div>
						</div>

						<div className="mb-4 flex items-center gap-3">
							<h1 className="text-fg text-3xl font-bold">
								{survey.title}
							</h1>
							<Badge variant="secondary">
								{survey.category.name}
							</Badge>
						</div>

						{survey.description && (
							<Callout type="info" title="Description">
								{survey.description}
							</Callout>
						)}
					</div>
				</section>
				{/* Survey Content */}
				<section className="mx-auto max-w-4xl px-4 py-8 max-md:pb-[calc(var(--footer-height)+32px)] sm:px-6 lg:px-8">
					<div className="rounded-lg bg-white p-6 shadow">
						{survey.questions && survey.questions.length > 0 ? (
							<>
								<div className="mb-6">
									<h2 className="text-fg mb-2 text-xl font-semibold">
										Questions de l'enquête
									</h2>
									<p className="text-sm">
										Veuillez répondre à toutes les questions
										ci-dessous.
									</p>
								</div>
								<div className="mb-8 flex flex-col gap-8">
									{survey.questions.map((q: Question) => (
										<QuestionPreview
											key={q.id}
											question={q}
										/>
									))}
								</div>
							</>
						) : (
							<div className="py-12 text-center">
								<p className="text-destructive-medium">
									Cette enquête ne contient pas encore de
									questions.
								</p>
							</div>
						)}
						{survey.questions && survey.questions.length > 0 && (
							<div className="flex w-full flex-col items-center justify-center gap-6 border-t pt-8">
								<div className="flex justify-center">
									<Button
										type="submit"
										variant="disabled"
										className="px-8"
										ariaLabel="Envoyer mes réponses"
									>
										Envoyer mes réponses
									</Button>
								</div>

								<div className="text-destructive-medium text-center text-xs">
									Vos réponses seront utilisées uniquement à
									des fins d'enquête.
								</div>
							</div>
						)}
					</div>
				</section>
			</div>
		)
	)
}

const PreviewSurveyWithSEO = withSEO(PreviewSurveyPage, "previewSurvey")
export default PreviewSurveyWithSEO

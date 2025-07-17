import { GET_SURVEY } from "@/graphql/survey/survey"
import { useQuery } from "@apollo/client"
import { Helmet } from "react-helmet"
import { useNavigate, useParams } from "react-router-dom"
import { Badge } from "@/components/ui/Badge"
import { Callout } from "@/components/ui/Callout"
import { Button } from "@/components/ui/Button"
import { ArrowLeft } from "lucide-react"
import SurveyResponseForm from "@/components/sections/response/SurveyResponseForm"
import { SurveyWithCategory } from "@/types/types"

export default function SurveyResponse() {
	const { id: surveyId } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const {
		data: surveyData,
		loading: surveyLoading,
		error: surveyError,
	} = useQuery<{ survey: SurveyWithCategory }>(GET_SURVEY, {
		variables: { surveyId: surveyId },
		skip: !surveyId,
	})

	const survey = surveyData?.survey

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

	return (
		<>
			<Helmet>
				<title>{survey.title} - Répondre à l'enquête</title>
				<meta
					name="description"
					content={`Répondez à l'enquête: ${survey.description}`}
				/>
				<meta name="robots" content="noindex, nofollow" />
				<meta
					property="og:title"
					content={`${survey.title} - Enquête`}
				/>
				<meta property="og:description" content={survey.description} />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:title"
					content={`${survey.title} - Enquête`}
				/>
				<meta name="twitter:description" content={survey.description} />
			</Helmet>

			<div className="bg-black-50 min-h-screen">
				{/* Header Section */}
				<section className="bg-white shadow-sm">
					<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
						<div className="mb-4 flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => navigate(-1)}
								icon={ArrowLeft}
								ariaLabel="Retour"
							>
								Retour
							</Button>
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
				<section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="rounded-lg bg-white p-6 shadow">
						{survey.questions?.length > 0 ? (
							<SurveyResponseForm
								surveyId={survey.id}
								questions={survey.questions}
							/>
						) : (
							<div className="py-12 text-center">
								<p className="text-destructive-medium">
									Cette enquête ne contient pas encore de
									questions.
								</p>
							</div>
						)}
					</div>
				</section>
			</div>
		</>
	)
}

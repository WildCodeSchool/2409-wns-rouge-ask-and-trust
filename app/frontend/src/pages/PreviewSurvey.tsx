import { Helmet } from "react-helmet"
import QuestionPreview from "@/components/sections/preview/QuestionPreview"
import { useSurvey } from "@/hooks/useSurvey"
import { Question } from "@/types/types"
import {
	mockSurvey,
	SurveyPreview,
} from "@/components/sections/preview/mockSurvey"
import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/Badge"
import { Callout } from "@/components/ui/Callout"

export default function PreviewSurveyPage() {
	const { id } = useParams<{ id: string }>()
	const { allSurveys, isFetching } = useSurvey()

	// Backend allSurveys only
	const backendSurveys: SurveyPreview[] = allSurveys.map(s => ({
		...s,
		public: true,
		questions: [],
	}))

	// Select survey by ID or use mock as default
	const selectedSurvey =
		id === "template"
			? mockSurvey
			: backendSurveys.find((_, index) => index.toString() === id) ||
				mockSurvey

	const questions = selectedSurvey.questions

	return (
		<>
			<Helmet>
				<title>Page de prévisualisation</title>
				<meta
					name="description"
					content="Page de prévisualisation d'une nouvelle enquête."
				/>
				<meta name="robots" content="noindex, nofollow" />
				<meta property="og:title" content="Prévisualiser une enquête" />
				<meta
					property="og:description"
					content="Page de prévisualisation d'une nouvelle enquête."
				/>
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:title"
					content="Prévisualiser une enquête"
				/>
				<meta
					name="twitter:description"
					content="Page de prévisualisation d'une nouvelle enquête."
				/>
			</Helmet>
			<div className="mx-auto mt-20 max-w-2xl rounded bg-white p-8 shadow">
				<h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
					{selectedSurvey.title}
					<Badge variant="secondary">
						{typeof selectedSurvey.category === "object"
							? selectedSurvey.category.name
							: selectedSurvey.category}
					</Badge>
				</h1>
				<Callout type="info" title="Description">
					{selectedSurvey.description}
				</Callout>
				<h2 className="mb-4 text-lg font-bold">Questions :</h2>
				{/* Render questions */}
				{isFetching ? (
					<p>Chargement...</p>
				) : Array.isArray(questions) && questions.length > 0 ? (
					questions.map((q: Question) => (
						<QuestionPreview key={q.id} question={q} />
					))
				) : (
					<p>Aucune question à afficher.</p>
				)}
			</div>
		</>
	)
}

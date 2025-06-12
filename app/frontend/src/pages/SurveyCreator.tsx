import { Canvas } from "@/components/sections/canvas/Canvas"
import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { useQuestions } from "@/hooks/useQuestions"
import "@/styles/toolbox.css"
import { Helmet } from "react-helmet"

function SurveyCreator() {
	// @TODO récupérer l'id en url
	// puis useSurvey pour récuperer les infos de survey (notamment les ids des questions)

	// Local state for immediate display
	// const [questions, setQuestions] = useState<
	// 	Array<{ id: string; type: string }>
	// >([])

	// Hook pour la gestion des questions
	const { isCreateQuestionLoading } = useQuestions()
	// const { showToast } = useToast()

	/**
	 * Adds a question via the hook and updates the local state
	 * @param type
	 */

	// @TODO Move it in useQuestion
	const handleAddQuestion = async (type: string) => {
		console.log("type", type)
		// try {
		// 	await addQuestion({
		// 		content: `Nouvelle question (${type})`,
		// 		answers: "[]", // à adapter selon la structure attendue
		// 	})
		// 	setQuestions(prev => [
		// 		...prev,
		// 		{ id: `question-${Date.now()}`, type },
		// 	])
		// 	showToast({
		// 		type: "success",
		// 		title: "Question ajoutée",
		// 		description: "La question a bien été ajoutée à l'enquête.",
		// 	})
		// } catch {
		// 	showToast({
		// 		type: "error",
		// 		title: "Erreur",
		// 		description: "Impossible d'ajouter la question.",
		// 	})
		// }
	}

	// Get Survey

	return (
		<>
			{isCreateQuestionLoading && (
				<div className="loader">Chargement...</div>
			)}
			<Helmet>
				<title>Survey Creator</title>
				<meta
					name="description"
					content="Page de création de l'enquête."
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta property="og:title" content="Création de l'enquête" />
				<meta
					property="og:description"
					content="Page de création de l'enquête."
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Création de l'enquête" />
				<meta
					name="twitter:description"
					content="Page de création de l'enquête."
				/>
			</Helmet>
			<div className="min-h-screen bg-gray-50">
				<header className="bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
						<h1 className="text-2xl font-semibold text-gray-900">
							Création de l'enquête
						</h1>
					</div>
				</header>

				<main className="mx-auto py-6 sm:px-6 lg:px-8">
					<div className="flex h-[calc(100vh-160px)]">
						<Toolbox
							onAddQuestion={handleAddQuestion}
							className="h-full"
						/>
						<div className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
							<Canvas
								className="w-full"
								questions={[]}
								// questions = tableau d'ids
								// onAddQuestion={handleAddQuestion}
							/>
						</div>
					</div>
				</main>
			</div>
		</>
	)
}

export default SurveyCreator

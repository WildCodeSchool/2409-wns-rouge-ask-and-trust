import { Canvas } from "@/components/sections/canvas/Canvas"
import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { GET_SURVEY } from "@/graphql/survey"
import "@/styles/toolbox.css"
import { Survey } from "@/types/types"
import { useQuery } from "@apollo/client"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"

function SurveyCreator() {
	//  Get survey's id from params
	const { id } = useParams()

	// @TODO add errors handling
	const { data, loading: loadingSurvey } = useQuery<{ survey: Survey }>(
		GET_SURVEY,
		{
			variables: {
				surveyId: id,
			},
		}
	)

	/**
	 * Adds a question via the hook and updates the local state
	 * @param type
	 */

	// @TODO Move it in useQuestion
	// const handleAddQuestion = async (type: string) => {
	// 	console.log("type", type)
	// 	// try {
	// 	// 	await addQuestion({
	// 	// 		content: `Nouvelle question (${type})`,
	// 	// 		answers: "[]", // à adapter selon la structure attendue
	// 	// 	})
	// 	// 	setQuestions(prev => [
	// 	// 		...prev,
	// 	// 		{ id: `question-${Date.now()}`, type },
	// 	// 	])
	// 	// 	showToast({
	// 	// 		type: "success",
	// 	// 		title: "Question ajoutée",
	// 	// 		description: "La question a bien été ajoutée à l'enquête.",
	// 	// 	})
	// 	// } catch {
	// 	// 	showToast({
	// 	// 		type: "error",
	// 	// 		title: "Erreur",
	// 	// 		description: "Impossible d'ajouter la question.",
	// 	// 	})
	// 	// }
	// }

	return (
		<>
			{loadingSurvey && <div className="loader">Chargement...</div>}
			{data && (
				<>
					<Helmet>
						<title>Survey Creator</title>
						<meta
							name="description"
							content="Page de création de l'enquête."
						/>
						<meta name="robots" content="noindex, nofollow" />
						{/* Open Graph */}
						<meta
							property="og:title"
							content="Création de l'enquête"
						/>
						<meta
							property="og:description"
							content="Page de création de l'enquête."
						/>
						<meta property="og:type" content="website" />
						{/* Twitter Card */}
						<meta name="twitter:card" content="summary" />
						<meta
							name="twitter:title"
							content="Création de l'enquête"
						/>
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
									onAddQuestion={() => ""} // @TODO put logic inside Toolbox with useQuestions
									className="h-full"
								/>
								<div className="flex-grow overflow-auto p-4 sm:p-6 lg:p-8">
									<Canvas
										className="w-full"
										questions={data?.survey.questions}
									/>
								</div>
							</div>
						</main>
					</div>
				</>
			)}
		</>
	)
}

export default SurveyCreator

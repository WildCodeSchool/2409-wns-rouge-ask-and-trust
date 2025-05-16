import { Toolbox } from "@/components/Toolbox/Toolbox"
import { Helmet } from "react-helmet"
import "@/styles/toolbox.css"
import { Canvas } from "@/components/canvas/Canvas"
import { useState } from "react"

function SurveyCreator() {
	// Lift the questions state up to the parent component
	const [questions, setQuestions] = useState<Array<{ id: string; type: string }>>([])

	/**
	 * @Note [todo] add logic
	 * @param type
	 */
	const handleAddQuestion = (type: string) => {
		console.log(`Adding question of type ${type}`)
		/**
		 * @TEST - add logic to add question
		 */
		setQuestions((prev) => [...prev, { id: `question-${Date.now()}`, type }])
	}

	return (
		<>
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
								questions={questions}
								onAddQuestion={handleAddQuestion}
							/>
						</div>
					</div>
				</main>
			</div>
		</>
	)
}

export default SurveyCreator

import { Helmet } from "react-helmet"

function SurveyCreator() {

	/**
	 * @Note [todo] add logic
	 * @param type 
	 */
	const handleAddQuestion = (type: string) => {
		console.log(`Adding question of type ${type}`)
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
			<div className="min-h-screen">
				<header className="shadow-sm">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<h1 className="text-black-default text-2xl font-semibold">
							Création de l'enquête
						</h1>
					</div>
				</header>
				<main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
					<div className="flex gap-6 h[calc(100vh-160px)]">
						<Toolbox onAddQuestion={handleAddQuestion} className="flex-shrink-0"/>
						{/* Name component of display questions Canvas Or Survey*/}
						{/* <Canvas /> */}
					</div>
				</main>
			</div>
		</>
	)
}

export default SurveyCreator

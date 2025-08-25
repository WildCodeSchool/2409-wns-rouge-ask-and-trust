import { Helmet } from "react-helmet"
import SurveyForm from "@/components/sections/surveys/form/SurveyForm"

function SurveyCreate() {
	return (
		<>
			<Helmet>
				<title>Créer une enquête</title>
				<meta
					name="description"
					content="Page de création d'une nouvelle enquête."
				/>
				<meta name="robots" content="noindex, nofollow" />
				<meta property="og:title" content="Créer une enquête" />
				<meta
					property="og:description"
					content="Page de création d'une nouvelle enquête."
				/>
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Créer une enquête" />
				<meta
					name="twitter:description"
					content="Page de création d'une nouvelle enquête."
				/>
			</Helmet>

			<div className="flex items-center justify-center pt-20 max-md:px-4">
				<SurveyForm />
			</div>
		</>
	)
}

export default SurveyCreate

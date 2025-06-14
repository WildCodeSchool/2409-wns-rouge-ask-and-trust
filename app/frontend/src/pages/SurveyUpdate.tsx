import { Helmet } from "react-helmet"
import SurveyForm from "@/components/sections/surveys/form/SurveyForm"

function SurveyUpdate() {
	return (
		<>
			<Helmet>
				<title>Modifier une enquête</title>
				<meta
					name="description"
					content="Page de modification d'une enquête existante."
				/>
				<meta name="robots" content="noindex, nofollow" />
				<meta property="og:title" content="Modifier une enquête" />
				<meta
					property="og:description"
					content="Page de modification d'une enquête existante."
				/>
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Modifier une enquête" />
				<meta
					name="twitter:description"
					content="Page de modification d'une enquête existante."
				/>
			</Helmet>

			<div className="flex items-center justify-center">
				<SurveyForm />
			</div>
		</>
	)
}

export default SurveyUpdate

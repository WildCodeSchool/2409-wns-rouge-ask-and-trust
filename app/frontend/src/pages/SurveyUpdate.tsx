import { withSEO } from "@/components/hoc/withSEO"
import SurveyForm from "@/components/sections/surveys/form/SurveyForm"

function SurveyUpdate() {
	return (
		<div className="flex items-center justify-center max-md:px-4">
			<SurveyForm />
		</div>
	)
}

const SurveyUpdateWithSEO = withSEO(SurveyUpdate, "surveyUpdate")
export default SurveyUpdateWithSEO

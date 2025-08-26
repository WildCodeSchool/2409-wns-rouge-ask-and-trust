import { withSEO } from "@/components/hoc/withSEO"
import SurveyForm from "@/components/sections/surveys/form/SurveyForm"

function SurveyCreate() {
	return (
		<div className="flex items-center justify-center max-md:px-4">
			<SurveyForm />
		</div>
	)
}

const SurveyCreateWithSEO = withSEO(SurveyCreate, "surveyCreate")
export default SurveyCreateWithSEO

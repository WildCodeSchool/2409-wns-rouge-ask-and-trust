import { withSEO } from "@/components/hoc/withSEO"
import SurveyForm from "@/components/sections/surveys/form/SurveyForm"

function SurveyCreate() {
	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] items-center justify-center max-md:px-4 max-md:pb-[calc(var(--footer-height))]">
			<SurveyForm />
		</div>
	)
}

const SurveyCreateWithSEO = withSEO(SurveyCreate, "surveyCreate")
export default SurveyCreateWithSEO

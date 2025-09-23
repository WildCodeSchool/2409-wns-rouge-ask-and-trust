import SurveyResponseForm from "@/components/sections/response/SurveyResponseForm"
import { SurveyResponseType } from "@/types/types"

export default function ContentResponse({
	questions,
	survey,
}: SurveyResponseType) {
	return (
		<section className="mx-auto max-w-4xl px-4 py-8 max-md:pb-[calc(var(--footer-height)+32px)] sm:px-6 lg:px-8">
			<div className="rounded-lg bg-white p-6 shadow">
				{questions ? (
					<SurveyResponseForm
						surveyId={survey.id}
						questions={survey.questions}
					/>
				) : (
					<div className="py-12 text-center">
						<p className="text-destructive-medium">
							Cette enquête ne contient pas encore de questions.
						</p>
					</div>
				)}
			</div>
		</section>
	)
}

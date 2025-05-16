import SurveyForm from "@/components/sections/surveys/form/SurveyForm"

export default function NewSurvey() {
	return (
		<section className="flex flex-col items-center justify-center gap-10">
			<h1 className="text-2xl font-bold">Créer votre enquête</h1>
			<SurveyForm />
		</section>
	)
}

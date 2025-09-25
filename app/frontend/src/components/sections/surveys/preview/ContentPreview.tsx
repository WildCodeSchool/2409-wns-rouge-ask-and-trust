import QuestionPreview from "@/components/sections/preview/QuestionPreview"
import { Question, SurveyPreviewType } from "@/types/types"
import { Button } from "@/components/ui/Button"

export default function ContentPreview({ survey }: SurveyPreviewType) {
	return (
		<section className="mx-auto max-w-4xl px-4 py-8 max-md:pb-[calc(var(--footer-height)+32px)] sm:px-6 lg:px-8">
			<div className="rounded-lg bg-white p-6 shadow">
				{survey.questions && survey.questions.length > 0 ? (
					<>
						<div className="mb-6">
							<h2 className="text-fg mb-2 text-xl font-semibold">
								Questions de l'enquête
							</h2>
							<p className="text-sm">
								Veuillez répondre à toutes les questions
								ci-dessous.
							</p>
						</div>
						<div className="mb-8 flex flex-col gap-8">
							{survey.questions.map((q: Question) => (
								<QuestionPreview key={q.id} question={q} />
							))}
						</div>
					</>
				) : (
					<div className="py-12 text-center">
						<p className="text-destructive-medium">
							Cette enquête ne contient pas encore de questions.
						</p>
					</div>
				)}
				{survey.questions && survey.questions.length > 0 && (
					<div className="flex w-full flex-col items-center justify-center gap-6 border-t pt-8">
						<div className="flex justify-center">
							<Button
								type="submit"
								variant="disabled"
								className="px-8"
								ariaLabel="Envoyer mes réponses"
							>
								Envoyer mes réponses
							</Button>
						</div>

						<div className="text-destructive-medium text-center text-xs">
							Vos réponses seront utilisées uniquement à des fins
							d'enquête.
						</div>
					</div>
				)}
			</div>
		</section>
	)
}

import { SurveyResponseFormData, Question } from "@/types/types"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/useToast"
import { useAnswers } from "@/hooks/useAnswers"
import { useState, useEffect } from "react"
import InteractiveQuestion from "./InteractiveQuestion"

type SurveyResponseFormProps = {
	surveyId: number
	questions: Question[]
}

export default function SurveyResponseForm({
	surveyId,
	questions,
}: SurveyResponseFormProps) {
	const { showToast } = useToast()
	const {
		submitSurveyResponse,
		deleteAllAnswers,
		isCreatingAnswer,
		isDeletingAnswers,
		createAnswerError,
		deleteAnswersError,
		getExistingAnswersForForm,
		isLoadingAnswers,
	} = useAnswers(surveyId)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors },
		reset,
	} = useForm<SurveyResponseFormData>({
		defaultValues: {},
	})

	const watchedValues = watch()

	// Pré-remplir le formulaire avec les réponses existantes
	useEffect(() => {
		if (!isLoadingAnswers) {
			const existingAnswers = getExistingAnswersForForm()
			if (Object.keys(existingAnswers).length > 0) {
				reset(existingAnswers)
			}
		}
	}, [isLoadingAnswers, reset, getExistingAnswersForForm])

	const onSubmit = async (data: SurveyResponseFormData) => {
		setIsSubmitting(true)
		try {
			// Submit responses to backend
			await submitSurveyResponse({
				surveyId,
				responses: data,
			})

			showToast({
				type: "success",
				title: "Réponse envoyée",
				description: "Merci pour votre participation à cette enquête !",
			})
		} catch (error) {
			console.error("Error submitting survey response:", error)

			showToast({
				type: "error",
				title: "Erreur temporaire",
				description:
					"Vos réponses ont été sauvegardées localement. Le backend nécessite des modifications.",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	// Function to reset both backend and frontend
	const handleReset = async () => {
		try {
			setIsSubmitting(true)

			// Delete from backend
			await deleteAllAnswers()

			// Reset frontend form
			reset()

			showToast({
				type: "success",
				title: "Formulaire réinitialisé",
				description: "Toutes vos réponses ont été supprimées.",
			})
		} catch (error) {
			console.error("Error resetting survey:", error)
			showToast({
				type: "error",
				title: "Erreur",
				description:
					deleteAnswersError?.message ||
					"Impossible de réinitialiser le formulaire.",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="mb-6">
				<h2 className="text-fg mb-2 text-xl font-semibold">
					Questions de l'enquête
				</h2>
				<p className="text-sm">
					Veuillez répondre à toutes les questions ci-dessous.
				</p>
			</div>

			{isLoadingAnswers ? (
				<div className="py-8 text-center">
					<div className="text-fg">
						Chargement de vos réponses précédentes...
					</div>
				</div>
			) : questions.length === 0 ? (
				<div className="text-destructive-medium py-8 text-center">
					Aucune question disponible pour cette enquête.
				</div>
			) : (
				questions.map((question: Question) => (
					<InteractiveQuestion
						key={question.id}
						question={question}
						register={register}
						control={control}
						values={watchedValues}
						setValue={setValue}
						error={errors[`question_${question.id}`]?.message}
					/>
				))
			)}

			{createAnswerError && (
				<div className="bg-destructive-light border-destructive-medium rounded-md border p-3">
					<p className="text-destructive-medium text-sm">
						Erreur lors de l'envoi : {createAnswerError.message}
					</p>
				</div>
			)}

			<div className="flex gap-4 border-t pt-6">
				<Button
					type="submit"
					disabled={isSubmitting || isCreatingAnswer}
					className="flex-1"
					ariaLabel="Envoyer mes réponses"
				>
					{isSubmitting
						? "Envoi en cours..."
						: "Envoyer mes réponses"}
				</Button>

				<Button
					type="button"
					variant="outline"
					onClick={handleReset}
					disabled={
						isSubmitting || isCreatingAnswer || isDeletingAnswers
					}
					ariaLabel="Réinitialiser le formulaire"
				>
					{isDeletingAnswers ? "Suppression..." : "Réinitialiser"}
				</Button>
			</div>

			<div className="text-destructive-medium text-center text-xs">
				Vos réponses seront utilisées uniquement à des fins d'enquête.
			</div>
		</form>
	)
}

import { SurveyResponseFormData, Question } from "@/types/types"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/useToast"
import { useAnswers, type ExistingAnswer } from "@/hooks/useAnswers"
import { useState, useEffect, useMemo } from "react"
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
		isCreatingAnswer,
		createAnswerError,
		existingAnswers: existingAnswersData,
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

	// Detect if the user has already responded to the survey
	const hasExistingResponses =
		existingAnswersData && existingAnswersData.length > 0

	// Format existing responses for the form
	const existingAnswers = useMemo(() => {
		if (!existingAnswersData || existingAnswersData.length === 0) {
			return {}
		}

		const formData: Record<string, string | boolean | string[]> = {}

		existingAnswersData.forEach((answer: ExistingAnswer) => {
			const fieldName = `question_${answer.questionId}`

			// Parse content based on question type
			let value: string | boolean | string[] = answer.content

			switch (answer.question.type) {
				case "boolean":
					value = answer.content === "Oui"
					break
				case "checkbox":
					value = answer.content.includes(", ")
						? answer.content.split(", ")
						: [answer.content]
					break
				case "select":
				case "text":
				case "textarea":
				case "radio":
				default:
					value = answer.content
					break
			}

			formData[fieldName] = value
		})

		return formData
	}, [existingAnswersData])

	// Pre-fill the form with existing responses
	useEffect(() => {
		if (
			!isLoadingAnswers &&
			hasExistingResponses &&
			Object.keys(existingAnswers).length > 0
		) {
			reset(existingAnswers)
		}
	}, [isLoadingAnswers, hasExistingResponses, reset, existingAnswers])

	const onSubmit = async (data: SurveyResponseFormData) => {
		setIsSubmitting(true)
		try {
			// Submit responses to backend
			await submitSurveyResponse({
				surveyId,
				responses: data,
			})

			const successMessage = hasExistingResponses
				? "Vos réponses ont été mises à jour !"
				: "Merci pour votre participation à cette enquête !"

			showToast({
				type: "success",
				title: hasExistingResponses
					? "Réponses modifiées"
					: "Réponse envoyée",
				description: successMessage,
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

	// Dynamic texts based on context
	const buttonText = hasExistingResponses
		? "Modifier mes réponses"
		: "Envoyer mes réponses"
	const loadingText = hasExistingResponses
		? "Modification en cours..."
		: "Envoi en cours..."

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

			<div className="flex justify-center border-t pt-8">
				<Button
					type="submit"
					disabled={isSubmitting || isCreatingAnswer}
					className="px-8"
					ariaLabel={buttonText}
				>
					{isSubmitting ? loadingText : buttonText}
				</Button>
			</div>

			<div className="text-destructive-medium text-center text-xs">
				Vos réponses seront utilisées uniquement à des fins d'enquête.
			</div>
		</form>
	)
}

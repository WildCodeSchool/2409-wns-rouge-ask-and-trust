import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import QuestionTypeSelect from "@/components/sections/surveys/buildSurvey/question/QuestionTypeSelection"
import { Button } from "@/components/ui/Button"
import { UpdateQuestionInput, useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import {
	Question,
	QuestionType,
	QuestionUpdate,
	TypesOfQuestion,
} from "@/types/types"
import { memo, useEffect, useRef } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { BuildQuestionHeader } from "./BuildQuestionHeader"
import { QuestionTitleInput } from "./QuestionTitleInput"
import { RenderAnswersComponent } from "./RenderAnswersComponent"

type QuestionProps = {
	question: Question
	index: number
	surveyId: number
	onClick: () => void
}

function BuildQuestion({ question, index, surveyId, onClick }: QuestionProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isDirty },
		reset,
	} = useForm<QuestionUpdate>({
		defaultValues: {
			title: question.title,
			type: question.type,
			answers: question.answers,
		},
	})

	// Load question update and delete functions from the API
	const {
		updateQuestion,
		updateQuestionError,
		resetUpdateQuestionError,
		deleteQuestionError,
		resetDeleteQuestionError,
	} = useQuestions()

	// Allow to manipulate answers as a dynamic array (no state needed)
	const { fields, append, remove } = useFieldArray({
		control,
		name: "answers",
	})
	const watchedType = useWatch({
		control,
		name: "type",
	})
	const prevTypeRef = useRef<QuestionType>(question.type)
	const { showToast } = useToast()

	// Show error toast if there is an error during question update, delete or load
	// @TODO Refacto add this in useQuestions
	useEffect(() => {
		if (updateQuestionError || deleteQuestionError) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: updateQuestionError
					? "La question n'a pas pu être mise à jour."
					: deleteQuestionError
						? "La question n'a pas pu être supprimée."
						: "Une erreur est survenue pour charger la question.",
			})
			resetUpdateQuestionError()
			resetDeleteQuestionError()
		}
	}, [
		updateQuestionError,
		deleteQuestionError,
		showToast,
		resetUpdateQuestionError,
		resetDeleteQuestionError,
	])

	// Watch if question's type changed
	// If yes, handle default answers for specific types
	useEffect(() => {
		if (!watchedType) return

		const typesWithAnswers = new Set<QuestionType>([
			TypesOfQuestion.Boolean,
			TypesOfQuestion.Radio,
			TypesOfQuestion.Select,
			TypesOfQuestion.Checkbox,
		])

		const isTypeWithAnswers = typesWithAnswers.has(watchedType)

		// If type is Text or TextArea, do nothing
		if (!isTypeWithAnswers) return

		// If type changed
		if (prevTypeRef.current !== watchedType) {
			// Boolean type
			// If no answers, add two empty answers
			// If one answer, add one empty answer
			// If more than two answers, keep only the first two answers
			if (watchedType === TypesOfQuestion.Boolean) {
				if (fields.length === 0) {
					append([{ value: "" }, { value: "" }])
				} else if (fields.length === 1) {
					append([{ value: "" }])
				} else if (fields.length > 2) {
					const firstTwo = fields
						.slice(0, 2)
						.map(f => ({ value: f.value }))
					remove()
					append(firstTwo)
				}
			} else {
				// Other types than Boolean (Radio / Select / Checkbox)
				if (fields.length === 0) {
					append([{ value: "" }, { value: "" }])
				}
				// Do nothing if 1 or more answers
			}
		}

		prevTypeRef.current = watchedType
	}, [watchedType, append, remove, fields])

	// After a successful question load, reset the form with the question data
	// Enable to put back disabled state of the submit button
	useEffect(() => {
		if (!question) return
		reset({
			title: question.title,
			type: question.type,
			answers: question.answers,
		})
	}, [question, reset])

	const handleSubmitForm = async (formData: UpdateQuestionInput) => {
		if (!question?.id) return

		// Format answers to match the expected structure in API
		const formattedAnswers = formData.answers?.map(({ value }) => ({
			value,
		}))

		const { title, type } = formData

		const isTypeText =
			formData.type === TypesOfQuestion.Text ||
			formData.type === TypesOfQuestion.TextArea

		try {
			// Call the updateQuestion function with the formatted data
			await updateQuestion({
				id: question.id,
				title: title,
				type: type,
				answers: isTypeText ? [] : (formattedAnswers ?? []),
			})

			showToast({
				type: "success",
				title: "La question a été mise à jour.",
			})
		} catch (error) {
			console.error("Error updating question:", error)
		}
	}

	if (!question) return null

	return (
		<div className="w-full" onClick={onClick}>
			<FormWrapper
				onSubmit={handleSubmit(handleSubmitForm)}
				className="w-full md:max-w-full"
			>
				<BuildQuestionHeader
					question={{
						id: question.id,
						title: question.title,
						type: question.type,
						index,
						surveyId,
					}}
				/>
				<QuestionTitleInput
					register={register}
					errorsTitle={errors?.title}
				/>
				{watchedType && (
					<>
						<QuestionTypeSelect control={control} errors={errors} />
						<RenderAnswersComponent
							questionType={watchedType}
							register={register}
							errors={errors}
							fields={fields}
							remove={remove}
							append={append}
						/>
					</>
				)}
				<Button
					role="submit"
					type="submit"
					disabled={!isDirty} // Disable button if form is not dirty
					aria-disabled={!isDirty}
					ariaLabel="Enregistrer la question"
					fullWidth
					variant={isDirty ? "primary" : "disabled"}
				>
					Enregistrer
				</Button>
			</FormWrapper>
		</div>
	)
}

export default memo(BuildQuestion, (prev, next) => {
	return (
		prev.question.id === next.question.id &&
		prev.question.title === next.question.title &&
		prev.question.type === next.question.type &&
		prev.index === next.index
	)
})

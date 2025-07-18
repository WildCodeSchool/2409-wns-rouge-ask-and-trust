import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import { BuildListAnswers } from "@/components/sections/surveys/buildSurvey/question/BuildListAnswers"
import QuestionTypeSelect from "@/components/sections/surveys/buildSurvey/question/QuestionTypeSelection"
import { Button } from "@/components/ui/Button"
import {
	UpdateQuestionInput,
	useQuestion,
	useQuestions,
} from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { forwardRef, useEffect, useRef } from "react"
import {
	FieldArrayWithId,
	FieldValues,
	useFieldArray,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	useForm,
	UseFormRegister,
	useWatch,
} from "react-hook-form"
import { BuildQuestionHeader } from "./BuildQuestionHeader"
import { QuestionTitleInput } from "./QuestionTitleInput"

type QuestionProps = {
	questionId: number
	index: number
}

type RenderAnswerComponentProps = {
	questionType: QuestionType
	register: UseFormRegister<QuestionUpdate>
	errors: FieldValues
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[]
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
}

export function RenderAnswerComponent({
	questionType,
	register,
	errors,
	fields,
	remove,
	append,
}: RenderAnswerComponentProps) {
	// Render the appropriate answer component based on the question type
	switch (questionType) {
		case TypesOfQuestion.Text:
		case TypesOfQuestion.TextArea:
			return null
		case TypesOfQuestion.Boolean:
		case TypesOfQuestion.Radio:
		case TypesOfQuestion.Select:
		case TypesOfQuestion.Checkbox:
			return (
				<BuildListAnswers
					register={register}
					errors={errors}
					fields={fields}
					remove={remove}
					append={append}
					questionType={questionType}
				/>
			)
		default:
			throw new Error(`Unsupported question type: ${questionType}`)
	}
}

function BuildQuestion(
	{ questionId, index }: QuestionProps,
	ref: React.Ref<HTMLLIElement> | null
) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<QuestionUpdate>()
	// Load question data from the API
	const {
		question,
		loading,
		error: getQuestionError,
	} = useQuestion(questionId)
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
	const prevTypeRef = useRef<QuestionType>(TypesOfQuestion.Text)
	// const deleteButtonRef = useRef<HTMLButtonElement | null>(null)
	const { showToast } = useToast()

	// Show error toast if there is an error during question update, delete or load
	useEffect(() => {
		if (updateQuestionError || deleteQuestionError || getQuestionError) {
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
		getQuestionError,
	])

	// Reset the form with the current question data
	// This ensures that the form is populated with the latest question data
	useEffect(() => {
		if (question && !loading && !getQuestionError) {
			reset({
				title: question.title,
				type: question.type,
				answers: question.answers,
			})

			// Init reference to the previous type
			prevTypeRef.current = question.type
		}
	}, [loading, getQuestionError, reset, question])

	// If type changed to a multiple type, provide default answers with placeholders

	useEffect(() => {
		if (!watchedType || !question) return
		if (
			watchedType === TypesOfQuestion.Text ||
			watchedType === TypesOfQuestion.TextArea
		)
			return
		const isTypeWithAnswers = [
			TypesOfQuestion.Boolean,
			TypesOfQuestion.Radio,
			TypesOfQuestion.Select,
			TypesOfQuestion.Checkbox,
		].includes(watchedType)

		if (
			prevTypeRef.current !== watchedType &&
			isTypeWithAnswers &&
			fields.length === 0
		) {
			append({ value: "" })
			append({ value: "" })
		}

		prevTypeRef.current = watchedType
	}, [watchedType, append, fields.length, question])

	const handleSubmitForm = async (formData: UpdateQuestionInput) => {
		if (!question?.id) return

		// Format answers to match the expected structure in API
		const formattedAnswers = formData.answers?.map(({ value }) => ({
			value,
		}))

		const { title, type } = formData

		try {
			// Call the updateQuestion function with the formatted data
			await updateQuestion({
				id: question.id,
				title: title,
				type: type,
				answers: formattedAnswers,
			})

			// Reset the form with the updated question data
			reset({
				title: formData.title,
				type: formData.type,
				answers:
					// If the question type is Text, empty answers
					type === TypesOfQuestion.Text
						? []
						: (formattedAnswers ?? []),
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
		<li className="list-none" ref={ref} tabIndex={-1}>
			<FormWrapper
				onSubmit={handleSubmit(handleSubmitForm)}
				className="w-full md:max-w-full"
			>
				{/* Display index, title and delete button */}
				<BuildQuestionHeader
					question={{
						id: question.id,
						title: question.title,
						type: question.type,
						index,
						surveyId: question.survey.id,
					}}
				/>
				<QuestionTitleInput
					register={register}
					errorsTitle={errors?.title}
				/>
				{watchedType && (
					<>
						<QuestionTypeSelect control={control} errors={errors} />
						<RenderAnswerComponent
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
					ariaLabel="Enregistrer la question."
					fullWidth
				>
					Enregistrer
				</Button>
			</FormWrapper>
		</li>
	)
}

export default forwardRef<HTMLLIElement, QuestionProps>(BuildQuestion)

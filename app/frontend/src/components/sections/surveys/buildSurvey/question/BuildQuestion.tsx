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
import { forwardRef, memo, useEffect, useRef } from "react"
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

function BuildQuestion(
	{ question, index, surveyId, onClick }: QuestionProps,
	ref: React.Ref<HTMLLIElement> | null
) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		// reset,
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
	// If yes, add two answers with placeholders for type with answers if no answers yet
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
			// Add two empty answers with a placeholder
			append([{ value: "" }, { value: "" }])
		}

		prevTypeRef.current = watchedType
	}, [append, fields.length, question, watchedType])

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
		<li className="list-none" ref={ref} tabIndex={-1} onClick={onClick}>
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
					ariaLabel="Enregistrer la question."
					fullWidth
				>
					Enregistrer
				</Button>
			</FormWrapper>
		</li>
	)
}

const BuildQuestionWithRef = forwardRef<HTMLLIElement, QuestionProps>(
	BuildQuestion
)

const MemoizedBuildQuestion = memo(
	BuildQuestionWithRef,
	(prevProps, nextProps) => {
		return (
			prevProps.question.id === nextProps.question.id &&
			prevProps.question.title === nextProps.question.title &&
			prevProps.question.type === nextProps.question.type &&
			prevProps.index === nextProps.index
		)
	}
)

export default MemoizedBuildQuestion

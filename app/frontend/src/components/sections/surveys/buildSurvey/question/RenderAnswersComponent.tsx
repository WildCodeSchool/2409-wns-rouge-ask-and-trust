import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import {
	FieldArrayWithId,
	FieldValues,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormRegister,
} from "react-hook-form"
import { BuildListAnswers } from "./BuildListAnswers"

type RenderAnswersComponentProps = {
	questionType: QuestionType
	register: UseFormRegister<QuestionUpdate>
	errors: FieldValues
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[]
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
}

/**
 * Renders answer input fields based on the given question type.
 *
 * Returns:
 * - `null` for free-text questions (Text, TextArea)
 * - A list of editable answer inputs for multiple-choice questions (Boolean, Radio, Select, Checkbox)
 *
 * @param {RenderAnswersComponentProps} props - The props used to render answer inputs.
 * @param {QuestionType} props.questionType - The current type of the question being edited.
 * @param {UseFormRegister<QuestionUpdate>} props.register - react-hook-form's register function for input binding.
 * @param {FieldValues} props.errors - Form validation errors from react-hook-form.
 * @param {FieldArrayWithId<QuestionUpdate, "answers", "id">[]} props.fields - The current list of answer fields.
 * @param {UseFieldArrayRemove} props.remove - Function to remove an answer field.
 * @param {UseFieldArrayAppend<QuestionUpdate, "answers">} props.append - Function to append a new answer field.
 * @returns A JSX element rendering answer fields or `null` if not applicable.
 */
export function RenderAnswersComponent({
	questionType,
	register,
	errors,
	fields,
	remove,
	append,
}: RenderAnswersComponentProps) {
	const shouldRenderAnswers =
		questionType === TypesOfQuestion.Boolean ||
		questionType === TypesOfQuestion.Radio ||
		questionType === TypesOfQuestion.Select ||
		questionType === TypesOfQuestion.Checkbox

	if (!shouldRenderAnswers) return null

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
}

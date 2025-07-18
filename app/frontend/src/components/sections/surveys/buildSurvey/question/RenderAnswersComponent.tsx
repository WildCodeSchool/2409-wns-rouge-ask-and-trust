import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import {
	FieldArrayWithId,
	FieldValues,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormRegister,
} from "react-hook-form"
import { BuildListAnswers } from "./BuildListAnswers"

type RenderAnswerComponentProps = {
	questionType: QuestionType
	register: UseFormRegister<QuestionUpdate>
	errors: FieldValues
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[]
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
}

export function RenderAnswersComponent({
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

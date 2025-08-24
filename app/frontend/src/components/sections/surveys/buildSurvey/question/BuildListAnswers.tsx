import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Legend } from "@/components/ui/Legend"
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { PlusCircle, Trash2 } from "lucide-react"
import {
	FieldArrayWithId,
	FieldValues,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormRegister,
} from "react-hook-form"

/**
 * Component to build and manage a dynamic list of answers for a question.
 *
 * Depending on the question type, it renders input fields for answers,
 * allows adding and removing answers, and adapts behavior for Boolean questions.
 *
 * For Boolean type questions, exactly two answers ("True" and "False") are displayed,
 * and the add/remove buttons are disabled to enforce this constraint.
 *
 * @param {object} props - Component properties
 * @param {FieldArrayWithId<QuestionUpdate, "answers", "id">[]} props.fields - Array of answer fields managed by react-hook-form
 * @param {UseFormRegister<QuestionUpdate>} props.register - react-hook-form's register function for input registration and validation
 * @param {FieldValues} props.errors - Form error object to display validation messages
 * @param {UseFieldArrayRemove} props.remove - Function to remove an answer field by index
 * @param {UseFieldArrayAppend<QuestionUpdate, "answers">} props.append - Function to append a new answer field
 * @param {QuestionType} props.questionType - The type of the question to conditionally render inputs
 *
 * @returns {JSX.Element} The rendered list of answer inputs with add/remove controls
 */

type BuildListAnswersProps = {
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[]
	register: UseFormRegister<QuestionUpdate>
	errors: FieldValues
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
	questionType: QuestionType
}

export function BuildListAnswers({
	fields,
	register,
	errors,
	remove,
	append,
	questionType,
}: BuildListAnswersProps) {
	const getPlaceholder = (index: number): string => {
		switch (questionType) {
			case TypesOfQuestion.Boolean:
				return index === 0 ? "Vrai" : "Faux"
			case TypesOfQuestion.Radio:
			case TypesOfQuestion.Select:
			case TypesOfQuestion.Checkbox:
				return `Réponse ${index + 1}`
			default:
				return `Option ${index + 1}`
		}
	}

	const isBooleanType = questionType === TypesOfQuestion.Boolean

	return (
		<fieldset className="flex flex-col gap-1">
			<Legend>Définir les réponses</Legend>
			{fields.map((field, index) => (
				<div
					key={field.id || `answer-${index}`}
					className="flex items-center gap-2"
				>
					<Input
						id={`answer-${index}`}
						type="text"
						placeholder={getPlaceholder(index)}
						aria-required
						{...register(`answers.${index}.value`, {
							required: "La réponse ne peut pas être vide",
						})}
						aria-invalid={errors?.answers?.[index]}
						errorMessage={errors?.answers?.[index]?.value?.message}
					/>
					{/* Show remove button only if not Boolean */}
					{!isBooleanType && (
						<Button
							type="button"
							variant="ghost_destructive"
							size="square_sm"
							ariaLabel="Supprimer cette réponse"
							onClick={() => remove(index)}
							icon={Trash2}
						/>
					)}
				</div>
			))}
			{!isBooleanType && (
				<Button
					type="button"
					variant="ghost"
					fullWidth
					ariaLabel="Ajouter une réponse"
					icon={PlusCircle}
					onClick={() => append({ value: "" })}
				>
					Ajouter une réponse
				</Button>
			)}
		</fieldset>
	)
}

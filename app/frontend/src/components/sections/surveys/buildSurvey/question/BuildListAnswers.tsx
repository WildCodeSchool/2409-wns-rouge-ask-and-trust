import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { QuestionUpdate } from "@/types/types"
import { PlusCircle, Trash2 } from "lucide-react"
import {
	FieldArrayWithId,
	FieldValues,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormRegister,
} from "react-hook-form"
/**
 * @description
 * This component allows users to define a dynamic list of answer options
 * for a question, such as for a `<select>`, group of checkboxes, or radio buttons.
 *
 * It uses `react-hook-form`'s `useFieldArray` to manage the `answers` field array.
 * This component is meant to be used during the *creation or editing* of a question,
 * not during form submission or response.
 *
 * Each field represents a label for one answer option, which can be edited or removed.
 * Users can also append new options to the list.
 *
 * @example
 * ```tsx
 * <BuildListAnswers
 *   fields={fields}
 *   register={register}
 *   errors={formErrors}
 *   remove={remove}
 *   append={append}
 * />
 * ```
 *
 * @param props - Component props
 * @param props.fields - The current list of answers from `useFieldArray`
 * @param props.register - `react-hook-form` register function for input fields
 * @param props.errors - Object containing validation errors
 * @param props.remove - Function to remove an answer from the list
 * @param props.append - Function to add a new answer to the list
 *
 * @returns  {JSX.Element} A set of input fields allowing users to manage a list of answer options
 */

type BuildListAnswersProps = {
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[]
	register: UseFormRegister<QuestionUpdate>
	errors: FieldValues
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
}

export function BuildListAnswers({
	fields,
	register,
	errors,
	remove,
	append,
}: BuildListAnswersProps) {
	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor="lastname" required>
				Définir les réponses
			</Label>
			{fields.map((answer, index) => (
				<div
					key={`answer-${index}`}
					className="flex flex-1 items-center gap-2"
				>
					<Input
						id={`answer-${index}`}
						type="text"
						placeholder="Ex: Alma"
						value={answer.value}
						aria-required
						{...register(`answers.${index}.value`)}
						aria-invalid={errors?.answers?.[index]}
						errorMessage={errors?.answers?.[index]?.message}
					></Input>
					<Button
						type="button"
						variant="ghost_destructive"
						size="square_sm"
						ariaLabel="Supprimer cette option"
						onClick={() => remove(index)}
						icon={Trash2}
					/>
				</div>
			))}
			<Button
				type="button"
				variant="ghost"
				fullWidth
				ariaLabel="Ajouter une réponse"
				icon={PlusCircle}
				onClick={() => append({ value: "Nouvelle réponse" })}
			>
				Ajouter une réponse
			</Button>
		</div>
	)
}

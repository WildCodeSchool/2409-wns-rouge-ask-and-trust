import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { QuestionUpdate } from "@/types/types"
import { FieldError, UseFormRegister } from "react-hook-form"

/**
 * Props for the `QuestionTitleInput` component.
 */
type QuestionTitleInputProps = {
	/** `register` function from `react-hook-form` to register the title input field */
	register: UseFormRegister<QuestionUpdate>
	/** Error object for the title input, used to display validation feedback */
	errorsTitle: FieldError | undefined
}

/**
 * Renders the input field for a question's title in a form.
 * Includes a label, required validation, and error display using `react-hook-form`.
 *
 * @param {QuestionTitleInputProps} props - Component props
 * @returns {JSX.Element} The rendered input field for the question title
 */
export const QuestionTitleInput = ({
	register,
	errorsTitle,
}: QuestionTitleInputProps) => {
	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor="title" required>
				Titre
			</Label>
			<Input
				id="title"
				placeholder="Titre de la question"
				{...register("title", {
					required: "Le titre est requis.",
				})}
				aria-invalid={errorsTitle ? "true" : "false"}
				errorMessage={errorsTitle?.message}
			/>
		</div>
	)
}

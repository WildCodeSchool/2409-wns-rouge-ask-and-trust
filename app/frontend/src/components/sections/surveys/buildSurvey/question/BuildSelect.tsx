import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { QuestionDefinition } from "@/types/types"
import { PlusCircle, Trash2 } from "lucide-react"
import {
	FieldArrayWithId,
	FieldValues,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	UseFormRegister,
} from "react-hook-form"

export function BuildSelect({
	fields,
	register,
	errors,
	remove,
	append,
}: {
	fields: FieldArrayWithId<QuestionDefinition, "answers", "id">[]
	register: UseFormRegister<QuestionDefinition>
	errors: FieldValues
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionDefinition, "answers">
}) {
	return (
		<div className="flex flex-col gap-3">
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
						variant="destructive"
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

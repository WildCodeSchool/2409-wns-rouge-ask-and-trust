import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { QuestionUpdate } from "@/types/types"
import { FieldErrors, UseFormRegister } from "react-hook-form"

type TypeTextProps = {
	register: UseFormRegister<QuestionUpdate>
	errors: FieldErrors<QuestionUpdate>
}

// @TODO handle an optional question === not required
export default function TypeText({ register, errors }: TypeTextProps) {
	return (
		<div>
			<Label htmlFor="text" required>
				Réponse
			</Label>
			<Input
				id="text"
				type="text"
				placeholder="Voici ma réponse"
				{...register("answers.question", {
					// // fix this with true and dynamic data
					required: "Une réponse est requise",
				})}
				aria-invalid={errors?.answers ? "true" : "false"}
				errorMessage={errors?.answers?.question?.message as string} // fix this with true data
			></Input>
		</div>
	)
}

import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { FieldErrors, UseFormRegister } from "react-hook-form"

type UseFormInputText = {
	content: string
}

type TypeTextProps = {
	register: UseFormRegister<UseFormInputText>
	errors: FieldErrors<UseFormInputText>
	required: boolean
}

// @TODO fix this with true logic
export default function TypeText({
	register,
	errors,
	required = true,
}: TypeTextProps) {
	return (
		<div>
			<Label htmlFor="content">
				Réponse{" "}
				{required && (
					<span className="text-destructive-medium-dark ml-1">*</span>
				)}
			</Label>
			<Input
				id="content"
				type="text"
				placeholder="Voici ma réponse"
				{...register("content")}
				aria-invalid={errors.content ? "true" : "false"}
				errorMessage={errors.content?.message as string}
			/>
		</div>
	)
}

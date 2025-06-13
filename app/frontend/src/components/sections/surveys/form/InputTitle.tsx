import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { InputsProps } from "@/types/types"

export default function InputTitle({ register, errors }: InputsProps) {
	return (
		<div>
			<Label htmlFor="title" required>
				Titre
			</Label>
			<Input
				id="title"
				type="text"
				placeholder="Saisissez un titre pour votre enquête"
				aria-required
				{...register("title", {
					required: "Le titre est requis",
					minLength: {
						value: 1,
						message:
							"Le titre doit contenir au moins un caractère.",
					},
					maxLength: {
						value: 255,
						message:
							"Le titre doit contenir 255 caractères maximum.",
					},
				})}
				aria-invalid={errors?.title ? "true" : "false"}
				errorMessage={errors?.title?.message}
			></Input>
		</div>
	)
}

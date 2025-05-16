import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { InputsProps } from "@/types/types"

export default function InputDescription({ register, errors }: InputsProps) {
	return (
		<div>
			<Label htmlFor="description" required>
				Description
			</Label>
			<Textarea
				id="description"
				placeholder="Saisissez une description pour votre enquête"
				aria-required
				{...register("description", {
					required: "La description est requise",
					minLength: {
						value: 1,
						message:
							"La description doit contenir au moins un caractère.",
					},
					maxLength: {
						value: 5000,
						message:
							"La description doit contenir 5000 caractères maximum.",
					},
				})}
				aria-invalid={errors?.description ? "true" : "false"}
				errorMessage={errors?.description?.message}
				counter={true}
				maxLength={5000}
			/>
		</div>
	)
}

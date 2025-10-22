import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { InputsProps } from "@/types/types"

export default function InputDescription({
	register,
	errors,
	disabled,
}: InputsProps) {
	const validationRules = disabled
		? {}
		: {
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
			}

	return (
		<div className="flex h-[9.25rem] flex-col gap-1">
			<Label htmlFor="description">Description</Label>
			<Textarea
				id="description"
				disabled={disabled}
				placeholder="Saisissez une description pour votre enquête"
				{...register("description", validationRules)}
				aria-invalid={errors?.description ? "true" : "false"}
				errorMessage={errors?.description?.message}
				counter={true}
				maxLength={5000}
			/>
		</div>
	)
}

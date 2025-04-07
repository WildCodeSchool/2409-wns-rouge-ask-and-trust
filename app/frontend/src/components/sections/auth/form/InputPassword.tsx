import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { UserSignForm } from "@/types/types"
import {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form"
import styles from "./FormInput.module.css"

type InputPasswordProps<T extends FieldValues> = {
	register: UseFormRegister<T>
	errors: FieldErrors<T>
}

export default function InputPassword<T extends UserSignForm>({
	register,
	errors,
}: InputPasswordProps<T>) {
	const errorMessage = errors.password?.message as string | undefined

	const passwordKey: keyof T = "password"

	return (
		<div className={styles.inputFormSign}>
			<Label htmlFor="password" required>
				Mot de passe
			</Label>
			<Input
				id="password"
				type="password"
				placeholder="Mot de passe top secret"
				aria-required
				{...register(passwordKey as Path<T>, {
					required: "Le mot de passe est requis",
					minLength: {
						value: 8,
						message: "Doit contenir au moins 8 caractères",
					},
				})}
				aria-invalid={errors.password ? "true" : "false"}
				errorMessage={errorMessage}
			/>
		</div>
	)
}

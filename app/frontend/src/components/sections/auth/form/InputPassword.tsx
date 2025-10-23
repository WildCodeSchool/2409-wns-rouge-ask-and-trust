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
	mode: "signup" | "signin"
}

export default function InputPassword<T extends UserSignForm>({
	register,
	errors,
	mode,
}: InputPasswordProps<T>) {
	const errorMessage = errors.password?.message as string | undefined

	const passwordKey: keyof T = "password"

	const validationRules =
		mode === "signup"
			? {
					required: "Le mot de passe est requis",
					minLength: {
						value: 8,
						message: "Doit contenir au moins 8 caractères",
					},
					pattern: {
						value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,255}$/,
						message:
							"Doit contenir 1 minuscule, 1 majuscule, 1 chiffre et 1 symbole",
					},
				}
			: {
					required: "Le mot de passe est requis",
				}

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
				{...register(passwordKey as Path<T>, validationRules)}
				aria-invalid={errors.password ? "true" : "false"}
				errorMessage={errorMessage}
			/>
		</div>
	)
}

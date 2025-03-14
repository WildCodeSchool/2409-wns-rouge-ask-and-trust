import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { UserSignUp } from "@/types/types"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import styles from "./FormInput.module.css"

type InputLastnameProps = {
	register: UseFormRegister<UserSignUp>
	errors: FieldErrors<UserSignUp>
}

export default function InputLastname({
	register,
	errors,
}: InputLastnameProps) {
	return (
		<div className={styles.inputFormSign}>
			<Label htmlFor="lastname" required>
				Nom
			</Label>
			<Input
				id="lastname"
				type="text"
				placeholder="Ex: Da Silva"
				aria-required
				{...register("lastname", {
					required: "Le nom est requis",
				})}
				aria-invalid={errors?.lastname ? "true" : "false"}
				errorMessage={errors?.lastname?.message}
			></Input>
		</div>
	)
}

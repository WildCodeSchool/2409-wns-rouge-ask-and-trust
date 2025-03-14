import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { UserSignUp } from "@/types/types"
import { FieldErrors, UseFormRegister } from "react-hook-form"
import styles from "./FormInput.module.css"

type InputFirstnameProps = {
	register: UseFormRegister<UserSignUp>
	errors: FieldErrors<UserSignUp>
}

export default function InputFirstname({
	register,
	errors,
}: InputFirstnameProps) {
	return (
		<div className={styles.inputFormSign}>
			<Label htmlFor="firstname" required>
				Prénom
			</Label>
			<Input
				id="firstname"
				type="text"
				placeholder="Ex: Alma"
				aria-required
				{...register("firstname", {
					required: "Le prénom est requis",
				})}
				aria-invalid={errors?.firstname ? "true" : "false"}
				errorMessage={errors?.firstname?.message}
			></Input>
		</div>
	)
}

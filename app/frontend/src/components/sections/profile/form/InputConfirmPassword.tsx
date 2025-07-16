import { Label } from "@/components/ui/Label.tsx"
import { Input } from "@/components/ui/Input.tsx"
import { FieldErrors } from "react-hook-form"
import { User } from "@/types/types.ts"

type InputConfirmPasswordProps = {
	errors?: FieldErrors<User>
}

export default function InputConfirmPassword({
	errors,
}: InputConfirmPasswordProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="confirmPassword">Confirmer mot de passe</Label>
			<Input
				id="confirmPassword"
				type="password"
				placeholder="Confirmer mot de passe"
				errorMessage={errors?.password?.message}
			/>
		</div>
	)
}

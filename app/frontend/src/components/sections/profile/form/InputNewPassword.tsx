import { Label } from "@/components/ui/Label.tsx"
import { Input } from "@/components/ui/Input.tsx"
import { FieldErrors } from "react-hook-form"
import { User } from "@/types/types.ts"

type InputNewPasswordProps = {
	errors?: FieldErrors<User>
}

export default function InputNewPassword({ errors }: InputNewPasswordProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="newPassword">Nouveau mot de passe</Label>
			<Input
				id="newPassword"
				type="password"
				placeholder="Nouveau mot de passe"
				errorMessage={errors?.password?.message}
			/>
		</div>
	)
}

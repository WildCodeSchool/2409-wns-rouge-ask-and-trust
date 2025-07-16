import { Label } from "@/components/ui/Label.tsx"
import { Input } from "@/components/ui/Input.tsx"
import { FieldErrors } from "react-hook-form"
import { User } from "@/types/types.ts"

type InputOldPasswordProps = {
	errors?: FieldErrors<User>
}

export default function InputOldPassword({ errors }: InputOldPasswordProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="oldPassword">Ancien mot de passe</Label>
			<Input
				id="oldPassword"
				type="password"
				placeholder="Ancien mot de passe"
				errorMessage={errors?.password?.message}
			/>
		</div>
	)
}

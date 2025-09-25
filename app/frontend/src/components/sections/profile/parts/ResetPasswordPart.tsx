import { Button } from "@/components/ui/Button"
import InputResetPassword from "@/components/sections/profile/form/InputResetPassword"

const inputsAttributes = [
	{
		id: "oldPassword",
		label: "Ancien mot de passe",
		placeholder: "Ancien mot de passe",
	},
	{
		id: "newPassword",
		label: "Nouveau mot de passe",
		placeholder: "Nouveau mot de passe",
	},
	{
		id: "confirmPassword",
		label: "Confirmer mot de passe",
		placeholder: "Confirmer mot de passe",
	},
]

export function ResetPasswordPart() {
	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<h2 className="text-lg font-semibold">Modifier le mot de passe</h2>
			<div className="flex flex-col gap-4">
				{inputsAttributes.map(input => (
					<InputResetPassword
						key={input.id}
						id={input.id}
						label={input.label}
						placeholder={input.placeholder}
					/>
				))}
				<div className="flex justify-end">
					<Button
						variant="primary"
						ariaLabel="Confirmer le mot de passe"
						className="h-9 rounded-md px-4 text-base"
					>
						Confirmer
					</Button>
				</div>
			</div>
		</div>
	)
}

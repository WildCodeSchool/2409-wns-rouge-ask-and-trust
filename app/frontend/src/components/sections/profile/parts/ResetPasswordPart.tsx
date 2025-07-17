import { Button } from "@/components/ui/Button.tsx"
import InputResetPassword from "@/components/sections/profile/form/InputResetPassword.tsx"

export function ResetPasswordPart() {
	return (
		<div className="w-full px-6 py-4 sm:min-w-[331px] lg:min-w-[420px]">
			<h5 className="mb-4 text-lg font-semibold">
				Modifier le mot de passe
			</h5>

			<div className="flex flex-col gap-4">
				<InputResetPassword
					id="oldPassword"
					label="Ancien mot de passe"
					placeholder="Ancien mot de passe"
				/>
				<InputResetPassword
					id="newPassord"
					label="Nouveau mot de passe"
					placeholder="Nouveau mot de passe"
				/>
				<InputResetPassword
					id="confirmPassword"
					label="Confirmer mot de passe"
					placeholder="Confirmer mot de passe"
				/>

				<div className="flex justify-end pt-2">
					<Button
						variant="primary"
						ariaLabel="Confirmer le mot de passe"
						className="buttonVariants h-9 rounded-md px-4 text-base"
					>
						Confirmer
					</Button>
				</div>
			</div>
		</div>
	)
}

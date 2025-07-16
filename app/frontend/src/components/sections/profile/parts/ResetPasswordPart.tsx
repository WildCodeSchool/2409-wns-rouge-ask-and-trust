import { Button } from "@/components/ui/Button.tsx"
import InputOldPassword from "@/components/sections/profile/form/InputOldPassword.tsx"
import InputNewPassword from "@/components/sections/profile/form/InputNewPassword.tsx"
import InputConfirmPassword from "@/components/sections/profile/form/InputConfirmPassword.tsx"

export function ResetPasswordPart() {
	return (
		<div className="w-full px-6 py-4 sm:min-w-[331px] lg:min-w-[420px]">
			<h5 className="mb-4 text-lg font-semibold">
				Modifier le mot de passe
			</h5>

			<div className="flex flex-col gap-4">
				<InputOldPassword />
				<InputNewPassword />
				<InputConfirmPassword />

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

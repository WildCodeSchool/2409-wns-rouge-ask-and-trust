import { Button } from "@/components/ui/Button.tsx"

export function ResetPasswordPart() {
	return (
		<div className="w-full max-w-[420px] px-6 py-6">
			<h5 className="mb-4 text-lg font-semibold text-gray-700">
				Modifier le mot de passe
			</h5>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col">
					<label
						htmlFor="oldPassword"
						className="mb-1 text-sm font-medium"
					>
						Ancien mot de passe
					</label>
					<input
						id="oldPassword"
						type="password"
						placeholder="Ancien mot de passe"
						className="rounded border px-3 py-2 text-sm"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="newPassword"
						className="mb-1 text-sm font-medium"
					>
						Nouveau mot de passe
					</label>
					<input
						id="newPassword"
						type="password"
						placeholder="Nouveau mot de passe"
						className="rounded border px-3 py-2 text-sm"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="confirmPassword"
						className="mb-1 text-sm font-medium"
					>
						Confirmer le mot de passe
					</label>
					<input
						id="confirmPassword"
						type="password"
						placeholder="Confirmer le mot de passe"
						className="rounded border px-3 py-2 text-sm"
					/>
				</div>

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

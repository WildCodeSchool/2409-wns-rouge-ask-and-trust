import { useMutation } from "@apollo/client"
import { useForm, SubmitHandler } from "react-hook-form"
import { CHANGE_PASSWORD } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button"

interface ChangePasswordForm {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

export function ResetPasswordPart() {
	const { showToast } = useToast()

	// Mutation pour changer le mot de passe
	const [changePassword, { loading: isChanging }] =
		useMutation(CHANGE_PASSWORD)

	// Formulaire
	const form = useForm<ChangePasswordForm>({
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	})

	const onSubmit: SubmitHandler<ChangePasswordForm> = async data => {
		if (data.newPassword !== data.confirmPassword) {
			showToast({
				type: "error",
				title: "Erreur",
				description: "Les nouveaux mots de passe ne correspondent pas.",
			})
			return
		}

		if (data.newPassword.length < 8) {
			showToast({
				type: "error",
				title: "Erreur",
				description:
					"Le nouveau mot de passe doit contenir au moins 8 caractères.",
			})
			return
		}

		try {
			await changePassword({
				variables: {
					data: {
						currentPassword: data.currentPassword,
						newPassword: data.newPassword,
					},
				},
			})

			form.reset()
			showToast({
				type: "success",
				title: "Mot de passe modifié",
				description: "Votre mot de passe a été modifié avec succès.",
			})
		} catch (error: unknown) {
			console.error("Error changing password:", error)
			const errorMessage =
				(error as unknown as { graphQLErrors?: { message: string }[] })
					?.graphQLErrors?.[0]?.message || "Une erreur est survenue"
			showToast({
				type: "error",
				title: "Erreur",
				description: errorMessage,
			})
		}
	}

	return (
		<div className="flex w-full flex-col gap-4 p-4">
			<h2 className="text-lg font-semibold">Modifier le mot de passe</h2>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
			>
				<div className="flex flex-col gap-2">
					<label
						htmlFor="currentPassword"
						className="text-sm font-medium"
					>
						Ancien mot de passe
					</label>
					<input
						{...form.register("currentPassword", {
							required: true,
						})}
						type="password"
						required
						className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Ancien mot de passe"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="newPassword"
						className="text-sm font-medium"
					>
						Nouveau mot de passe
					</label>
					<input
						{...form.register("newPassword", {
							required: true,
							minLength: 8,
						})}
						type="password"
						required
						className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Nouveau mot de passe (min. 8 caractères)"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label
						htmlFor="confirmPassword"
						className="text-sm font-medium"
					>
						Confirmer le nouveau mot de passe
					</label>
					<input
						{...form.register("confirmPassword", {
							required: true,
						})}
						type="password"
						required
						className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
						placeholder="Confirmer le nouveau mot de passe"
					/>
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						variant="primary"
						disabled={isChanging}
						ariaLabel="Confirmer le changement de mot de passe"
						className="h-9 rounded-md px-4 text-base"
					>
						{isChanging ? "Modification..." : "Confirmer"}
					</Button>
				</div>
			</form>
		</div>
	)
}

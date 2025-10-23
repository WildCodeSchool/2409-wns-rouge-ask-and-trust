import { useMutation } from "@apollo/client"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { UPDATE_PASSWORD } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import styles from "@/components/sections/auth/form/FormInput.module.css"

interface UpdatePasswordForm {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}

export function ResetPasswordPart() {
	const methods = useForm<UpdatePasswordForm>({
		mode: "onBlur",
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods

	const [updatePassword, { loading: isChanging }] =
		useMutation(UPDATE_PASSWORD)
	const { showToast } = useToast()

	const onSubmit: SubmitHandler<UpdatePasswordForm> = async data => {
		if (data.newPassword !== data.confirmPassword) {
			showToast({
				type: "error",
				title: "Erreur",
				description: "Les nouveaux mots de passe ne correspondent pas.",
			})
			return
		}

		try {
			await updatePassword({
				variables: {
					data: {
						currentPassword: data.currentPassword,
						newPassword: data.newPassword,
					},
				},
			})

			reset()
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
		<FormProvider {...methods}>
			<FormWrapper
				onSubmit={handleSubmit(onSubmit)}
				className="border-none p-0 shadow-none"
			>
				<h2 className="mb-4 text-center text-xl font-semibold">
					Modifier mon mot de passe
				</h2>

				<div className={styles.inputFormSign}>
					<Label htmlFor="currentPassword" required>
						Mot de passe actuel
					</Label>
					<Input
						id="currentPassword"
						type="password"
						placeholder="Votre mot de passe actuel"
						aria-required
						{...register("currentPassword", {
							required: "Le mot de passe actuel est requis",
						})}
						aria-invalid={
							errors?.currentPassword ? "true" : "false"
						}
						errorMessage={errors?.currentPassword?.message}
					/>
				</div>

				<div className={styles.inputFormSign}>
					<Label htmlFor="newPassword" required>
						Nouveau mot de passe
					</Label>
					<Input
						id="newPassword"
						type="password"
						placeholder="Votre nouveau mot de passe"
						aria-required
						{...register("newPassword", {
							required: "Le nouveau mot de passe est requis",
							minLength: {
								value: 8,
								message: "Doit contenir au moins 8 caractères",
							},
							pattern: {
								value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,255}$/,
								message:
									"Doit contenir 1 minuscule, 1 majuscule, 1 chiffre et 1 symbole",
							},
						})}
						aria-invalid={errors?.newPassword ? "true" : "false"}
						errorMessage={errors?.newPassword?.message}
					/>
				</div>

				<div className={styles.inputFormSign}>
					<Label htmlFor="confirmPassword" required>
						Confirmer le nouveau mot de passe
					</Label>
					<Input
						id="confirmPassword"
						type="password"
						placeholder="Confirmez votre nouveau mot de passe"
						aria-required
						{...register("confirmPassword", {
							required:
								"La confirmation du mot de passe est requise",
						})}
						aria-invalid={
							errors?.confirmPassword ? "true" : "false"
						}
						errorMessage={errors?.confirmPassword?.message}
					/>
				</div>

				<Button
					type="submit"
					variant="primary"
					disabled={isChanging}
					ariaLabel="Confirmer le changement de mot de passe"
					className="h-9 rounded-md px-4 text-base"
				>
					{isChanging ? "Modification..." : "Confirmer"}
				</Button>
			</FormWrapper>
		</FormProvider>
	)
}

import { useMutation } from "@apollo/client"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { DELETE_MY_ACCOUNT } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Checkbox } from "@/components/ui/Checkbox"
import { WarningBox } from "@/components/ui/WarningBox"
import { InfoBox } from "@/components/ui/InfoBox"
import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import styles from "@/components/sections/auth/form/FormInput.module.css"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

interface DeleteAccountForm {
	password: string
	confirmationText: string
}

/**
 * Component for deleting user account (RGPD Right to be Forgotten)
 * Displays warnings and requires multiple confirmations before deletion
 */
export function DeleteAccountPart() {
	const methods = useForm<DeleteAccountForm>({
		mode: "onBlur",
		defaultValues: {
			password: "",
			confirmationText: "",
		},
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = methods

	const [hasConfirmed, setHasConfirmed] = useState(false)
	const [deleteMyAccount, { loading: isDeleting }] =
		useMutation(DELETE_MY_ACCOUNT)
	const { showToast } = useToast()
	const { logout } = useAuthContext()
	const navigate = useNavigate()

	const onSubmit: SubmitHandler<DeleteAccountForm> = async data => {
		if (!hasConfirmed) {
			showToast({
				type: "error",
				title: "Confirmation requise",
				description:
					"Veuillez cocher la case pour confirmer la suppression.",
			})
			return
		}

		if (data.confirmationText !== "SUPPRIMER MON COMPTE") {
			showToast({
				type: "error",
				title: "Erreur de confirmation",
				description:
					'Vous devez taper exactement "SUPPRIMER MON COMPTE"',
			})
			return
		}

		try {
			await deleteMyAccount({
				variables: {
					data: {
						password: data.password,
						confirmationText: data.confirmationText,
					},
				},
			})

			showToast({
				type: "success",
				title: "Compte supprimé",
				description:
					"Votre compte et toutes vos données ont été définitivement supprimés.",
			})

			// Logout and redirect to home
			await logout()
			navigate("/")
		} catch (error: unknown) {
			console.error("Error deleting account:", error)
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
				<h2 className="text-destructive-medium mb-4 text-center text-xl font-semibold">
					Supprimer mon compte
				</h2>

				<WarningBox
					title="Attention : Action irréversible"
					items={[
						"Toutes vos données personnelles seront définitivement supprimées",
						"Tous vos sondages et questions associées seront supprimés",
						"Toutes vos réponses et catégories seront effacées",
						"Cette action ne peut pas être annulée",
						"Vous ne pourrez pas récupérer votre compte",
					]}
					className="mb-6"
				/>

				<InfoBox variant="info" showIcon={false} className="mb-4">
					<strong>Conformité RGPD :</strong> Cette action respecte
					votre droit à l'oubli conformément au Règlement Général sur
					la Protection des Données (RGPD) et à la loi Informatique et
					Libertés française.
				</InfoBox>

				<div className={styles.inputFormSign}>
					<Label htmlFor="password" required>
						Mot de passe
					</Label>
					<Input
						id="password"
						type="password"
						placeholder="Votre mot de passe"
						aria-required
						{...register("password", {
							required: "Le mot de passe est requis",
							minLength: {
								value: 8,
								message: "Doit contenir au moins 8 caractères",
							},
						})}
						aria-invalid={errors?.password ? "true" : "false"}
						errorMessage={errors?.password?.message}
					/>
				</div>

				<div className={styles.inputFormSign}>
					<Label htmlFor="confirmationText" required>
						Tapez "SUPPRIMER MON COMPTE" pour confirmer
					</Label>
					<Input
						id="confirmationText"
						type="text"
						placeholder="SUPPRIMER MON COMPTE"
						aria-required
						{...register("confirmationText", {
							required: "La confirmation est requise",
							validate: value =>
								value === "SUPPRIMER MON COMPTE" ||
								'Vous devez taper exactement "SUPPRIMER MON COMPTE"',
						})}
						aria-invalid={
							errors?.confirmationText ? "true" : "false"
						}
						errorMessage={errors?.confirmationText?.message}
					/>
				</div>

				<div className="mb-4 flex items-start gap-3">
					<Checkbox
						id="confirmation-checkbox"
						checked={hasConfirmed}
						onCheckedChange={checked => setHasConfirmed(!!checked)}
						aria-required
					/>
					<Label
						htmlFor="confirmation-checkbox"
						className="cursor-pointer text-sm"
					>
						Je comprends que cette action est définitive et
						irréversible. Toutes mes données seront supprimées de
						manière permanente et je ne pourrai pas récupérer mon
						compte.
					</Label>
				</div>

				<Button
					type="submit"
					variant="destructive"
					disabled={isDeleting || !hasConfirmed}
					ariaLabel="Confirmer la suppression du compte"
					className="h-9 rounded-md px-4 text-base"
				>
					{isDeleting
						? "Suppression..."
						: "Supprimer définitivement mon compte"}
				</Button>
			</FormWrapper>
		</FormProvider>
	)
}

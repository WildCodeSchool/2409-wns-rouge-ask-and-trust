import { useMutation } from "@apollo/client"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { USE_RECOVERY_CODE } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button"
import { Shield, ArrowLeft } from "lucide-react"

interface RecoveryCodeResetForm {
	email: string
	recoveryCode: string
	newPassword: string
	confirmPassword: string
}

export default function RecoveryCodeReset() {
	const navigate = useNavigate()
	const { showToast } = useToast()

	// Mutation pour utiliser le code de récupération
	const [resetPasswordWithCode, { loading: isResetting }] =
		useMutation(USE_RECOVERY_CODE)

	// Formulaire
	const form = useForm<RecoveryCodeResetForm>({
		defaultValues: {
			email: "",
			recoveryCode: "",
			newPassword: "",
			confirmPassword: "",
		},
	})

	const onSubmit: SubmitHandler<RecoveryCodeResetForm> = async data => {
		if (data.newPassword !== data.confirmPassword) {
			showToast({
				type: "error",
				title: "Erreur",
				description: "Les mots de passe ne correspondent pas.",
			})
			return
		}

		if (data.newPassword.length < 8) {
			showToast({
				type: "error",
				title: "Erreur",
				description:
					"Le mot de passe doit contenir au moins 8 caractères.",
			})
			return
		}

		try {
			await resetPasswordWithCode({
				variables: {
					data: {
						email: data.email,
						recoveryCode: data.recoveryCode
							.toUpperCase()
							.replace(/\s/g, ""), // Nettoyer le code
						newPassword: data.newPassword,
					},
				},
			})

			showToast({
				type: "success",
				title: "Mot de passe réinitialisé",
				description:
					"Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
				actionLabel: "Se connecter",
				redirectTo: "/connexion",
			})
		} catch (error: unknown) {
			console.error("Error using recovery code:", error)

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
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<Shield className="mx-auto h-12 w-12 text-blue-600" />
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Code de Récupération
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Utilisez un de vos codes de récupération pour
						réinitialiser votre mot de passe
					</p>
				</div>

				<form
					className="mt-8 space-y-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div>
						<label
							htmlFor="email"
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Adresse email
						</label>
						<input
							{...form.register("email", {
								required: true,
								pattern: /^\S+@\S+$/i,
							})}
							type="email"
							required
							className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
							placeholder="votre@email.com"
						/>
					</div>

					<div>
						<label
							htmlFor="recoveryCode"
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Code de récupération
						</label>
						<input
							{...form.register("recoveryCode", {
								required: true,
							})}
							type="text"
							required
							className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 font-mono text-lg tracking-wider text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
							placeholder="XXXX-XXXX"
							style={{ textTransform: "uppercase" }}
						/>
						<p className="mt-1 text-xs text-gray-500">
							Format: XXXX-XXXX (les espaces et tirets sont
							optionnels)
						</p>
					</div>

					<div>
						<label
							htmlFor="newPassword"
							className="mb-1 block text-sm font-medium text-gray-700"
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
							className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
							placeholder="Nouveau mot de passe (min. 8 caractères)"
						/>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="mb-1 block text-sm font-medium text-gray-700"
						>
							Confirmer le mot de passe
						</label>
						<input
							{...form.register("confirmPassword", {
								required: true,
							})}
							type="password"
							required
							className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm"
							placeholder="Confirmer le nouveau mot de passe"
						/>
					</div>

					<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
						<div className="flex">
							<Shield className="mt-0.5 h-5 w-5 text-blue-400" />
							<div className="ml-3">
								<h3 className="text-sm font-medium text-blue-800">
									À propos des codes de récupération
								</h3>
								<div className="mt-2 text-sm text-blue-700">
									<ul className="list-inside list-disc space-y-1">
										<li>
											Chaque code ne peut être utilisé
											qu'une seule fois
										</li>
										<li>
											Après utilisation, le code sera
											supprimé
										</li>
										<li>
											Générez de nouveaux codes depuis
											votre profil
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							variant="primary"
							fullWidth
							disabled={isResetting}
							ariaLabel="Réinitialiser le mot de passe"
						>
							{isResetting
								? "Réinitialisation..."
								: "Réinitialiser le mot de passe"}
						</Button>
					</div>

					<div className="space-y-2 text-center">
						<Button
							type="button"
							variant="transparent"
							onClick={() => navigate("/mot-de-passe-oublie")}
							ariaLabel="Retour aux options de récupération"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Autres options de récupération
						</Button>
						<br />
						<Button
							to="/connexion"
							variant="transparent"
							role="link"
							ariaLabel="Retour à la connexion"
						>
							Retour à la connexion
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

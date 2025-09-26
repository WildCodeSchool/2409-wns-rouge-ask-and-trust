import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { DELETE_MY_ACCOUNT, EXPORT_MY_DATA } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { useAuthContext } from "@/hooks/useAuthContext"
import { Button } from "@/components/ui/Button"
import { Trash2, Download, AlertTriangle } from "lucide-react"

interface DeleteAccountForm {
	currentPassword: string
	confirmDeletion: string
}

export default function AccountManagement() {
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
	const { showToast } = useToast()
	const { logout } = useAuthContext()
	const navigate = useNavigate()

	// Mutation pour supprimer le compte
	const [deleteAccount, { loading: isDeleting }] = useMutation(
		DELETE_MY_ACCOUNT,
		{
			onCompleted: data => {
				console.log("Account deletion completed:", data)
				showToast({
					type: "success",
					title: "Compte supprimé",
					description:
						"Votre compte a été supprimé avec succès. Vous allez être déconnecté.",
				})

				// Forcer la déconnexion et redirection
				setTimeout(() => {
					logout()
					navigate("/", { replace: true })
				}, 2000)
			},
			onError: error => {
				console.error("Account deletion error:", error)
			},
		}
	)

	// Query pour exporter les données
	const { loading: isExporting, refetch: exportMyData } = useQuery(
		EXPORT_MY_DATA,
		{
			skip: true, // Ne pas exécuter automatiquement
		}
	)

	const deleteForm = useForm<DeleteAccountForm>({
		defaultValues: {
			currentPassword: "",
			confirmDeletion: "",
		},
	})

	const onDeleteAccount: SubmitHandler<DeleteAccountForm> = async data => {
		if (data.confirmDeletion !== "SUPPRIMER") {
			showToast({
				type: "error",
				title: "Confirmation invalide",
				description:
					"Vous devez taper 'SUPPRIMER' pour confirmer la suppression.",
			})
			return
		}

		try {
			await deleteAccount({
				variables: {
					data: {
						currentPassword: data.currentPassword,
						confirmDeletion: data.confirmDeletion,
					},
				},
			})

			// Le toast est maintenant géré dans onCompleted
		} catch (error) {
			console.error("Error deleting account:", error)
			showToast({
				type: "error",
				title: "Erreur",
				description:
					"Une erreur est survenue lors de la suppression du compte. Vérifiez votre mot de passe.",
			})
		}
	}

	const onExportData = async () => {
		try {
			console.log("Starting data export...")
			const result = await exportMyData()
			console.log("Export result:", result)

			if (result.data?.exportMyData) {
				const exportDataString = result.data.exportMyData
				console.log("Export data received:", exportDataString)

				// Le backend retourne déjà une string JSON formatée
				const blob = new Blob([exportDataString], {
					type: "application/json",
				})

				const url = window.URL.createObjectURL(blob)
				const link = document.createElement("a")
				link.href = url
				link.download = `mes-donnees-${new Date().toISOString().split("T")[0]}.json`
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				window.URL.revokeObjectURL(url)

				showToast({
					type: "success",
					title: "Export réussi",
					description:
						"Vos données ont été exportées et téléchargées avec succès.",
				})
			} else {
				console.error("No data received from export")
				showToast({
					type: "error",
					title: "Erreur",
					description: "Aucune donnée reçue lors de l'export.",
				})
			}
		} catch (error) {
			console.error("Error exporting data:", error)
			showToast({
				type: "error",
				title: "Erreur",
				description:
					"Une erreur est survenue lors de l'export des données.",
			})
		}
	}

	if (showDeleteConfirmation) {
		return (
			<div className="space-y-6">
				<div className="rounded-lg border border-red-200 bg-red-50 p-6">
					<div className="flex items-start space-x-3">
						<AlertTriangle className="mt-0.5 h-6 w-6 text-red-600" />
						<div className="flex-1">
							<h3 className="mb-2 text-lg font-semibold text-red-900">
								Suppression définitive du compte
							</h3>
							<p className="mb-4 text-red-700">
								Cette action est irréversible. Toutes vos
								données personnelles seront supprimées, mais les
								données de paiement seront anonymisées et
								conservées pour les obligations légales et
								comptables.
							</p>
							<p className="mb-6 text-red-700">
								<strong>Seront supprimés :</strong> vos
								enquêtes, réponses, profil et toutes données
								personnelles.
								<br />
								<strong>
									Seront conservés (anonymisés) :
								</strong>{" "}
								historique des paiements pour la comptabilité.
							</p>

							<form
								onSubmit={deleteForm.handleSubmit(
									onDeleteAccount
								)}
								className="space-y-4"
							>
								<div>
									<label
										htmlFor="currentPassword"
										className="mb-1 block text-sm font-medium text-red-900"
									>
										Mot de passe actuel
									</label>
									<input
										{...deleteForm.register(
											"currentPassword",
											{ required: true }
										)}
										type="password"
										required
										className="w-full rounded-md border border-red-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
										placeholder="Entrez votre mot de passe actuel"
									/>
								</div>

								<div>
									<label
										htmlFor="confirmDeletion"
										className="mb-1 block text-sm font-medium text-red-900"
									>
										Tapez "SUPPRIMER" pour confirmer
									</label>
									<input
										{...deleteForm.register(
											"confirmDeletion",
											{ required: true }
										)}
										type="text"
										required
										className="w-full rounded-md border border-red-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
										placeholder="SUPPRIMER"
									/>
								</div>

								<div className="flex space-x-3 pt-4">
									<Button
										type="button"
										variant="secondary"
										onClick={() =>
											setShowDeleteConfirmation(false)
										}
										ariaLabel="Annuler la suppression"
									>
										Annuler
									</Button>
									<Button
										type="submit"
										variant="destructive"
										disabled={isDeleting}
										ariaLabel="Confirmer la suppression du compte"
									>
										{isDeleting
											? "Suppression..."
											: "Supprimer définitivement"}
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="mb-6 text-2xl font-bold text-gray-900">
					Gestion du compte
				</h2>
			</div>

			{/* Export des données */}
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
				<div className="flex items-start space-x-3">
					<Download className="mt-0.5 h-6 w-6 text-blue-600" />
					<div className="flex-1">
						<h3 className="mb-2 text-lg font-semibold text-blue-900">
							Exporter mes données
						</h3>
						<p className="mb-4 text-blue-700">
							Téléchargez une copie complète de toutes vos données
							personnelles (profil, enquêtes, réponses, historique
							des paiements) au format JSON.
						</p>
						<p className="mb-4 text-sm text-blue-600">
							Conformément au RGPD (Article 20 - Droit à la
							portabilité des données)
						</p>
						<Button
							type="button"
							variant="secondary"
							onClick={onExportData}
							disabled={isExporting}
							ariaLabel="Exporter mes données"
						>
							{isExporting
								? "Export en cours..."
								: "Télécharger mes données"}
						</Button>
					</div>
				</div>
			</div>

			{/* Suppression du compte */}
			<div className="rounded-lg border border-red-200 bg-red-50 p-6">
				<div className="flex items-start space-x-3">
					<Trash2 className="mt-0.5 h-6 w-6 text-red-600" />
					<div className="flex-1">
						<h3 className="mb-2 text-lg font-semibold text-red-900">
							Supprimer mon compte
						</h3>
						<p className="mb-4 text-red-700">
							Supprimez définitivement votre compte et toutes vos
							données personnelles. Cette action est irréversible.
						</p>
						<p className="mb-4 text-sm text-red-600">
							Note : Les données de paiement seront anonymisées
							mais conservées pour les obligations légales et
							comptables.
						</p>
						<Button
							type="button"
							variant="destructive"
							onClick={() => setShowDeleteConfirmation(true)}
							ariaLabel="Supprimer mon compte"
						>
							Supprimer mon compte
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

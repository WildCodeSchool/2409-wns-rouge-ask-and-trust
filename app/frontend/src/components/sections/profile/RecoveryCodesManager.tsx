import { useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
	GENERATE_RECOVERY_CODES,
	HAS_RECOVERY_CODES,
	REMAINING_RECOVERY_CODES,
} from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { Button } from "@/components/ui/Button"
import { Shield, Download, AlertTriangle, Copy, Check } from "lucide-react"

export default function RecoveryCodesManager() {
	const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
	const [showCodes, setShowCodes] = useState(false)
	const [copiedCode, setCopiedCode] = useState<string | null>(null)
	const { showToast } = useToast()

	// Vérifier si l'utilisateur a des codes
	const { data: hasCodesData, refetch: refetchHasCodes } =
		useQuery(HAS_RECOVERY_CODES)
	const { data: remainingData, refetch: refetchRemaining } = useQuery(
		REMAINING_RECOVERY_CODES
	)

	// Mutation pour générer les codes
	const [generateCodes, { loading: isGenerating }] = useMutation(
		GENERATE_RECOVERY_CODES,
		{
			onCompleted: data => {
				setGeneratedCodes(data.generateRecoveryCodes)
				setShowCodes(true)
				refetchHasCodes()
				refetchRemaining()
			},
		}
	)

	const handleGenerateCodes = async () => {
		try {
			await generateCodes()
			showToast({
				type: "success",
				title: "Codes générés",
				description:
					"Vos codes de récupération ont été générés avec succès. Sauvegardez-les immédiatement !",
			})
		} catch (error) {
			console.error("Error generating recovery codes:", error)
			showToast({
				type: "error",
				title: "Erreur",
				description: "Impossible de générer les codes de récupération.",
			})
		}
	}

	const copyCode = async (code: string) => {
		try {
			await navigator.clipboard.writeText(code)
			setCopiedCode(code)
			setTimeout(() => setCopiedCode(null), 2000)
			showToast({
				type: "success",
				title: "Code copié",
				description: "Le code a été copié dans le presse-papiers.",
			})
		} catch (error) {
			console.error("Error copying code:", error)
			showToast({
				type: "error",
				title: "Erreur",
				description: "Impossible de copier le code.",
			})
		}
	}

	const downloadCodes = () => {
		const codesText = generatedCodes
			.map((code, index) => `${index + 1}. ${code}`)
			.join("\n")

		const content = `Ask & Trust - Codes de Récupération
Généré le: ${new Date().toLocaleString("fr-FR")}

IMPORTANT: Sauvegardez ces codes dans un endroit sûr.
Chaque code ne peut être utilisé qu'une seule fois.

${codesText}

Comment utiliser ces codes:
1. Allez sur la page de connexion
2. Cliquez sur "Mot de passe oublié ?"
3. Sélectionnez "Utiliser un code de récupération"
4. Entrez l'un de ces codes avec votre nouveau mot de passe

Gardez ces codes en sécurité et ne les partagez avec personne !`

		const blob = new Blob([content], { type: "text/plain" })
		const url = window.URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = url
		link.download = `codes-recuperation-${new Date().toISOString().split("T")[0]}.txt`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		window.URL.revokeObjectURL(url)
	}

	if (showCodes && generatedCodes.length > 0) {
		return (
			<div className="space-y-6">
				<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
					<div className="flex items-start space-x-3">
						<AlertTriangle className="mt-0.5 h-6 w-6 text-yellow-600" />
						<div className="flex-1">
							<h3 className="mb-2 text-lg font-semibold text-yellow-900">
								⚠️ Sauvegardez ces codes immédiatement !
							</h3>
							<p className="mb-4 text-yellow-700">
								Ces codes ne seront affichés qu'une seule fois.
								Sauvegardez-les dans un endroit sûr. Chaque code
								ne peut être utilisé qu'une seule fois pour
								réinitialiser votre mot de passe.
							</p>

							<div className="mb-4 grid grid-cols-2 gap-3">
								{generatedCodes.map(code => (
									<div
										key={code}
										className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
									>
										<span className="font-mono text-lg font-semibold text-gray-900">
											{code}
										</span>
										<button
											onClick={() => copyCode(code)}
											className="ml-2 p-1 text-gray-500 hover:text-gray-700"
											title="Copier le code"
										>
											{copiedCode === code ? (
												<Check className="h-4 w-4 text-green-600" />
											) : (
												<Copy className="h-4 w-4" />
											)}
										</button>
									</div>
								))}
							</div>

							<div className="flex space-x-3">
								<Button
									type="button"
									variant="secondary"
									onClick={downloadCodes}
									ariaLabel="Télécharger les codes"
								>
									<Download className="mr-2 h-4 w-4" />
									Télécharger les codes
								</Button>
								<Button
									type="button"
									variant="primary"
									onClick={() => setShowCodes(false)}
									ariaLabel="J'ai sauvegardé mes codes"
								>
									J'ai sauvegardé mes codes
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
				<div className="flex items-start space-x-3">
					<Shield className="mt-0.5 h-6 w-6 text-blue-600" />
					<div className="flex-1">
						<h3 className="mb-2 text-lg font-semibold text-blue-900">
							Codes de Récupération
						</h3>
						<p className="mb-4 text-blue-700">
							Les codes de récupération vous permettent de
							réinitialiser votre mot de passe sans avoir besoin
							d'email. Chaque code ne peut être utilisé qu'une
							seule fois.
						</p>

						{hasCodesData?.hasRecoveryCodes ? (
							<div className="mb-4">
								<p className="font-medium text-blue-600">
									✅ Vous avez{" "}
									{remainingData?.remainingRecoveryCodes || 0}{" "}
									codes de récupération restants
								</p>
								<p className="mt-1 text-sm text-blue-600">
									Générer de nouveaux codes remplacera les
									anciens codes.
								</p>
							</div>
						) : (
							<div className="mb-4">
								<p className="font-medium text-blue-600">
									❌ Aucun code de récupération configuré
								</p>
								<p className="mt-1 text-sm text-blue-600">
									Générez des codes maintenant pour pouvoir
									réinitialiser votre mot de passe sans email.
								</p>
							</div>
						)}

						<Button
							type="button"
							variant="secondary"
							onClick={handleGenerateCodes}
							disabled={isGenerating}
							ariaLabel="Générer de nouveaux codes de récupération"
						>
							{isGenerating
								? "Génération..."
								: "Générer de nouveaux codes"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

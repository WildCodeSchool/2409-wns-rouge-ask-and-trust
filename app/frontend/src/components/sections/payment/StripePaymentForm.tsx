import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PaymentElement, useStripe, useElements, useCheckout } from "@stripe/react-stripe-js"
import { FormEvent } from "react"
import { useStripeContext } from "@/contexts/StripeContextProvider"

interface StripePaymentFormProps {
	packageName?: string;
}

const StripePaymentForm = ({ packageName }: StripePaymentFormProps) => {
	const stripe = useStripe()
	const elements = useElements()
	const checkout = useCheckout()
	const navigate = useNavigate()
	const { setError } = useStripeContext()

	const [isProcessing, setIsProcessing] = useState(false)
	const [paymentMessage, setPaymentMessage] = useState("")
	const [isStripeReady, setIsStripeReady] = useState(false)

	// Vérifier si Stripe est prêt
	useEffect(() => {
		if (stripe && elements) {
			console.log("Stripe et Elements sont prêts!")
			setIsStripeReady(true)
		} else {
			console.log("Stripe ou Elements ne sont pas encore prêts:", { stripe, elements })
		}
	}, [stripe, elements])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log("Formulaire soumis")

		if (!stripe || !elements) {
			console.log("Stripe n'est pas encore chargé")
			setError("Le système de paiement n'est pas encore prêt. Veuillez patienter.")
			return
		}

		setIsProcessing(true)
		setError(null) // Réinitialiser les erreurs précédentes
		console.log("Traitement du paiement en cours...")

		try {
			// En mode production, utiliser le hook useCheckout
			if (checkout) {
				const result = await checkout.confirm()
				
				if (result.type === 'error') {
					const errorMessage = result.error.message || "Une erreur est survenue lors du paiement."
					setPaymentMessage(errorMessage)
					setError(errorMessage)
				} else {
					// Le client sera redirigé vers l'URL de retour définie dans le backend
					console.log("Paiement confirmé, redirection en cours...")
				}
			} else {
				// En mode développement, simuler le paiement
				await new Promise(resolve => setTimeout(resolve, 1500))
				console.log("Paiement simulé avec succès!")
				setPaymentMessage("Paiement réussi!")
				
				setTimeout(() => {
					navigate("/payment/confirmation", {
						state: {
							success: true,
							paymentId: "pi_fake_" + Math.random().toString(36).substring(2, 15),
							packageName: packageName || "Pack standard"
						},
					})
				}, 1000)
			}
		} catch (error) {
			console.error("Erreur lors du paiement:", error)
			const errorMessage = "Une erreur est survenue lors du paiement."
			setPaymentMessage(errorMessage)
			setError(errorMessage)
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement 
				options={{
					layout: "tabs",
					defaultValues: {
						billingDetails: {
							name: "",
							email: "",
						}
					}
				}}
			/>

			<div className="mt-6 flex flex-col gap-4">
				<div className="text-sm text-gray-600">
					En procédant au paiement, vous acceptez nos{" "}
					<a href="/terms" className="text-primary-default underline">
						conditions générales
					</a>{" "}
					et notre{" "}
					<a
						href="/privacy"
						className="text-primary-default underline"
					>
						politique de confidentialité
					</a>
					.
				</div>

				<button
					type="submit"
					disabled={isProcessing || !isStripeReady}
					className="bg-primary-default mt-2 w-full rounded-md py-3 font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{isProcessing ? "Traitement en cours..." : "Payer maintenant"}
				</button>

				{paymentMessage && (
					<div
						className={`mt-4 text-center ${paymentMessage.includes("réussi") ? "text-green-600" : "text-red-600"}`}
					>
						{paymentMessage}
					</div>
				)}

				{!isStripeReady && (
					<div className="mt-2 text-center text-sm text-amber-600">
						Chargement des éléments de paiement...
					</div>
				)}
			</div>
		</form>
	)
}

export default StripePaymentForm

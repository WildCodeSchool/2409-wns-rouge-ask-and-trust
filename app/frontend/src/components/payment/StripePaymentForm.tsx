import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { useState } from "react"
import { Button } from "../ui/Button"

/**
 * StripePaymentForm Component
 *
 * Renders the Stripe payment form and handles the payment submission process.
 * Displays status messages based on the payment result.
 *
 * @component
 */
export default function StripePaymentForm() {
	const stripe = useStripe()
	const elements = useElements()
	const [isProcessing, setIsProcessing] = useState(false)
	const [message, setMessage] = useState("")

	/**
	 * Handles the form submission for Stripe payment.
	 *
	 * @param e - The form event
	 */
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!stripe || !elements) return
		setIsProcessing(true)
		setMessage("")
		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Optional: redirect URL after payment
					// return_url: window.location.origin + "/payment-confirmation"
				},
				redirect: "if_required",
			})
			if (error) setMessage(error.message || "Erreur lors du paiement")
			else setMessage("Paiement réussi !")
		} catch {
			setMessage("Erreur lors du paiement")
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
			{/* Displays available Stripe payment methods (card, etc.) */}
			<PaymentElement options={{ layout: "tabs" }} />
			<Button
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				className="bg-primary-700 mt-4"
				ariaLabel="Valider le paiement"
			>
				{isProcessing ? "Paiement en cours..." : "Paiement"}
			</Button>
			{/* Displays success or error message */}
			{message && (
				<div
					className={`mt-4 text-center ${message.includes("réussi") ? "text-validate-medium" : "text-destructive-medium"}`}
				>
					{message}
				</div>
			)}
			<div className="mt-4 text-center text-sm text-gray-500">
				Utilise la carte test Stripe : <b>4242 4242 4242 4242</b> (date
				et CVC au choix)
			</div>
		</form>
	)
}

/**
 * @packageDocumentation
 * @category Components
 * @description
 * This module provides the Stripe payment form component for handling payments.
 * It integrates with Stripe Elements and manages the payment flow.
 */

import { useState, useEffect } from "react"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { FormEvent } from "react"
import { useStripeContext } from "@/contexts/useStripeContext"

/**
 * StripePaymentForm Component
 * @description
 * A form component that handles Stripe payment processing using Stripe Elements.
 * It manages the payment flow, validation, and submission.
 */
const StripePaymentForm = () => {
	const stripe = useStripe()
	const elements = useElements()
	const { setError } = useStripeContext()

	const [isProcessing, setIsProcessing] = useState(false)
	const [paymentMessage, setPaymentMessage] = useState("")
	const [isStripeReady, setIsStripeReady] = useState(false)

	// Check if Stripe is ready
	useEffect(() => {
		if (stripe && elements) {
			console.log("Stripe and Elements are ready!")
			setIsStripeReady(true)
		} else {
			console.log("Stripe or Elements are not ready yet:", { stripe, elements })
		}
	}, [stripe, elements])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!stripe || !elements) {
			console.log("Stripe has not yet loaded")
			setError("Le système de paiement n'est pas encore prêt. Veuillez patienter.")
			return
		}

		setIsProcessing(true)
		setError(null)

		try {
			const { error: submitError } = await elements.submit()
			if (submitError) {
				throw submitError
			}

			const { error: confirmError } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/payment/confirmation`,
				},
			})

			if (confirmError) {
				throw confirmError
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
		<form id="payment-form" onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
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

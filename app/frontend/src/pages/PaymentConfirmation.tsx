/**
 * @packageDocumentation
 * @category Pages
 * @description
 * This module provides the PaymentConfirmation page component that displays
 * the result of a payment transaction, whether successful or failed.
 */

import { useLocation, Link } from "react-router-dom"
import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { VITE_STRIPE_PUBLIC_KEY } from "@/config/config"

interface PaymentLocationState {
	clientSecret?: string
}

const STRIPE_PK = VITE_STRIPE_PUBLIC_KEY
if (!STRIPE_PK || !STRIPE_PK.startsWith('pk_')) {
	throw new Error('Clé publique Stripe manquante ou invalide. Vérifie VITE_STRIPE_PUBLIC_KEY dans src/config/config.ts')
}
const stripePromise = loadStripe(STRIPE_PK)

function StripePaymentForm() {
	const stripe = useStripe()
	const elements = useElements()
	const [isProcessing, setIsProcessing] = useState(false)
	const [message, setMessage] = useState("")

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!stripe || !elements) return
		setIsProcessing(true)
		setMessage("")
		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Optionnel: url de redirection après paiement
					// return_url: window.location.origin + "/payment-confirmation"
				},
				redirect: "if_required"
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
			<PaymentElement options={{ layout: "tabs" }} />
			<button
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				className="bg-primary-default mt-4 w-full rounded-md py-3 font-medium text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
			>
				{isProcessing ? "Traitement en cours..." : "Payer"}
			</button>
			{message && (
				<div className={`mt-4 text-center ${message.includes("réussi") ? "text-green-600" : "text-red-600"}`}>
					{message}
				</div>
			)}
			<div className="mt-4 text-sm text-gray-500 text-center">
				Utilise la carte test Stripe : <b>4242 4242 4242 4242</b> (date et CVC au choix)
			</div>
		</form>
	)
}

/**
 * PaymentConfirmation Page Component
 * @description
 * A page that displays the result of a payment transaction.
 * It shows different content based on whether the payment was successful or failed.
 */
const PaymentConfirmation = () => {
	const location = useLocation()
	const state = location.state as PaymentLocationState | null
	const clientSecret = state?.clientSecret || null

	return (
		<div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
			<div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
				<h1 className="mb-4 text-2xl font-bold">Confirmation du paiement</h1>
				{clientSecret ? (
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<StripePaymentForm />
					</Elements>
				) : (
					<div className="text-red-600">Aucun client_secret reçu.</div>
				)}
				<Link
					to="/payment"
					className="mt-6 inline-block rounded bg-primary-default px-4 py-2 font-medium text-white hover:opacity-90"
				>
					Revenir à la page de paiement
				</Link>
			</div>
		</div>
	)
}

export default PaymentConfirmation

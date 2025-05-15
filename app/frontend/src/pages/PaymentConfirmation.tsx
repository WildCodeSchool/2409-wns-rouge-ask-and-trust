/**
 * @packageDocumentation
 * @category Pages
 * @description
 * Cette page affiche le résultat d'une transaction de paiement Stripe (succès ou échec).
 */

import { useLocation } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { VITE_STRIPE_PUBLIC_KEY } from "@/config/config"
import StripePaymentForm from "@/components/payment/StripePaymentForm"
import { Button } from "@/components/ui/Button"
import { Helmet } from "react-helmet"

/**
 * Interface for the state passed via navigation
 */
interface PaymentLocationState {
	clientSecret?: string
}

// Initialize Stripe with the public key
const STRIPE_PK = VITE_STRIPE_PUBLIC_KEY
if (!STRIPE_PK || !STRIPE_PK.startsWith("pk_")) {
	throw new Error(
		"Missing or invalid Stripe public key. Check VITE_STRIPE_PUBLIC_KEY in src/config/config.ts"
	)
}
const stripePromise = loadStripe(STRIPE_PK)

/**
 * PaymentConfirmation React component
 *
 * @returns {React.ReactElement}
 */
export default function PaymentConfirmation(): React.ReactElement {
	// Retrieve the clientSecret passed via navigation
	const location = useLocation()
	const state = location.state as PaymentLocationState | null
	const clientSecret = state?.clientSecret || null

	return (
		<>
			<Helmet>
				<title>Payment</title>
				<meta
					name="description"
					content="Page de confirmation du paiement de l'enquête."
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta property="og:title" content="Paiement de l'enquête" />
				<meta
					property="og:description"
					content="Page de confirmation du paiement de l'enquête."
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Paiement de l'enquête" />
				<meta
					name="twitter:description"
					content="Page de confirmation du paiement de l'enquête."
				/>
			</Helmet>

			<div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
				<div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
					<h1 className="mb-4 text-2xl font-bold">
						Confirmation du paiement
					</h1>
					{/* Display the Stripe form if the clientSecret is present */}
					{clientSecret ? (
						<Elements
							stripe={stripePromise}
							options={{ clientSecret }}
						>
							<StripePaymentForm />
						</Elements>
					) : (
						<div className="text-destructive-medium">
							Aucun client_secret reçu.
						</div>
					)}
					{/* Link to return to the payment page */}
					<Button
						to="/payment"
						className="bg-primary-700 mt-4"
						ariaLabel="Revenir à la page de paiement"
					>
						Revenir à la page de paiement
					</Button>
				</div>
			</div>
		</>
	)
}

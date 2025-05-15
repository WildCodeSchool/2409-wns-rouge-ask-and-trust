/**
 * @packageDocumentation
 * @category Pages
 * @description
 * This module provides the Payment page component that handles the payment flow,
 * including package selection, order summary, and payment processing.
 */

import { useState } from "react"
import { useMutation } from "@apollo/client"
import { CREATE_PAYMENT_INTENT } from "@/graphql/payment"
import { Helmet } from "react-helmet"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Package } from "@/types/types"

const PACKS: Package[] = [
	{
		label: "Pack 50 enquêtes",
		amount: 2999,
		price: "29,99 €",
		surveyCount: 50,
		description: "Achat de Pack 50 enquêtes",
	},
	{
		label: "Pack 100 enquêtes",
		amount: 5999,
		price: "59,99 €",
		surveyCount: 100,
		description: "Achat de Pack 100 enquêtes",
	},
]

/**
 * Payment Page Component
 *
 * Handles the purchase of survey packs and the creation of a Stripe PaymentIntent.
 *
 * @component
 */
export default function Payment() {
	// State for error display and loading status
	const [error, setError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
	const [selectedPack, setSelectedPack] = useState<number>(0)
	// Apollo hook for the Stripe PaymentIntent creation mutation
	const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT)
	const navigate = useNavigate()

	/**
	 * Handles the click event to create a Stripe PaymentIntent and navigate to the confirmation page.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	const handleCreatePayment = async (): Promise<void> => {
		setLoading(true)
		setError("")
		const pack = PACKS[selectedPack]
		try {
			// Call the GraphQL mutation to create a Stripe PaymentIntent
			const { data } = await createPaymentIntent({
				variables: {
					input: {
						amount: pack.amount, // in cents
						currency: "eur",
						description: pack.description,
						surveyCount: pack.surveyCount,
					},
				},
			})
			// If the clientSecret is returned, navigate to the confirmation page
			if (data && data.createPaymentIntent) {
				navigate("/payment-confirmation", {
					state: {
						clientSecret: data.createPaymentIntent,
						success: true,
					},
				})
			} else {
				setError("Erreur : Pas de client_secret retourné.")
			}
		} catch (err: unknown) {
			// Handle errors during payment creation
			if (err && typeof err === "object" && "message" in err) {
				setError(
					(err as { message?: string }).message ||
						"Erreur lors de la création du paiement"
				)
			} else {
				setError("Erreur lors de la création du paiement")
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			{/* SEO and meta tags for the payment page */}
			<Helmet>
				<title>Payment</title>
				<meta
					name="description"
					content="Page de paiement de l'enquête."
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta property="og:title" content="Paiement de l'enquête" />
				<meta
					property="og:description"
					content="Page de paiement de l'enquête."
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Paiement de l'enquête" />
				<meta
					name="twitter:description"
					content="Page de paiement de l'enquête."
				/>
			</Helmet>

			<div className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-8">
				<div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
					<h1 className="text-black-default mb-4 text-center text-3xl font-bold">
						Paiement de Pack d'enquêtes
					</h1>
					<div className="mb-6 flex flex-col gap-4">
						{PACKS.map((pack, idx) => (
							<button
								key={pack.label}
								type="button"
								className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all duration-150 ${
									selectedPack === idx
										? "border-primary-700 bg-primary-50 text-primary-700 font-bold shadow"
										: "text-black-default hover:border-primary-700 border-gray-200 bg-white"
								}`}
								onClick={() => setSelectedPack(idx)}
							>
								<div className="flex items-center justify-between">
									<span>{pack.label}</span>
									<span className="text-lg font-bold">
										{pack.price}
									</span>
								</div>
							</button>
						))}
					</div>
					<div className="flex flex-col items-center gap-4">
						<Button
							className="bg-primary-700 mt-4 w-full py-3 text-lg"
							onClick={handleCreatePayment}
							disabled={loading}
							ariaLabel={`Payer le ${PACKS[selectedPack].label}`}
						>
							{loading
								? "Création en cours..."
								: `Payer ${PACKS[selectedPack].price}`}
						</Button>
						{error && (
							<div className="text-destructive-medium mt-4 text-center">
								{error}
							</div>
						)}
					</div>
					<div className="text-black-400 mt-6 text-center text-sm">
						Paiement 100% sécurisé via Stripe
					</div>
				</div>
			</div>
		</>
	)
}

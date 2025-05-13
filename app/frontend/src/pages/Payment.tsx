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

export default function Payment() {
	const [error, setError] = useState<string>("")
	const [loading, setLoading] = useState(false)
	const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT)
	const navigate = useNavigate()

	const handleCreatePayment = async () => {
		setLoading(true)
		setError("")
		try {
			const { data } = await createPaymentIntent({
				variables: {
					input: {
						amount: 2999, // 29,99€ en centimes
						currency: "eur",
						description: "Achat de Pack Test",
						surveyCount: 50,
					},
				},
			})
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

			<div className="container mx-auto px-4 py-8">
				<h1 className="mb-8 text-center text-2xl font-bold">
					Paiement de Pack d'enquêtes
				</h1>
				<div className="flex flex-col items-center gap-4">
					<button
						className="bg-primary-default rounded px-4 py-2 text-white"
						onClick={handleCreatePayment}
						disabled={loading}
					>
						{loading
							? "Création en cours..."
							: "Paiement de Pack d'enquêtes"}
					</button>
					{error && (
						<div className="mt-4 text-center text-red-600">
							{error}
						</div>
					)}
				</div>
			</div>
		</>
	)
}

/**
 * @packageDocumentation
 * @category Pages
 * @description
 * This module provides the Payment page component that handles the payment flow,
 * including package selection, order summary, and payment processing.
 */

import { Helmet } from "react-helmet"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Package } from "@/types/types"
import { PackageSelection } from "@/components/sections/payment/PackageSelection"
import { OrderSummary } from "@/components/sections/payment/OrderSummary"
import { PaymentSection } from "@/components/sections/payment/PaymentSection"
import Loader from "@/components/ui/Loader"
import { useStripeContext } from "@/contexts/useStripeContext"
import { gql, useMutation } from "@apollo/client"

/**
 * Available packages for purchase
 * @description
 * Defines the packages that users can purchase, including their features and pricing.
 */
const packages: Package[] = [
	{
		id: "pack50",
		name: "Pack 50 enquêtes",
		price: 29.99,
		surveyCount: 50,
		features: [
			"1 enquête offerte",
			"Questions illimitées",
			"Participer aux enquêtes en illimité",
		],
	},
	{
		id: "pack100",
		name: "Pack 100 enquêtes",
		price: 59.99,
		surveyCount: 100,
		features: [
			"1 enquête offerte",
			"Questions illimitées",
			"Participer aux enquêtes en illimité",
		],
	},
]

/**
 * GraphQL mutation for creating a payment intent
 * @description
 * This mutation is used to create a payment intent on the server.
 */
const CREATE_PAYMENT_INTENT = gql`
	mutation CreatePaymentIntent($amount: Float!, $currency: String!, $description: String!, $surveyCount: Int!) {
		createPaymentIntent(amount: $amount, currency: $currency, description: $description, surveyCount: $surveyCount)
	}
`

/**
 * Payment Page Component
 * @description
 * The main payment page that allows users to select a package, view the order summary,
 * and complete the payment process using Stripe.
 * 
 * @example
 * ```tsx
 * // In your router
 * <Route path="/payment" element={<Payment />} />
 * ```
 */
function Payment() {
	const { clientSecret, setClientSecret, loading, setLoading, error, setError } = useStripeContext()
	const location = useLocation()
	const [selectedPackage, setSelectedPackage] = useState<Package>(packages[0])
	
	// GraphQL mutation for creating a payment intent
	const [createPaymentIntentMutation] = useMutation(CREATE_PAYMENT_INTENT)

	/**
	 * Get the selected package from location state or default to the first package
	 * @description
	 * This effect runs when the component mounts or when the location state changes.
	 * It sets the selected package based on the location state or defaults to the first package.
	 */
	useEffect(() => {
		if (location.state?.package) {
			setSelectedPackage(location.state.package)
		}
	}, [location.state?.package])

	/**
	 * Create a payment intent when the selected package changes
	 * @description
	 * This effect runs when the selected package changes.
	 * It creates a payment intent on the server using the GraphQL mutation.
	 */
	useEffect(() => {
		// Create a PaymentIntent on the server using GraphQL
		const createPaymentIntent = async () => {
			try {
				setLoading(true)
				
				const { data } = await createPaymentIntentMutation({
					variables: {
						amount: selectedPackage.price * 100, // Convert to cents for Stripe
						currency: "eur",
						description: `Achat de ${selectedPackage.name}`,
						surveyCount: selectedPackage.surveyCount,
					},
				})

				if (data && data.createPaymentIntent) {
					setClientSecret(data.createPaymentIntent)
				} else {
					throw new Error("Erreur lors de la création du paiement")
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Une erreur est survenue lors de la création du paiement"
				)
				console.error("Erreur:", err)
			} finally {
				setLoading(false)
			}
		}
		createPaymentIntent()
	}, [selectedPackage, createPaymentIntentMutation, setClientSecret, setLoading, setError])

	/**
	 * Handle package selection
	 * @param pkg - The selected package
	 * @description
	 * This function is called when a user selects a package.
	 * It updates the selected package state.
	 */
	const handlePackageSelect = (pkg: Package) => {
		setSelectedPackage(pkg)
	}

	if (loading) {
		return <Loader />
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

			<div className="container mx-auto px-4 py-4">
				<h1 className="mb-8 text-center text-3xl font-bold">
					Choisissez votre offre
				</h1>

				{error && (
					<div className="mb-6 rounded-md bg-red-50 p-4 text-red-700">
						<p>{error}</p>
					</div>
				)}

				<div className="flex flex-col gap-8">
					{/* Section des packages */}
					<div className="w-full">
						<PackageSelection
							packages={packages}
							selectedPackage={selectedPackage}
							onPackageSelect={handlePackageSelect}
						/>
					</div>

					{/* Section du paiement */}
					<div className="w-full max-w-2xl mx-auto">
						<OrderSummary selectedPackage={selectedPackage} />
						<PaymentSection
							clientSecret={clientSecret || ""}
							loading={loading}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default Payment

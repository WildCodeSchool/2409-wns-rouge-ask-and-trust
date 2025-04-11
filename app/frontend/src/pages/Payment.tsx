import { Helmet } from "react-helmet"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Package } from "@/types/types"
import { PackageSelection } from "@/components/sections/payment/PackageSelection"
import { OrderSummary } from "@/components/sections/payment/OrderSummary"
import { PaymentSection } from "@/components/sections/payment/PaymentSection"
import Loader from "@/components/ui/Loader"
import { useStripeContext } from "@/contexts/StripeContextProvider"

// Définition des packages disponibles
const packages: Package[] = [
	{
		id: "pack50",
		name: "Pack 50 enquêtes",
		price: 29.99,
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
		features: [
			"1 enquête offerte",
			"Questions illimitées",
			"Participer aux enquêtes en illimité",
		],
	},
]

function Payment() {
	const { clientSecret, setClientSecret, loading, setLoading, error, setError } = useStripeContext()
	const location = useLocation()
	const [selectedPackage, setSelectedPackage] = useState<Package>(packages[0])

	// Get the selected package from location state or default to the first package
	useEffect(() => {
		if (location.state?.package) {
			setSelectedPackage(location.state.package)
		}
	}, [location.state?.package])

	useEffect(() => {
		// Create a PaymentIntent on the server
		const createPaymentIntent = async () => {
			try {
				setLoading(true)
				console.log("Création d'un PaymentIntent simulé...")
				/**
				 * @todo: back no fonctionnelle
				 * */
				// const response = await fetch("/api/create-payment-intent", {
				// 	method: "POST",
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 	},
				// 	body: JSON.stringify({
				// 		amount: selectedPackage.price * 100, // Convert to cents for Stripe
				// 		currency: "eur",
				// 		description: `Achat de ${selectedPackage.name}`,
				// 	}),
				// })

				// if (!response.ok) {
				// 	throw new Error("Erreur lors de la création du paiement")
				// }

				// const data = await response.json()
				// setClientSecret(data.clientSecret)

				// Simuler un délai réseau
				await new Promise(resolve => setTimeout(resolve, 1000))

				// Simuler une réponse réussie avec un clientSecret valide
				// Format: pi_XXXX_secret_YYYY
				const fakeClientSecret =
					"pi_" +
					Math.random().toString(36).substring(2, 10) +
					"_secret_" +
					Math.random().toString(36).substring(2, 15)

				console.log("ClientSecret simulé créé:", fakeClientSecret)
				setClientSecret(fakeClientSecret)
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Une erreur est survenue"
				)
				console.error("Erreur:", err)
			} finally {
				setLoading(false)
			}
		}
		createPaymentIntent()
	}, [selectedPackage, setClientSecret, setLoading, setError])

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
							selectedPackage={selectedPackage}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default Payment

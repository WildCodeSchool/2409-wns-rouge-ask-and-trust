/**
 * @packageDocumentation
 * @category Pages
 * @description
 * This module provides the PaymentConfirmation page component that displays
 * the result of a payment transaction, whether successful or failed.
 */

import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { CheckCircle, XCircle } from "lucide-react"

/**
 * Payment Status Interface
 * @interface PaymentStatus
 * @description
 * Defines the structure of the payment status state.
 */
interface PaymentStatus {
	/** Whether the payment was successful */
	success: boolean
	/** Message to display to the user */
	message: string
	/** ID of the payment transaction */
	paymentId: string | null
}

/**
 * PaymentConfirmation Page Component
 * @description
 * A page that displays the result of a payment transaction.
 * It shows different content based on whether the payment was successful or failed.
 * 
 * @example
 * ```tsx
 * // In your router
 * <Route path="/payment/confirmation" element={<PaymentConfirmation />} />
 * ```
 */
const PaymentConfirmation = () => {
	const location = useLocation()
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
		success: false,
		message: "Vérification du statut de paiement...",
		paymentId: null,
	})

	/**
	 * Check payment status from URL parameters or location state
	 * @description
	 * This effect runs when the component mounts.
	 * It checks the URL parameters and location state to determine the payment status.
	 */
	useEffect(() => {
		// Check if we have state from the redirect
		if (location.state?.success) {
			setPaymentStatus({
				success: true,
				message: "Votre paiement a été traité avec succès!",
				paymentId: location.state.paymentId,
			})
			return
		}

		// Otherwise, check the URL for the payment_intent parameter
		const query = new URLSearchParams(window.location.search)
		const paymentIntent = query.get("payment_intent")
		const redirectStatus = query.get("redirect_status")

		if (paymentIntent) {
			if (redirectStatus === "succeeded") {
				setPaymentStatus({
					success: true,
					message: "Votre paiement a été traité avec succès!",
					paymentId: paymentIntent,
				})
			} else {
				setPaymentStatus({
					success: false,
					message: "Le paiement n'a pas pu être complété.",
					paymentId: paymentIntent,
				})
			}
		}
	}, [location])

	return (
		<div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-8">
			<div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
				{paymentStatus.success ? (
					<CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
				) : (
					<XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
				)}

				<h1 className="mb-2 text-2xl font-bold">
					{paymentStatus.success
						? "Paiement réussi!"
						: "Échec du paiement"}
				</h1>

				<p className="mb-6 text-gray-600">{paymentStatus.message}</p>

				{paymentStatus.success && (
					<div className="mb-6 rounded-md bg-gray-50 p-4 text-left text-sm">
						<p className="mb-1">
							<span className="font-medium">
								ID de transaction:
							</span>{" "}
							{paymentStatus.paymentId}
						</p>
						<p>
							<span className="font-medium">Date:</span>{" "}
							{new Date().toLocaleDateString()}
						</p>
					</div>
				)}

				<div className="flex flex-col gap-3">
					<Link
						to={paymentStatus.success ? "/dashboard" : "/payment"}
						className="bg-primary-default rounded-md py-3 font-medium text-white transition-all hover:opacity-90"
					>
						{paymentStatus.success
							? "Accéder à mon espace"
							: "Réessayer"}
					</Link>

					<Link
						to="/"
						className="rounded-md border border-gray-300 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
					>
						Retour à l'accueil
					</Link>
				</div>
			</div>
		</div>
	)
}

export default PaymentConfirmation

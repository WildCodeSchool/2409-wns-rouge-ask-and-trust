/**
 * @packageDocumentation
 * @category Components
 * @description
 * This module provides the PaymentSection component that wraps the Stripe Elements
 * and payment form for a complete payment experience.
 */

import { Elements } from "@stripe/react-stripe-js"
import StripePaymentForm from "./StripePaymentForm"
import { useStripeContext } from "@/contexts/useStripeContext"
import { stripePromise } from "@/contexts/stripeUtils"

/**
 * Props for the PaymentSection component
 * @interface PaymentSectionProps
 * @description
 * Defines the required properties for the PaymentSection component.
 */
interface PaymentSectionProps {
  /** The client secret from the payment intent */
  clientSecret: string
  /** Loading state for the payment section */
  loading: boolean
}

/**
 * PaymentSection Component
 * @description
 * A component that provides a complete payment experience using Stripe Elements.
 * It handles the Stripe Elements initialization and displays the payment form.
 * 
 * @example
 * ```tsx
 * <PaymentSection 
 *   clientSecret="pi_1234567890_secret_1234567890" 
 *   loading={false} 
 * />
 * ```
 */
export function PaymentSection({ clientSecret, loading }: PaymentSectionProps) {
  const { error } = useStripeContext()
  
  /**
   * Stripe Elements appearance configuration
   * @description
   * Customizes the appearance of Stripe Elements to match the application's design.
   */
  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#4F46E5",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "8px",
      colorBackground: "#ffffff",
      colorText: "#1a1f36",
      colorDanger: "#df1b41",
      spacingUnit: "4px",
      spacingGridRow: "16px",
      spacingGridColumn: "16px",
    },
  }

  /**
   * Stripe Elements options
   * @description
   * Configuration options for the Stripe Elements instance.
   */
  const options = {
    clientSecret,
    appearance,
    loader: "auto" as const,
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Paiement</h2>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="border-primary-default h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      ) : (
        clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <StripePaymentForm />
          </Elements>
        )
      )}
      
      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
} 
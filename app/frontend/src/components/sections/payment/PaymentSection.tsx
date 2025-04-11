import { Elements } from "@stripe/react-stripe-js"
import StripePaymentForm from "./StripePaymentForm"
import { Package } from "@/types/types"
import { useStripeContext, stripePromise } from "@/contexts/StripeContextProvider"

interface PaymentSectionProps {
  clientSecret: string
  loading: boolean
  selectedPackage: Package
}

export function PaymentSection({ clientSecret, loading, selectedPackage }: PaymentSectionProps) {
  const { error } = useStripeContext()
  
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
            <StripePaymentForm packageName={selectedPackage.name} />
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
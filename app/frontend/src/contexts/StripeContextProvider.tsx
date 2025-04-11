import { ReactNode, createContext, useContext, useState } from "react"
import { CheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface StripeContextType {
  clientSecret: string | null
  setClientSecret: (secret: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

interface StripeContextProviderProps {
  children: ReactNode
}

export function StripeContextProvider({ children }: StripeContextProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour récupérer le clientSecret
  const fetchClientSecret = () => {
    // En mode développement, nous simulons la récupération du clientSecret
    // En production, cette fonction devrait faire un appel API pour obtenir le clientSecret
    return new Promise<string>((resolve) => {
      // Simuler un délai réseau
      setTimeout(() => {
        // Simuler une réponse réussie avec un clientSecret valide
        // Format: pi_XXXX_secret_YYYY
        const fakeClientSecret =
          "pi_" +
          Math.random().toString(36).substring(2, 10) +
          "_secret_" +
          Math.random().toString(36).substring(2, 15)
        
        resolve(fakeClientSecret)
      }, 1000)
    })
  }

  const value = {
    clientSecret,
    setClientSecret,
    loading,
    setLoading,
    error,
    setError,
  }

  return (
    <StripeContext.Provider value={value}>
      <CheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        {children}
      </CheckoutProvider>
    </StripeContext.Provider>
  )
}

export function useStripeContext() {
  const context = useContext(StripeContext)
  if (context === undefined) {
    throw new Error("useStripeContext must be used within a StripeContextProvider")
  }
  return context
} 
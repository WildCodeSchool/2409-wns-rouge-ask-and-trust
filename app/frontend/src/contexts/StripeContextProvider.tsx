/**
 * @packageDocumentation
 * @category Providers
 * @description
 * This module provides the StripeContextProvider component that makes the Stripe context
 * available throughout the application.
 */
import { ReactNode, useState } from "react"
import { StripeContext, StripeContextType } from "./StripeContext"

/**
 * Props for the StripeContextProvider component
 * @interface StripeContextProviderProps
 * @description
 * Defines the required properties for the StripeContextProvider component.
 */
interface StripeContextProviderProps {
    /** The children components that will have access to the Stripe context */
    children: ReactNode
  }

export function StripeContextProvider({ children }: StripeContextProviderProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
  
    /**
     * The context value that will be provided to all child components
     * @description
     * Contains the state and methods for payment operations.
     */
    const value: StripeContextType = {
      clientSecret,
      setClientSecret,
      loading,
      setLoading,
      error,
      setError,
    }
  
    return (
      <StripeContext.Provider value={value}>
        {children}
      </StripeContext.Provider>
    )
  }

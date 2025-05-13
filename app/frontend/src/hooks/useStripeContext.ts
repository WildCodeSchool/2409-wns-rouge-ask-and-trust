/**
 * @packageDocumentation
 * @category Hooks
 * @description
 * This module provides the useStripeContext hook for accessing the Stripe context
 * throughout the application.
 */

import { useContext } from "react"
import { StripeContext } from "@/contexts/StripeContext"

/**
 * useStripeContext Hook
 * @description
 * A custom hook that provides access to the Stripe context.
 * It must be used within a component that is wrapped by the StripeContextProvider.
 * 
 * @returns The Stripe context containing payment state and methods
 * @throws Error if used outside of a StripeContextProvider
 */
export function useStripeContext() {
  const context = useContext(StripeContext)

  if (context === undefined) {
    throw new Error("useStripeContext must be used within a StripeContextProvider")
  }

  return context
} 
/**
 * @packageDocumentation
 * @category Contexts
 * @description
 * This module provides the Stripe context for managing payment state across the application.
 * It includes types and context creation for Stripe integration.
 */

import { createContext } from "react"

/**
 * Type definition for the Stripe context
 * @interface StripeContextType
 * @description
 * Defines the shape of the Stripe context, including payment state and methods.
 */
export interface StripeContextType {
  /** The client secret for the current payment intent */
  clientSecret: string | null
  /** Function to set the client secret */
  setClientSecret: (secret: string | null) => void
  /** Loading state for payment operations */
  loading: boolean
  /** Function to set loading state */
  setLoading: (loading: boolean) => void
  /** Error state for payment operations */
  error: string | null
  /** Function to set error state */
  setError: (error: string | null) => void
}

/**
 * Creates the Stripe context with undefined as initial value
 * @remarks
 * The context is initialized as undefined and must be provided
 * through the StripeContextProvider component.
 */
export const StripeContext = createContext<StripeContextType | undefined>(undefined) 
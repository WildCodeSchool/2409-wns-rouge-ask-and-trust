/**
 * @packageDocumentation
 * @category Utils
 * @description
 * This module provides utility functions for Stripe integration.
 * It handles Stripe initialization and provides common Stripe-related utilities.
 */

import { loadStripe } from "@stripe/stripe-js"

/**
 * Stripe Promise
 * @description
 * A promise that resolves to a Stripe instance.
 * This is used to initialize Stripe with the publishable key.
 * 
 * @remarks
 * The publishable key is loaded from environment variables.
 * For development, use the test publishable key.
 * For production, use the live publishable key.
 */
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) 
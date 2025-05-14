/**
 * @packageDocumentation
 * @category Hooks
 * @description
 * This module provides the useAuthContext hook for accessing the authentication context
 * throughout the application.
 */

import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

/**
 * useAuthContext Hook
 * @description
 * A custom hook that provides access to the authentication context.
 * It must be used within a component that is wrapped by the AuthProvider.
 *
 * @returns The authentication context containing user state and methods
 * @throws Error if used outside of an AuthProvider
 */
export function useAuthContext() {
	const context = useContext(AuthContext)

	if (context === undefined) {
		throw new Error("useAuthContext must be used within an AuthProvider")
	}

	return context
}

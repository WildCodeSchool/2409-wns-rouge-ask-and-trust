/**
 * @fileoverview Higher Order Component for protecting routes that require authentication
 * @module ProtectedRoute
 */

import Loader from "@/components/ui/Loader"
import { useAuthContext } from "@/hooks/useAuthContext"
import AuthRequired from "@/components/sections/auth/AuthRequired"

/**
 * ProtectedRoute Component
 *
 * A Higher Order Component that protects routes requiring authentication.
 * It checks if the user is authenticated and:
 * - Shows a loader while checking authentication status
 * - Shows the AuthRequired component if the user is not authenticated
 * - Renders the protected content if the user is authenticated
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be protected
 * @returns {JSX.Element} The rendered protected route content or authentication required message
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user, isLoading } = useAuthContext()

	// If the authentication state is still loading, show the loader
	if (isLoading) {
		return <Loader />
	}

	// If there is no user (not authenticated), show the AuthRequired component
	if (!user) {
		return <AuthRequired />
	}

	// If user is authenticated, render the children components
	return <>{children}</>
}

export default ProtectedRoute

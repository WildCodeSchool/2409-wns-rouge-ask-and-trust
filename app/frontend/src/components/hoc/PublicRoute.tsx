/**
 * @fileoverview Higher Order Component for protecting public routes from authenticated users
 * @module PublicRoute
 */

import Loader from "@/components/ui/Loader"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useNavigate } from "react-router-dom"

/**
 * PublicRoute Component
 *
 * A Higher Order Component that restricts access to routes intended for unauthenticated users.
 * It checks if the user is authenticated and:
 * - Shows a loader while checking authentication status
 * - Redirects to surveys page if the user is authenticated
 * - Renders the public content if the user is not authenticated
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The public content to be rendered when user is not authenticated
 * @returns {JSX.Element | null} The rendered public route content, loader, or redirects authenticated users
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, isLoading } = useAuthContext()
	const navigate = useNavigate()

	// Show loader while auth status is loading
	if (isLoading) {
		return <Loader />
	}

	// Redirect authenticated users to surveys page
	if (user) {
		navigate("/surveys", { replace: true })
		return null
	}

	// Render public content if user is not authenticated
	return <>{children}</>
}

export default PublicRoute

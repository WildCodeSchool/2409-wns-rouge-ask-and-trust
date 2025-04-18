import { createContext } from "react"
import { User } from "@/types/types"

/**
 * Type definition for the Auth context
 * @interface AuthContextType
 * @description
 * Defines the shape of the Auth context, including user state and authentication methods.
 */
export interface AuthContextType {
	/** The current authenticated user */
	user: User | null
	/** Loading state for authentication operations */
	isLoading: boolean
	/** Function to refetch the current user data */
	refetchUser: () => void
	/** Function to logout the current user */
	logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
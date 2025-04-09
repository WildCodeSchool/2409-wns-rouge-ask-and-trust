import React, { createContext, useEffect, useState, useCallback } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { LOGOUT, WHOAMI } from "@/graphql/auth"
import { AuthContextProps, User } from "@/types/types"

export const AuthContext = createContext<AuthContextProps | undefined>(
	undefined
)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	// Query whoami to fetch the user
	const { data, loading, error, refetch } = useQuery<{ whoami: User }>(
		WHOAMI,
		{
			fetchPolicy: "network-only", // Ensure fresh data on each load
		}
	)

	// Mutation to logout
	const [logoutMutation] = useMutation(LOGOUT)

	// Update user state based on query result
	useEffect(() => {
		if (!loading && !error) {
			setUser(data?.whoami || null)
		}
		setIsLoading(loading)
	}, [data, loading, error])

	const logout = useCallback(async () => {
		try {
			await logoutMutation() // Call the logout mutation
			setUser(null) // Clear the user state
			refetch() // Optionally refetch to reset WHOAMI query state
		} catch (error) {
			console.error("Logout failed", error)
		}
	}, [logoutMutation, refetch])

	return (
		<AuthContext.Provider
			value={{ user, isLoading, refetchUser: refetch, logout }}
		>
			{children}
		</AuthContext.Provider>
	)
}

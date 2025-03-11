export type AuthContextProps = {
	user: User | null
	isLoading: boolean
	refetchUser: () => void
	logout: () => void
}

export interface User {
	id: string
	email: string
	// ... other user properties
}

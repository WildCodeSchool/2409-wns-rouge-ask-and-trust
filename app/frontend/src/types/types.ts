import { LucideIcon } from "lucide-react"

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

export interface UserAuth {
	firstname: string
	lastname: string
	email: string
	password: string
}

export type UserSignUp = UserAuth
export type UserSignIn = Pick<UserAuth, "email" | "password">

export interface FooterLinkType {
	href: string
	label: string
	category: string
	ariaLabel: string
	Icon?: LucideIcon
}

import { LucideIcon } from "lucide-react"
import { UserRole } from "backend/src/types/types"

export type AuthContextProps = {
	user: User | null
	isLoading: boolean
	refetchUser: () => void
	logout: () => void
}

export interface User {
	id: string
	firstname: string
	lastname: string
	email: string
	password: string
	role: UserRole
	created_at: string
	updated_at: string
}

export interface LinksType {
	href: string
	label: string
	category: string
	ariaLabel: string
	Icon?: LucideIcon
}

export type UserSignUp = User
export type UserSignIn = Pick<User, "email" | "password">
export type UserSignForm = UserSignUp | UserSignIn

export interface FooterLinkType {
	href: string
	label: string
	category: string
	ariaLabel: string
	Icon?: LucideIcon
}

export interface ErrorLayoutProps {
	children: React.ReactNode
}

export interface HeaderMobileMenuProps {
	showMenu: boolean
	handleShowMenu: () => void
	headerLinks: readonly LinksType[]
}

export interface NavAndAuthButtonsProps {
	headerLinks: readonly LinksType[]
	isMobile: boolean
}

export interface SurveyCardType {
	href: string
	picture: string
	title: string
	content: string
	tag: string
	estimateTime: number
	timeLeft: string
}

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

export interface LinksType {
	href: string
	label: string
	category: string
	ariaLabel: string
	Icon?: LucideIcon
}

export interface UserAuth {
	firstname: string
	lastname: string
	email: string
	password: string
}

export type UserSignUp = UserAuth
export type UserSignIn = Pick<UserAuth, "email" | "password">
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

export type Package = {
	id: string
	name: string
	price: number
	surveyCount: number
	features: string[]
} 
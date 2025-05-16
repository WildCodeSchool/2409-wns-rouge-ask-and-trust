import { LucideIcon } from "lucide-react"
import { UserRole } from "./../../../backend/src/types/types"

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
	role: UserRole
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
	handleShowMenu?: () => void
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
	label: string
	amount: number
	price: string
	surveyCount: number
	description: string
}

export type ToolboxCategory = {
	id: string
	title: string
	items: ToolboxItem[]
}

export type ToolboxItem = {
	id: string
	label: string
	icon?: React.ReactNode
	onClickType: string
	onClick?: () => void
}

export interface ToolboxProps {
	className?: string
	items?: ToolboxItem[]
	categories?: ToolboxCategory[]
	showSearch?: boolean
	searchManager?: SearchManager
	compactThreshold?: number
	horizontalThreshold?: number
	noResultsText?: string
}

export interface SearchManager {
	value: string
	onChange: (value: string) => void
	placeholder?: string
}

export type CreateSurveyInput = {
	title: string
	description: string
	public: boolean
	category: number | string
}

export type Question = {
	id: string
	content: string
	answers: string
}
export interface QuestionUpdate {
	id: number
	title?: string
	description?: string
	type?: "text" | "text-area" | "checkbox" | "radio" | "boolean" | "select" // faire enum ici
	answers: Record<string, AnswerValue>
}

export type AnswerValue = boolean | string | number | string[]

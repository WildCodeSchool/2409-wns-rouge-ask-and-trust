import { LucideIcon } from "lucide-react"
import { UserRole } from "backend/src/types/types"
import { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { CheckedState } from "@radix-ui/react-checkbox"

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

export interface Survey {
	id: number
	title: string
	description: string
	public: boolean
	category: number | string
	questions: { id: number }[] // @TODO check this change in number
}

export type CreateSurveyInput = Survey

export type UpdateSurveyType = Survey

export type Question = {
	id: number
	title: string
	type: QuestionType
	answers: { value: string }[]
}

export interface QuestionUpdate {
	id: number
	title?: string
	type?: QuestionType
	answers?: { value: string }[]
	survey: {
		id: number
	}
}

export const TypesOfQuestion = {
	Text: "text",
	Multiple_Choice: "multiple_choice",
	Boolean: "boolean",
	Select: "select",
} as const

export const TypesOfQuestionLabels: Record<
	keyof typeof TypesOfQuestion,
	string
> = {
	Text: "Texte court",
	Multiple_Choice: "Liste à choix multiples",
	Boolean: "Oui / Non",
	Select: "Liste à choix unique",
}

export type QuestionType =
	(typeof TypesOfQuestion)[keyof typeof TypesOfQuestion]

export type InputsProps = {
	register: UseFormRegister<CreateSurveyInput>
	errors: FieldErrors<CreateSurveyInput>
}

export type SwitchProps = {
	errors: FieldErrors<CreateSurveyInput>
	control: Control<CreateSurveyInput>
}

export type CategoryOption = {
	value: string
	label: string
}

export type PaginationProps = {
	currentPage: number
	totalCount: number
	perPage: number
	onPageChange: (page: number) => void
	className?: string
}

export type SurveyTableType = {
	id: number
	title: string
	status: SurveyStatus
	createdAt: string
	updatedAt: string
}

export type SurveysDashboardQuery = {
	mySurveys: SurveyTableType[]
}

type SurveyStatus = "draft" | "published" | "archived" | "censored"

export type SurveyTableProps = {
	isHeaderChecked: CheckedState
	handleSelectAll: (checked: CheckedState) => void
	surveys: SurveyTableType[]
	selectedSurveyIds: number[]
	handleSurveyCheckboxChange: (
		surveyId: number,
		checked: CheckedState
	) => void
	statusLabelMap: Record<SurveyTableType["status"], string>
}

export type SurveyTableActionsProps = {
	surveyId: number
	status: string
}

export type SurveyTableNavProps = {
	showDeleteButton: boolean
	currentPage: number
	setCurrentPage: (page: number) => void
	sortedSurveys: SurveyTableType[]
	surveysPerPage: number
	selectedSurveyIds: number[]
}

type FilterOption = {
	label: string
	value: string
}

export type SelectFilterProps = {
	value: string
	onChange: (val: string) => void
	options: FilterOption[]
	placeholder?: string
	disabled?: boolean
}

export type SurveyTableFilterProps = {
	filters: string[]
	setFilters: (filters: string[]) => void
}

export type DateSortFilter = "Plus récente" | "Plus ancienne"

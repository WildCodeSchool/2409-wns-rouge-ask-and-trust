import { CheckedState } from "@radix-ui/react-checkbox"
import { LucideIcon } from "lucide-react"
import { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { UserRole } from "./../../../backend/src/types/types"

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
	surveys: Survey[]
	created_at: string
	updated_at: string
}

export interface LinksType {
	href: string
	label: string
	category: string
	ariaLabel: string
	mobileFooter?: boolean
	Icon?: LucideIcon
	bgBlue?: boolean
}

export interface UserAuth {
	firstname: string
	lastname: string
	email: string
	password: string
	role: UserRole
}

export type UserDetails = {
	user: User
	userSurveys: MySurveysResult | null
	showResetForm: boolean
	onToggleResetForm: () => void
}

export type UserSignUp = UserAuth
export type UserSignIn = Pick<UserAuth, "email" | "password">
export type UserSignForm = UserSignUp | UserSignIn

export interface ErrorLayoutProps {
	children: React.ReactNode
}

export interface NavAndAuthButtonsProps {
	links?: readonly LinksType[]
	isHorizontalCompact?: boolean
	handleShowMenu?: () => void
	isInSurveys?: boolean
	showMenu?: boolean
	isInHeader?: boolean
	isInFooter?: boolean
}

export type AuthButtonsProps = Pick<
	NavAndAuthButtonsProps,
	"isHorizontalCompact" | "isInHeader" | "isInFooter"
>

export type SurveyCategoryType = {
	id: string
	name: string
}

export interface SurveyCardType {
	id: string
	picture: string
	title: string
	description: string
	category: SurveyCategoryType
	estimatedDuration: number
	availableDuration: number
	status?: string
	user?: User
	isOwner?: boolean
}

export type AllSurveysResult<T> = {
	allSurveys: T[]
	totalCount: number
	totalCountAll: number
	page: number
	limit: number
}

export type AllSurveysType<T> = {
	surveys: AllSurveysResult<T>
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
	onClickType: QuestionType
	onClick?: () => void
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
	status: SurveyStatusType
	questions: Question[]
	user: User
}

export const SurveyStatus = {
	Draft: "draft",
	Published: "published",
	Archived: "archived",
	Censored: "censored",
} as const

export type SurveyStatusType = (typeof SurveyStatus)[keyof typeof SurveyStatus]

export type CreateSurveyInput = Survey

export type UpdateSurveyInput = Survey

export type Question = {
	id: number
	title: string
	type: QuestionType
	answers: { value: string }[]
	survey: {
		id: number
	}
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
	TextArea: "textarea",
	Checkbox: "checkbox",
	Radio: "radio",
	Boolean: "boolean",
	Select: "select",
} as const

export const TypesOfQuestionLabels: Record<
	keyof typeof TypesOfQuestion,
	string
> = {
	Text: "Texte court",
	TextArea: "Texte long",
	Checkbox: "Cases à cocher",
	Radio: "Liste à choix unique",
	Boolean: "Oui / Non",
	Select: "Liste déroulante",
}

export type QuestionType =
	(typeof TypesOfQuestion)[keyof typeof TypesOfQuestion]

export const MultipleAnswersType = [
	TypesOfQuestion.Checkbox,
	TypesOfQuestion.Radio,
	TypesOfQuestion.Select,
] as const

type MultipleAnswerType = (typeof MultipleAnswersType)[number]

export function isMultipleAnswerType(
	type: QuestionType
): type is MultipleAnswerType {
	return (MultipleAnswersType as readonly string[]).includes(type)
}

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
	status: SurveyStatusType
	createdAt: string
	updatedAt: string
}

export type MySurveysResult = {
	surveys: SurveyTableType[]
	totalCount: number
	totalCountAll: number
	page: number
	limit: number
}

export type SurveysDashboardQuery = {
	mySurveys: MySurveysResult
}

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

export type SurveyTableRowProps = {
	survey: SurveyTableType
	isChecked: boolean
	onCheckboxChange: (checked: CheckedState) => void
	statusLabel: string
	formatDate: (date: string) => string
}

export type SurveyTableHeadProps = Pick<
	SurveyTableProps,
	"isHeaderChecked" | "handleSelectAll"
>

export type SurveyTableActionsProps = {
	surveyId: number
	status: SurveyStatusType
}

export type SurveyTableNavProps = {
	showDeleteButton: boolean
	currentPage: number
	setCurrentPage: (page: number) => void
	totalCount: number
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

export type SurveyDurationFilterProps = {
	sortTimeOption: string
	setSortTimeOption: (filters: string) => void
}

export type DateSortFilter = "Plus récente" | "Plus ancienne"

// Survey Response Types
export interface QuestionResponse {
	questionId: number
	value: string | string[] | boolean
}

export interface SurveyResponseData {
	surveyId: number
	responses: QuestionResponse[]
	submittedAt?: Date
}

export interface SurveyResponseFormData {
	[key: string]: string | string[] | boolean
}

export type SurveyWithCategory = {
	id: number
	title: string
	description: string
	public: boolean
	category: {
		id: number
		name: string
	}
	questions: Question[]
	status: string
	user: User
	createdAt: string
	updatedAt: string
}

export type RawUser = {
	id: number | string
	email: string
	firstname: string
	lastname: string
	role: string
	createdAt?: string
	updatedAt?: string
	surveys?: { id: number | string }[]
}

export type UseSurveyOptions = {
	surveyId?: string
	mode?: "admin" | "profile" | "home"
}

export type PublishedRequiredType = {
	survey: Pick<Survey, "status">
}

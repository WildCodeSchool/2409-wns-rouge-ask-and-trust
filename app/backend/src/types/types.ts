import Cookies from "cookies"
import { User } from "../database/entities/user"

export type Context = {
	cookies: Cookies
	user: User | null | undefined
	req?: any // Request object from Apollo Server standalone
	res?: any // Response object from Apollo Server standalone
}

export type ContextUser = {
	cookies: Cookies
	user?: User | null
}

export const Roles = {
	User: "user",
	Moderator: "moderator",
	Admin: "admin",
} as const

export type UserRole = (typeof Roles)[keyof typeof Roles]

export const TypesOfQuestion = {
	Text: "text",
	TextArea: "textarea",
	Checkbox: "checkbox",
	Radio: "radio",
	Boolean: "boolean",
	Select: "select",
} as const

export const MultipleAnswersType = [
	TypesOfQuestion.Checkbox,
	TypesOfQuestion.Radio,
	TypesOfQuestion.Select,
] as const

type MultipleAnswerType = (typeof MultipleAnswersType)[number]

export function isMultipleAnswerType(
	type: QuestionType | undefined
): type is MultipleAnswerType {
	if (!type) return false
	return (MultipleAnswersType as readonly string[]).includes(type)
}

export type QuestionType =
	(typeof TypesOfQuestion)[keyof typeof TypesOfQuestion]

export const SurveyStatus = {
	Draft: "draft",
	Published: "published",
	Archived: "archived",
	Censored: "censored",
} as const

export type SurveyStatusType = (typeof SurveyStatus)[keyof typeof SurveyStatus]

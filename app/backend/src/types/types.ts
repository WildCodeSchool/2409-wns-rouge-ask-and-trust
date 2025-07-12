import Cookies from "cookies"
import { User } from "../database/entities/user"

export type Context = {
	cookies: Cookies
	user: User | null | undefined
}

export const Roles = {
	User: "user",
	Moderator: "moderator",
	Admin: "admin",
} as const

export type UserRole = (typeof Roles)[keyof typeof Roles]

export const TypesOfQuestion = {
	Text: "text",
	Multiple_Choice: "multiple_choice",
	Boolean: "boolean",
	Select: "select",
} as const

export type QuestionType =
	(typeof TypesOfQuestion)[keyof typeof TypesOfQuestion]

export type SurveyStatus = "draft" | "published" | "archived" | "censored"

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

export type UserType = {
	id: number
	firstname: string
	lastname: string
	email: string
	hashedPassword: string
	role: UserRole
	surveys: SurveyType[]
	createdAt: Date
	updatedAt: Date
}

export type SurveyType = {
	id: number
	name: string
	description: string
	category: SurveyCategoryType
	questions: SurveyQuestionsType[]
	public: boolean
	createdAt: Date
	updatedAt: Date
}

export type SurveyCategoryType = {
	id: number
	name: string
	createdAt: Date
	updatedAt: Date
	surveys: SurveyType[]
}

export type SurveyQuestionsType = {
	id: number
	title: string
	type: TypeOfQuestion
	answers: string[]
}

export enum TypeOfQuestion {
	TEXT = "text",
	MULTIPLE_CHOICE = "multiple_choice",
	BOOLEAN = "boolean",
}

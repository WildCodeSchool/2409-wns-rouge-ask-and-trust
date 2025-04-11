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

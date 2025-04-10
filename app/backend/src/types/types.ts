import { User } from "../database/entities/user"
import Cookies from "cookies"

export type Context = {
	cookies: Cookies
	user: User | null | undefined
}

export const Roles = {
	Admin: "admin",
	Writer: "writer",
	Reader: "reader",
} as const

export type UserRole = (typeof Roles)[keyof typeof Roles]

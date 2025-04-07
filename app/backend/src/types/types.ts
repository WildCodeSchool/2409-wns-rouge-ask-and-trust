import { User } from "../database/entities/user"
import Cookies from "cookies"

export type Context = {
	cookies: Cookies
	user: User | null | undefined
}

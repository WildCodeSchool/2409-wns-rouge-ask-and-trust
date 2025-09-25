import { MiddlewareFn, NextFn } from "type-graphql"
import { Context, Roles } from "../types/types"
import { User } from "../database/entities/user"
import { whoami } from "../services/auth-service"

export const HideEmail: MiddlewareFn<Context> = async (
	{ context, root },
	next: NextFn
): Promise<string | null | undefined> => {
	const targetUser: User | null | undefined = root as User
	let currentUser: User | null | undefined = context.user

	if (!currentUser && context.cookies) {
		try {
			currentUser = await whoami(context.cookies)
		} catch {
			currentUser = null
		}
	}

	if (!currentUser) {
		return null
	}

	if (
		currentUser?.role === Roles.Admin ||
		currentUser?.id === targetUser.id
	) {
		return await next()
	} else {
		return null
	}
}

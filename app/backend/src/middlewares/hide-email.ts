import { MiddlewareFn, NextFn } from "type-graphql"
import { Context, Roles } from "../types/types"
import { User } from "../database/entities/user"

export const HideEmail: MiddlewareFn<Context> = async (
	{ context, root },
	next: NextFn
): Promise<string | null> => {
	if (
		context.user?.role === Roles.Admin ||
		context.user?.id === (root as User).id
	) {
		return await next()
	} else {
		return null
	}
}

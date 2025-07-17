import { Context, Roles } from "../../types/types"

/**
 * Checks if the current user is either the owner of the survey or has admin role.
 *
 * @param surveyUserId - The user ID of the owner of the survey.
 * @param currentUser - The currently authenticated user from the GraphQL context.
 *
 * @returns `true` if the current user is the owner of the survey or has an admin role; otherwise `false`.
 *
 * @example
 * ```ts
 * const isAuthorized = isOwnerOrAdmin(survey.user.id, context.user)
 * if (!isAuthorized) {
 *   throw new AppError("Not authorized", 403, "ForbiddenError")
 * }
 * ```
 */
export function isOwnerOrAdmin(
	surveyUserId: number,
	currentUser: Context["user"]
): boolean {
	if (!currentUser) return false
	return surveyUserId === currentUser.id || currentUser.role === Roles.Admin
}

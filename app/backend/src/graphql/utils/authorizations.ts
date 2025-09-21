import { Survey } from "../../database/entities/survey/survey"
import { User } from "../../database/entities/user"
import { AppError } from "../../middlewares/error-handler"
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

export async function getAuthorizedSurvey(
	surveyId: number,
	user: User
): Promise<Survey> {
	const survey = await Survey.findOne({
		where: { id: surveyId },
		relations: { user: true },
	})

	if (!survey) {
		throw new AppError("Survey not found", 404, "NotFoundError")
	}

	if (!isOwnerOrAdmin(survey.user.id, user)) {
		throw new AppError(
			"Not authorized to add a question to this survey",
			403,
			"ForbiddenError"
		)
	}

	return survey
}

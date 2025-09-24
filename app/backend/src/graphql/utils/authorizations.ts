import { Questions } from "../../database/entities/survey/questions"
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
	entityUserId: number,
	currentUser: Context["user"]
): boolean {
	if (!currentUser) return false
	return entityUserId === currentUser.id || currentUser.role === Roles.Admin
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
			"Not authorized to access or modify this survey",
			403,
			"ForbiddenError"
		)
	}

	return survey
}

export async function getAuthorizedQuestion(
	questionId: number,
	user: User
): Promise<Questions> {
	const question = await Questions.findOne({
		where: { id: questionId },
		relations: {
			survey: { user: true }, // get survey and its user
		},
	})

	if (!question) {
		throw new AppError("Question not found", 404, "NotFoundError")
	}

	if (!isOwnerOrAdmin(question.survey.user.id, user)) {
		throw new AppError(
			"Not authorized to modify or delete this question",
			403,
			"ForbiddenError"
		)
	}

	return question
}

export function getUserFromContext(user: Context["user"]): User {
	if (!user) {
		throw new AppError("User not found", 404, "NotFoundError")
	}
	return user
}

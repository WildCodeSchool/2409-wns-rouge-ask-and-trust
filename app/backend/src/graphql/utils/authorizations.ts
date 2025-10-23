import { Questions } from "../../database/entities/survey/questions"
import { Survey } from "../../database/entities/survey/survey"
import { User } from "../../database/entities/user"
import { AppError } from "../../middlewares/error-handler"
import { Context, Roles } from "../../types/types"
import { UpdateSurveyInput } from "../inputs/update/survey/update-survey-input"

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
	const survey = await Survey.createQueryBuilder("survey")
		.leftJoinAndSelect("survey.user", "user")
		.leftJoinAndSelect("survey.category", "category")
		.leftJoinAndSelect("survey.questions", "questions")
		.loadRelationCountAndMap(
			"questions.answersCount",
			"questions.answersReceived"
		)
		.where("survey.id = :surveyId", { surveyId })
		.getOne()

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

	const hasAnswers = survey.questions?.some(
		question => question.answersCount && question.answersCount > 0
	)
	survey.hasAnswers = !!hasAnswers

	return survey
}

export function checkAllowedUpdateFields(
	hasAnswers: boolean,
	updateData: Omit<UpdateSurveyInput, "id">
) {
	if (hasAnswers) {
		const allowedKeys = ["public", "category"]
		const invalidKeys = Object.keys(updateData).filter(
			key => !allowedKeys.includes(key)
		)
		if (invalidKeys.length > 0) {
			throw new AppError(
				"This survey already has participants. You can modify category or/and public status only.",
				403,
				"ForbiddenError"
			)
		}
	}
}

export async function getAuthorizedQuestion(
	questionId: number,
	user: User
): Promise<Questions> {
	const question = await Questions.createQueryBuilder("question")
		.leftJoinAndSelect("question.survey", "survey")
		.leftJoinAndSelect("survey.user", "user")
		.loadRelationCountAndMap(
			"question.answersCount",
			"question.answersReceived"
		)
		.where("question.id = :questionId", { questionId })
		.getOne()

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

	question.answersCount = question.answersCount ?? 0

	if (question.answersCount > 0) {
		throw new AppError(
			"Cannot update question that already has users answers",
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

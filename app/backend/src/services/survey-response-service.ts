import { AppError } from "../middlewares/error-handler"
import { Survey } from "../database/entities/survey/survey"
import { Answers } from "../database/entities/survey/answers"
import { User } from "../database/entities/user"
import {
	SurveyResponsesQueryInput,
	ResponseCompletionStatus,
	ResponseSortField,
	SortDirection,
} from "../graphql/inputs/queries/survey-responses-query-input"
import {
	SurveyResponsesResult,
	SurveyResponse,
	ResponseAnswer,
	SurveyResponseStats,
} from "../database/results/surveyResponsesResult"
import { Context } from "../types/types"
import { isOwnerOrAdmin } from "../graphql/utils/authorizations"

/**
 * Service for managing survey responses
 * Handles aggregation of individual answers into complete responses
 */
export class SurveyResponseService {
	/**
	 * Get paginated survey responses with filtering and sorting
	 */
	static async getSurveyResponses(
		surveyId: number,
		filters: SurveyResponsesQueryInput,
		context: Context
	): Promise<SurveyResponsesResult> {
		try {
			// Verify survey exists and user has access
			const survey = await Survey.findOne({
				where: { id: surveyId },
				relations: { user: true, questions: true },
			})

			if (!survey) {
				throw new AppError("Survey not found", 404, "NotFoundError")
			}

			// Check authorization
			if (!isOwnerOrAdmin(survey.user.id, context.user)) {
				throw new AppError(
					"Not authorized to view responses",
					403,
					"ForbiddenError"
				)
			}

			// Build query conditions
			const queryBuilder = Answers.createQueryBuilder("answer")
				.leftJoinAndSelect("answer.user", "user")
				.leftJoinAndSelect("answer.question", "question")
				.leftJoinAndSelect("question.survey", "survey")
				.where("survey.id = :surveyId", { surveyId })

			// Apply filters
			if (filters.keyword) {
				queryBuilder.andWhere(
					"(answer.content ILIKE :keyword OR user.email ILIKE :keyword)",
					{ keyword: `%${filters.keyword}%` }
				)
			}

			if (filters.dateFrom && filters.dateTo) {
				queryBuilder.andWhere(
					"answer.createdAt BETWEEN :dateFrom AND :dateTo",
					{
						dateFrom: filters.dateFrom,
						dateTo: filters.dateTo,
					}
				)
			} else if (filters.dateFrom) {
				queryBuilder.andWhere("answer.createdAt >= :dateFrom", {
					dateFrom: filters.dateFrom,
				})
			} else if (filters.dateTo) {
				queryBuilder.andWhere("answer.createdAt <= :dateTo", {
					dateTo: filters.dateTo,
				})
			}

			// Get all answers for the survey
			const allAnswers = await queryBuilder.getMany()

			// Group answers by user to create responses
			const responsesMap = new Map<number, SurveyResponse>()

			for (const answer of allAnswers) {
				const userId = answer.userId

				if (!responsesMap.has(userId)) {
					const userAnswers = allAnswers.filter(
						a => a.userId === userId
					)
					const response = await this.createSurveyResponse(
						userId,
						userAnswers,
						survey.questions.length
					)
					responsesMap.set(userId, response)
				}
			}

			// Convert to array and apply completion status filter
			let responses = Array.from(responsesMap.values())

			if (filters.completionStatus) {
				responses = responses.filter(
					r => r.completionStatus === filters.completionStatus
				)
			}

			// Apply sorting
			const sortBy = filters.sortBy || ResponseSortField.SubmittedAt
			const sortDirection = filters.sortDirection || SortDirection.Desc

			responses.sort((a, b) => {
				let comparison = 0

				switch (sortBy) {
					case ResponseSortField.SubmittedAt:
						comparison =
							a.submittedAt.getTime() - b.submittedAt.getTime()
						break
					case ResponseSortField.UserEmail:
						comparison = a.user.email.localeCompare(b.user.email)
						break
					case ResponseSortField.CompletionStatus:
						comparison =
							a.completionPercentage - b.completionPercentage
						break
				}

				return sortDirection === SortDirection.Desc
					? -comparison
					: comparison
			})

			// Apply pagination
			const page = filters.page || 1
			const limit = filters.limit || 25
			const totalCount = responses.length
			const totalPages = Math.ceil(totalCount / limit)
			const offset = (page - 1) * limit

			const paginatedResponses = responses.slice(offset, offset + limit)

			return {
				responses: paginatedResponses,
				totalCount,
				page,
				limit,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to fetch survey responses",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Get a single survey response by user ID
	 */
	static async getSurveyResponse(
		surveyId: number,
		userId: number,
		context: Context
	): Promise<SurveyResponse | null> {
		try {
			// Verify survey exists and user has access
			const survey = await Survey.findOne({
				where: { id: surveyId },
				relations: { user: true, questions: true },
			})

			if (!survey) {
				throw new AppError("Survey not found", 404, "NotFoundError")
			}

			// Check authorization
			if (!isOwnerOrAdmin(survey.user.id, context.user)) {
				throw new AppError(
					"Not authorized to view responses",
					403,
					"ForbiddenError"
				)
			}

			// Get user's answers for this survey
			const answers = await Answers.find({
				where: { userId },
				relations: { user: true, question: { survey: true } },
			})

			// Filter answers for this survey
			const surveyAnswers = answers.filter(
				answer => answer.question.survey.id === surveyId
			)

			if (surveyAnswers.length === 0) {
				return null
			}

			return await this.createSurveyResponse(
				userId,
				surveyAnswers,
				survey.questions.length
			)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to fetch survey response",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Get survey response statistics
	 */
	static async getSurveyResponseStats(
		surveyId: number,
		context: Context
	): Promise<SurveyResponseStats> {
		try {
			// Verify survey exists and user has access
			const survey = await Survey.findOne({
				where: { id: surveyId },
				relations: { user: true, questions: true },
			})

			if (!survey) {
				throw new AppError("Survey not found", 404, "NotFoundError")
			}

			// Check authorization
			if (!isOwnerOrAdmin(survey.user.id, context.user)) {
				throw new AppError(
					"Not authorized to view responses",
					403,
					"ForbiddenError"
				)
			}

			// Get all answers for this survey
			const answers = await Answers.createQueryBuilder("answer")
				.leftJoinAndSelect("answer.user", "user")
				.leftJoinAndSelect("answer.question", "question")
				.leftJoinAndSelect("question.survey", "survey")
				.where("survey.id = :surveyId", { surveyId })
				.getMany()

			// Group by user and calculate stats
			const userResponseMap = new Map<number, number>()
			let firstResponseAt: Date | null = null
			let lastResponseAt: Date | null = null

			for (const answer of answers) {
				userResponseMap.set(
					answer.userId,
					(userResponseMap.get(answer.userId) || 0) + 1
				)

				if (!firstResponseAt || answer.createdAt < firstResponseAt) {
					firstResponseAt = answer.createdAt
				}
				if (!lastResponseAt || answer.createdAt > lastResponseAt) {
					lastResponseAt = answer.createdAt
				}
			}

			const totalResponses = userResponseMap.size
			const totalQuestions = survey.questions.length
			let completeResponses = 0
			let partialResponses = 0
			let incompleteResponses = 0

			for (const [, answeredCount] of userResponseMap) {
				if (answeredCount === totalQuestions) {
					completeResponses++
				} else if (answeredCount > 0) {
					partialResponses++
				} else {
					incompleteResponses++
				}
			}

			const completionRate =
				totalResponses > 0
					? Math.round((completeResponses / totalResponses) * 100)
					: 0

			return {
				totalResponses,
				completeResponses,
				partialResponses,
				incompleteResponses,
				completionRate,
				firstResponseAt: firstResponseAt?.toISOString(),
				lastResponseAt: lastResponseAt?.toISOString(),
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to fetch survey response statistics",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Create a SurveyResponse object from user answers
	 */
	private static async createSurveyResponse(
		userId: number,
		answers: Answers[],
		totalQuestions: number
	): Promise<SurveyResponse> {
		// Get user info
		const user = await User.findOne({ where: { id: userId } })
		if (!user) {
			throw new AppError("User not found", 404, "NotFoundError")
		}

		// Create response answers
		const responseAnswers: ResponseAnswer[] = answers.map(answer => ({
			questionId: answer.questionId,
			questionTitle: answer.question.title,
			questionType: answer.question.type,
			content: answer.content,
			submittedAt: answer.createdAt,
		}))

		// Calculate completion status
		const answeredQuestions = answers.length
		const completionPercentage = Math.round(
			(answeredQuestions / totalQuestions) * 100
		)

		let completionStatus: ResponseCompletionStatus
		if (answeredQuestions === totalQuestions) {
			completionStatus = ResponseCompletionStatus.Complete
		} else if (answeredQuestions > 0) {
			completionStatus = ResponseCompletionStatus.Partial
		} else {
			completionStatus = ResponseCompletionStatus.Incomplete
		}

		// Find the latest submission date
		const submittedAt = answers.reduce(
			(latest, answer) =>
				answer.createdAt > latest ? answer.createdAt : latest,
			answers[0].createdAt
		)

		return {
			responseId: `${userId}_${answers[0].question.survey.id}`,
			user,
			answers: responseAnswers,
			submittedAt,
			completionStatus,
			totalQuestions,
			answeredQuestions,
			completionPercentage,
		}
	}
}

/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey anwswers-related operations.
 * It handles survey answers creation, retrieval.
 */

import {
	Arg,
	Authorized,
	Ctx,
	ID,
	Mutation,
	Query,
	Resolver,
} from "type-graphql"
import { Answers } from "../../../database/entities/survey/answers"
import { CreateAnswersInput } from "../../inputs/create/survey/create-answers-input"
import { Context, Roles } from "../../../types/types"
import { AppError } from "../../../middlewares/error-handler"

/**
 * AnswersResolver
 * @description
 * Handles all GraphQL queries and mutations related to survey answers,
 * as well as tracking which users answered which surveys.
 */

@Resolver(Answers)
export class AnswersResolver {
	/**
	 * Query to retrieve all survey answers.
	 *
	 * @returns A Promise resolving to an array of `Answers` objects.
	 *
	 * This query fetches all answers submitted for survey questions, including
	 * their relations to the corresponding question and the record of who answered.
	 */
	@Authorized(Roles.Admin)
	@Query(() => [Answers])
	async Answers(): Promise<Answers[]> {
		try {
			const answers = await Answers.find({
				relations: {
					question: true,
					user: true,
				},
			})

			if (!answers) {
				throw new AppError("Answers not found", 404, "NotFoundError")
			}

			return answers
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to fetch answers",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Query to retrieve a specific survey answer by ID.
	 *
	 * @param userId - The ID of the user
	 * @param questionId - The ID of the question
	 *
	 * @returns A Promise resolving to a `Answers` object, or `null` if not found.
	 *
	 * This query returns a single survey answer with its related question and answered record.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => Answers, { nullable: true })
	async Answer(
		@Arg("userId", () => ID) userId: number,
		@Arg("questionId", () => ID) questionId: number
	): Promise<Answers | null> {
		try {
			const answer = await Answers.findOne({
				where: { userId, questionId },
				relations: {
					question: true,
					user: true,
				},
			})

			return answer
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to fetch answer",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Query to retrieve all answers from a user for a specific survey.
	 *
	 * @param surveyId - The ID of the survey
	 * @param context - The GraphQL context containing the authenticated user
	 *
	 * @returns A Promise resolving to an array of `Answers` objects.
	 *
	 * This query returns all answers submitted by the authenticated user for a specific survey.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => [Answers])
	async answersBySurvey(
		@Arg("surveyId", () => ID) surveyId: number,
		@Ctx() context: Context
	): Promise<Answers[]> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const answers = await Answers.find({
				where: {
					userId: user.id,
					question: { survey: { id: surveyId } },
				},
				relations: {
					question: { survey: true },
					user: true,
				},
			})

			return answers
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to fetch survey answers",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to create a new answer to a survey question.
	 *
	 * @param content - The input data for the new answer, including the selected value and the question ID.
	 * @param context - The context containing the currently authenticated user.
	 *
	 * @returns A Promise resolving to the newly created `Answers` object.
	 *
	 * This mutation allows a user (or admin) to submit an answer to a survey question.
	 * The answer is automatically linked to the authenticated user.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Answers)
	async createAnswer(
		@Arg("data", () => CreateAnswersInput)
		data: CreateAnswersInput,
		@Ctx() context: Context
	): Promise<Answers> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			// Vérifier si la question existe
			const { Questions } = await import(
				"../../../database/entities/survey/questions"
			)
			const question = await Questions.findOne({
				where: { id: data.questionId },
			})

			if (!question) {
				throw new AppError("Question not found", 404, "NotFoundError")
			}

			// Vérifier si l'utilisateur a déjà répondu à cette question
			const existingAnswer = await Answers.findOne({
				where: {
					userId: user.id,
					questionId: data.questionId,
				},
			})

			if (existingAnswer) {
				// Mettre à jour la réponse existante
				existingAnswer.content = data.content
				await existingAnswer.save()
				return existingAnswer
			} else {
				// Créer une nouvelle réponse
				const newAnswer = new Answers()
				newAnswer.content = data.content
				newAnswer.questionId = data.questionId
				newAnswer.userId = user.id
				newAnswer.user = user
				newAnswer.question = question

				await newAnswer.save()
				return newAnswer
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to create answer",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to delete all answers from a user for a specific survey.
	 *
	 * @param surveyId - The ID of the survey
	 * @param context - The GraphQL context containing the authenticated user
	 *
	 * @returns A Promise resolving to a boolean indicating success.
	 *
	 * This mutation deletes all answers submitted by the authenticated user for a specific survey.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Boolean)
	async deleteAnswersBySurvey(
		@Arg("surveyId", () => ID) surveyId: number,
		@Ctx() context: Context
	): Promise<boolean> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			// First, find all answers for this user and survey
			const answersToDelete = await Answers.find({
				where: {
					userId: user.id,
					question: { survey: { id: surveyId } },
				},
				relations: {
					question: { survey: true },
				},
			})

			if (answersToDelete.length === 0) {
				return false
			}

			// Delete each answer individually (required for composite keys)
			await Promise.all(answersToDelete.map(answer => answer.remove()))

			return true
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to delete survey answers",
				500,
				"InternalServerError"
			)
		}
	}
}

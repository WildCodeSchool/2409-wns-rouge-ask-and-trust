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
	 * @param id - The ID of the answer to retrieve.
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

			if (!answer) {
				throw new AppError("Answer not found", 404, "NotFoundError")
			}

			return answer
		} catch (error) {
			throw new AppError(
				"Failed to fetch answer",
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
		@Arg("content", () => CreateAnswersInput)
		content: CreateAnswersInput,
		@Ctx() context: Context
	): Promise<Answers> {
		try {
			const newAnswer = new Answers()
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			Object.assign(newAnswer, content, { user: user })

			await newAnswer.save()
			return newAnswer
		} catch (error) {
			throw new AppError(
				"Failed to create answer",
				500,
				"InternalServerError"
			)
		}
	}
}

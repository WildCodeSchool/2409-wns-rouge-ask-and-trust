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
import { SurveyAnswers } from "../../database/entities/survey/surveyAnswers"
import { CreateSurveyAnswersInput } from "../inputs/create/create-surveyAnswers-input"
import { Context } from "../../types/types"
import { AppError } from "../../middlewares/error-handler"

/**
 * SurveyAnswersResolver
 * @description
 * Handles all GraphQL queries and mutations related to survey answers,
 * as well as tracking which users answered which surveys.
 */

@Resolver(SurveyAnswers)
export class SurveyAnswersResolver {
	/**
	 * Query to retrieve all survey answers.
	 *
	 * @returns A Promise resolving to an array of `SurveyAnswers` objects.
	 *
	 * This query fetches all answers submitted for survey questions, including
	 * their relations to the corresponding question and the record of who answered.
	 */
	@Query(() => [SurveyAnswers])
	async surveyAnswers(): Promise<SurveyAnswers[]> {
		try {
			const answers = await SurveyAnswers.find({
				relations: {
					question: true,
					questionAnswered: true,
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
	 * @returns A Promise resolving to a `SurveyAnswers` object, or `null` if not found.
	 *
	 * This query returns a single survey answer with its related question and answered record.
	 */
	@Query(() => SurveyAnswers, { nullable: true })
	async surveyAnswer(
		@Arg("id", () => ID) id: number
	): Promise<SurveyAnswers | null> {
		try {
			const answer = await SurveyAnswers.findOne({
				where: { id },
				relations: {
					question: true,
					questionAnswered: true,
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
	 * @returns A Promise resolving to the newly created `SurveyAnswers` object.
	 *
	 * This mutation allows a user (or admin) to submit an answer to a survey question.
	 * The answer is automatically linked to the authenticated user.
	 */
	@Authorized("user", "admin")
	@Mutation(() => SurveyAnswers)
	async createSurveyAnswer(
		@Arg("content", () => CreateSurveyAnswersInput)
		content: CreateSurveyAnswersInput,
		@Ctx() context: Context
	): Promise<SurveyAnswers> {
		try {
			const newAnswer = new SurveyAnswers()
			const user = context.user

			if (!user)
				throw new AppError("User not found", 404, "NotFoundError")

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

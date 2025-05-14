/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey questions answered-related operations.
 * It handles survey questions answered retrieval.
 */

import { Arg, ID, Query, Resolver } from "type-graphql"
import { SurveyQuestionAnswered } from "../../database/entities/survey/surveyQuestionAnswered"
import { AppError } from "../../middlewares/error-handler"

/**
 * SurveyQuestionsAnsweredResolver
 * @description
 * Handles all GraphQL queries related to survey questions answered,
 * as well to find the answers to questions answered by a user
 */

@Resolver(SurveyQuestionAnswered)
export class SurveyQuestionsAnsweredResolver {
	/**
	 * Query to retrieve all records of answered survey questions.
	 *
	 * @returns A Promise resolving to an array of `SurveyQuestionAnswered` objects.
	 *
	 * This query returns the list of users and the surveys they have answered.
	 */
	@Query(() => [SurveyQuestionAnswered])
	async surveyQuestionsAnswered(): Promise<SurveyQuestionAnswered[]> {
		try {
			const questionsAnswered = await SurveyQuestionAnswered.find({
				relations: {
					user: true,
					survey: true,
				},
			})

			if (!questionsAnswered) {
				throw new AppError(
					"Questions answered not found",
					404,
					"NotFoundError"
				)
			}

			return questionsAnswered
		} catch (error) {
			throw new AppError(
				"Failed to fetch questions answered",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Query to retrieve a specific answered survey record by ID.
	 *
	 * @param id - The ID of the answered record to retrieve.
	 *
	 * @returns A Promise resolving to a `SurveyQuestionAnswered` object, or `null` if not found.
	 *
	 * This query provides information about a specific participation by a user in a survey.
	 */
	@Query(() => SurveyQuestionAnswered, { nullable: true })
	async surveyQuestionAnswered(
		@Arg("id", () => ID) id: number
	): Promise<SurveyQuestionAnswered | null> {
		try {
			const questionAnswered = await SurveyQuestionAnswered.findOne({
				where: { id },
				relations: {
					user: true,
					survey: true,
				},
			})

			if (!questionAnswered) {
				throw new AppError(
					"Question answered not found",
					404,
					"NotFoundError"
				)
			}

			return questionAnswered
		} catch (error) {
			throw new AppError(
				"Failed to fetch question answered",
				500,
				"InternalServerError"
			)
		}
	}
}

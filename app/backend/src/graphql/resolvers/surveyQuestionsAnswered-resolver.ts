/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey questions answered-related operations.
 * It handles survey questions answered retrieval.
 */

import { Arg, ID, Query, Resolver } from "type-graphql"
import { SurveyQuestionAnswered } from "../../database/entities/survey/surveyQuestionAnswered"

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
		const questionsAnswered = await SurveyQuestionAnswered.find({
			relations: {
				user: true,
				survey: true,
			},
		})

		return questionsAnswered
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
		const questionAnswered = await SurveyQuestionAnswered.findOne({
			where: { id },
			relations: {
				user: true,
				survey: true,
			},
		})

		if (questionAnswered) {
			return questionAnswered
		} else {
			return null
		}
	}
}

/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey responses-related operations.
 * It handles survey responses retrieval, filtering, and statistics.
 */

import { Arg, Authorized, Ctx, ID, Query, Resolver } from "type-graphql"
import { Timeout } from "../../../middlewares/timeout-middleware"
import { Context, Roles } from "../../../types/types"
import { AppError } from "../../../middlewares/error-handler"
import { SurveyResponsesQueryInput } from "../../inputs/queries/survey-responses-query-input"
import {
	SurveyResponsesResult,
	SurveyResponse,
	SurveyResponseStats,
} from "../../../database/results/surveyResponsesResult"
import { SurveyResponseService } from "../../../services/survey-response-service"

/**
 * SurveyResponsesResolver
 * @description
 * Handles all GraphQL queries related to survey responses,
 * including listing, filtering, and statistics.
 */
@Resolver()
export class SurveyResponsesResolver {
	/**
	 * Query to retrieve paginated survey responses with filtering and sorting.
	 *
	 * @param surveyId - The ID of the survey
	 * @param filters - Filtering, sorting, and pagination options
	 * @param context - The GraphQL context containing the authenticated user
	 *
	 * @returns A Promise resolving to a `SurveyResponsesResult` object with paginated responses.
	 *
	 * This query allows authorized users (survey owners or admins) to view responses
	 * with various filtering options including keyword search, date range, completion status,
	 * and sorting capabilities.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => SurveyResponsesResult)
	@Timeout(30000) // 30 seconds for responses with filters
	async surveyResponses(
		@Arg("surveyId", () => ID) surveyId: number,
		@Arg("filters", () => SurveyResponsesQueryInput, { nullable: true })
		filters: SurveyResponsesQueryInput,
		@Ctx() context: Context
	): Promise<SurveyResponsesResult> {
		try {
			return await SurveyResponseService.getSurveyResponses(
				surveyId,
				filters || {},
				context
			)
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
	 * Query to retrieve a specific survey response by user ID.
	 *
	 * @param surveyId - The ID of the survey
	 * @param userId - The ID of the user whose response to retrieve
	 * @param context - The GraphQL context containing the authenticated user
	 *
	 * @returns A Promise resolving to a `SurveyResponse` object or null if not found.
	 *
	 * This query allows authorized users (survey owners or admins) to view
	 * a specific user's response to a survey.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => SurveyResponse, { nullable: true })
	@Timeout(30000) // 30 seconds for a single response
	async surveyResponse(
		@Arg("surveyId", () => ID) surveyId: number,
		@Arg("userId", () => ID) userId: number,
		@Ctx() context: Context
	): Promise<SurveyResponse | null> {
		try {
			return await SurveyResponseService.getSurveyResponse(
				surveyId,
				userId,
				context
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
	 * Query to retrieve survey response statistics.
	 *
	 * @param surveyId - The ID of the survey
	 * @param context - The GraphQL context containing the authenticated user
	 *
	 * @returns A Promise resolving to a `SurveyResponseStats` object.
	 *
	 * This query provides summary statistics about survey responses including
	 * total responses, completion rates, and response timing.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => SurveyResponseStats)
	@Timeout(30000) // 30 seconds for statistics (aggregation calculations)
	async surveyResponseStats(
		@Arg("surveyId", () => ID) surveyId: number,
		@Ctx() context: Context
	): Promise<SurveyResponseStats> {
		try {
			return await SurveyResponseService.getSurveyResponseStats(
				surveyId,
				context
			)
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
}

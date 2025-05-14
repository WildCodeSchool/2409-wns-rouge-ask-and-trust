/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey-related operations.
 * It handles survey creation, retrieval, and update.
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
import { Survey } from "../../../database/entities/survey/survey"
import { CreateSurveyInput } from "../../inputs/create/survey/create-survey-input"
import { Context } from "../../../types/types"
import { UpdateSurveyInput } from "../../inputs/update/survey/update-survey-input"
import { AppError } from "../../../middlewares/error-handler"

/**
 * Survey Resolver
 * @description
 * Handles all survey-related GraphQL mutations and queries.
 */

@Resolver(Survey)
export class SurveysResolver {
	/**
	 * Query to get all surveys.
	 *
	 * @returns A Promise that resolves to an array of Survey objects.
	 *
	 * This query retrieves all surveys, along with their associated user and category information.
	 */
	@Query(() => [Survey])
	async surveys(): Promise<Survey[]> {
		try {
			const surveys = await Survey.find({
				relations: {
					user: true,
					category: true,
				},
			})

			if (!surveys) {
				throw new AppError("Surveys not found", 404, "NotFoundError")
			}

			return surveys
		} catch (error) {
			throw new AppError(
				"Failed to fetch surveys",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Query to get a specific survey by ID.
	 *
	 * @param id - The ID of the survey to fetch.
	 *
	 * @returns A Promise that resolves to a Survey object if found, or null if no survey is found.
	 *
	 * This query retrieves a specific survey by its ID, along with its associated user and category information.
	 */
	@Query(() => Survey, { nullable: true })
	async survey(@Arg("id", () => ID) id: number): Promise<Survey | null> {
		try {
			const survey = await Survey.findOne({
				where: { id },
				relations: {
					user: true,
					category: true,
				},
			})

			if (!survey) {
				throw new AppError("Survey not found", 404, "NotFoundError")
			}

			return survey
		} catch (error) {
			throw new AppError(
				"Failed to fetch survey",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to create a new survey.
	 *
	 * @param data - The input data containing the survey details, including the title, description, and category.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the newly created Survey object.
	 *
	 * This mutation allows a user to create a new survey. Only users with the "user" or "admin" roles can create surveys.
	 * The survey is associated with the currently authenticated user.
	 */
	@Authorized("user", "admin")
	@Mutation(() => Survey)
	async createSurvey(
		@Arg("data", () => CreateSurveyInput) data: CreateSurveyInput,
		@Ctx() context: Context
	): Promise<Survey> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const newSurvey = new Survey()
			Object.assign(newSurvey, data, { user })

			await newSurvey.save()
			return newSurvey
		} catch (error) {
			throw new AppError(
				"Failed to create survey",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to update an existing survey.
	 *
	 * @param id - The ID of the survey to update.
	 * @param data - The input data containing the updated survey details.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the updated Survey object, or null if the survey could not be found or updated.
	 *
	 * This mutation allows a user to update an existing survey. Only users with the "user" or "admin" roles can update surveys.
	 * If the user is not an admin, they can only update surveys they have created.
	 */
	@Authorized("user", "admin")
	@Mutation(() => Survey, { nullable: true })
	async updateSurvey(
		@Arg("id", () => ID) id: number,
		@Arg("data", () => UpdateSurveyInput) data: UpdateSurveyInput,
		@Ctx() context: Context
	): Promise<Survey | null> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const whereCreatedBy =
				user.role === "admin" ? undefined : { id: user.id }

			const survey = await Survey.findOne({
				where: { id, user: whereCreatedBy },
				relations: {
					user: true,
					category: true,
				},
			})

			if (!survey) {
				throw new AppError(
					"Survey not found",
					404,
					"SurveyNotFoundError"
				)
			} else if (user.role !== "admin") {
				throw new AppError(
					"You are not allowed to modify this survey",
					401,
					"UnauthorizedError"
				)
			}

			Object.assign(survey, data)
			await survey.save()
			return survey
		} catch (error) {
			throw new AppError(
				"Failed to update survey",
				500,
				"InternalServerError"
			)
		}
	}
}

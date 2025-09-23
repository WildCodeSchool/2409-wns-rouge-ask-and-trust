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
import { Category } from "../../../database/entities/survey/category"
import { Survey } from "../../../database/entities/survey/survey"
import { AllSurveysResult } from "../../../database/results/allSurveysResult"
import { MySurveysResult } from "../../../database/results/mySurveyResult"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles } from "../../../types/types"
import {
	checkRateLimit,
	mutationRateLimiter,
	searchRateLimiter,
} from "../../../middlewares/apollo-rate-limiter"
import { CreateSurveyInput } from "../../inputs/create/survey/create-survey-input"
import { MySurveysQueryInput } from "../../inputs/queries/mySurveys-query-input"
import { AllSurveysQueryInput } from "../../inputs/queries/surveys-query-input"
import { UpdateSurveyInput } from "../../inputs/update/survey/update-survey-input"

/**
 * Survey Resolver
 * @description
 * Handles all survey-related GraphQL mutations and queries.
 */

@Resolver(Survey)
export class SurveysResolver {
	/**
	 * GraphQL Query to fetch all surveys.
	 *
	 * This query supports:
	 * - search by title,
	 * - filtering by category,
	 * - sorting (by estimated duration or available duration, ASC/DESC),
	 * - filtering by status,
	 * - pagination,
	 * - as well as counting total surveys before and after filters are applied.
	 *
	 * @param filters - Search filters and options for sorting/pagination (field, order, page, limit...).
	 *
	 * @returns An `AllSurveysResult` object containing:
	 * - `allSurveys`: Paginated list of surveys after applying filters.
	 * - `totalCount`: Total number of surveys matching the filters.
	 * - `totalCountAll`: Total number of surveys without filters.
	 * - `page` and `limit`: Pagination info.
	 *
	 * @throws AppError - If no surveys are found or in case of a server error.
	 */
	@Query(() => AllSurveysResult)
	async surveys(
		@Arg("filters", () => AllSurveysQueryInput, { nullable: true })
		filters: AllSurveysQueryInput,
		@Ctx() context: Context
	): Promise<AllSurveysResult> {
		// Rate limiting for the search of surveys
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(searchRateLimiter, clientIP, "surveys")

		try {
			const {
				search,
				categoryIds,
				sortBy = "estimatedDuration",
				order = "DESC",
				status,
				page = 1,
				limit = 12,
			} = filters || {}

			// Retrieve the base query with all surveys created
			const baseQuery = Survey.createQueryBuilder("survey")
				.leftJoinAndSelect("survey.user", "user")
				.leftJoinAndSelect("survey.category", "category")
				.leftJoinAndSelect("survey.questions", "questions")

			// Get the total number of unfiltered surveys and clone the query to apply filters
			const [totalCountAll, filteredQuery] = await Promise.all([
				baseQuery.getCount(),
				baseQuery.clone(),
			])

			// Filter by title (search)
			if (search?.trim()) {
				filteredQuery.andWhere("survey.title ILIKE :search", {
					search: `%${search.trim()}%`,
				})
			}

			// Filter by category
			if (categoryIds && categoryIds.length > 0) {
				filteredQuery.andWhere(
					"survey.category.id IN (:...categoryIds)",
					{
						categoryIds,
					}
				)
			}

			// Filter by status
			if (status && status.length > 0) {
				filteredQuery.andWhere("survey.status IN (:...status)", {
					status,
				})
			}

			// Get the total number of surveys matching the filters (for pagination)
			const totalCount = await filteredQuery.getCount()

			// Sort results by selected field (sortBy) and order (ASC/DESC)
			filteredQuery.orderBy(`survey.${sortBy}`, order)

			// Apply pagination
			filteredQuery.skip((page - 1) * limit).take(limit)

			const allSurveys = await filteredQuery.getMany()

			if (!allSurveys) {
				throw new AppError("Surveys not found", 404, "NotFoundError")
			}

			return {
				allSurveys,
				totalCount,
				totalCountAll,
				page,
				limit,
			}
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
					questions: true,
				},
				order: {
					questions: {
						id: "ASC",
					},
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
	 * GraphQL Query to retrieve surveys belonging to the currently authenticated user.
	 *
	 * This query supports:
	 * - search by title,
	 * - filtering by status,
	 * - sorting (by creation or update date, ASC/DESC),
	 * - pagination,
	 * - as well as counting total surveys before and after filters are applied.
	 *
	 * ⚠️ Access is restricted to roles `User` and `Admin`.
	 *
	 * @param filters - Search filters and options for sorting/pagination (field, order, page, limit...).
	 * @param context - GraphQL context containing the authenticated user.
	 *
	 * @returns A `MySurveysResult` object containing:
	 * - `surveys`: Paginated list of surveys after applying filters.
	 * - `totalCount`: Total number of surveys matching the filters.
	 * - `totalCountAll`: Total number of the user's surveys without filters.
	 * - `page` and `limit`: Pagination information.
	 *
	 * @throws AppError - If no user is found in the context or in case of a server error.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => MySurveysResult)
	async mySurveys(
		@Arg("filters", () => MySurveysQueryInput, { nullable: true })
		filters: MySurveysQueryInput,
		@Ctx() context: Context
	): Promise<MySurveysResult> {
		// Rate limiting for the search of my surveys
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(searchRateLimiter, clientIP, "mySurveys")

		try {
			const user = context.user

			if (!user) {
				throw new AppError(
					"You can only retrieve your own surveys",
					401,
					"UnauthorizedError"
				)
			}

			const {
				search,
				status,
				sortBy = "createdAt",
				order = "DESC",
				page = 1,
				limit = 5,
			} = filters || {}

			// Retrieve the base query with all surveys created by the user
			const baseQuery = Survey.createQueryBuilder("survey").where(
				"survey.userId = :userId",
				{ userId: user.id }
			)

			// Get the total number of unfiltered surveys and clone the query to apply filters
			const [totalCountAll, filteredQuery] = await Promise.all([
				baseQuery.getCount(),
				baseQuery.clone(),
			])

			// Filter by title (search)
			if (search?.trim()) {
				filteredQuery.andWhere("survey.title ILIKE :search", {
					search: `%${search.trim()}%`,
				})
			}

			// Filter by status
			if (status && status.length > 0) {
				filteredQuery.andWhere("survey.status IN (:...status)", {
					status,
				})
			}

			// Get the total number of surveys matching the filters (for pagination)
			const totalCount = await filteredQuery.getCount()

			// Sort results by selected field (sortBy) and order (ASC/DESC)
			filteredQuery.orderBy(`survey.${sortBy}`, order)

			// Apply pagination
			filteredQuery.skip((page - 1) * limit).take(limit)

			const surveys = await filteredQuery.getMany()

			return {
				surveys,
				totalCount,
				totalCountAll,
				page,
				limit,
			}
		} catch (error) {
			throw new AppError(
				"Failed to fetch user surveys",
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
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Survey)
	async createSurvey(
		@Arg("data", () => CreateSurveyInput) data: CreateSurveyInput,
		@Ctx() context: Context
	): Promise<Survey> {
		// Rate limiting pour la création de survey
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(mutationRateLimiter, clientIP, "createSurvey")

		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const category = await Category.findOne({
				where: { id: data.category },
			})

			if (!category) {
				throw new AppError("Category not found", 404, "NotFoundError")
			}

			const newSurvey = new Survey()
			Object.assign(newSurvey, data, { user, category })

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
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Survey, { nullable: true })
	async updateSurvey(
		@Arg("data", () => UpdateSurveyInput) data: UpdateSurveyInput,
		@Ctx() context: Context
	): Promise<Survey | null> {
		// Rate limiting for the update of a survey
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(mutationRateLimiter, clientIP, "updateSurvey")

		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const whereCreatedBy =
				user.role === "admin" ? undefined : { id: user.id }

			const survey = await Survey.findOne({
				where: { id: data.id, user: whereCreatedBy },
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
			}

			const { id, category, ...updateData } = data

			if (category) {
				const categorySurvey = await Category.findOne({
					where: { id: category },
				})
				if (!categorySurvey) {
					throw new AppError(
						"Category not found",
						404,
						"NotFoundError"
					)
				}
				survey.category = categorySurvey
			}

			Object.assign(survey, updateData)

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

	/**
	 * Mutation to delete an existing survey.
	 *
	 * @param id - The ID of the survey to delete.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the deleted Survey object, or null if the survey could not be found or deleted.
	 *
	 * This mutation allows an admin or user to delete an existing survey. Only the admin or the survey owner can delete surveys.
	 * If the user is not an admin or the wurvey owner, the mutation will not be executed.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Survey, { nullable: true })
	async deleteSurvey(
		@Arg("id", () => ID) id: number,
		@Ctx() context: Context
	): Promise<Survey | null> {
		// Rate limiting for the deletion of a survey
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(mutationRateLimiter, clientIP, "deleteSurvey")

		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			// Only admins or survey owner can delete surveys
			const whereCreatedBy =
				user.role === "admin" ? undefined : { id: user.id }

			const survey = await Survey.findOneBy({
				id,
				user: whereCreatedBy,
			})

			if (survey !== null) {
				await survey.remove()
				survey.id = id
			}

			return survey
		} catch (error) {
			throw new AppError(
				"Failed to delete survey",
				500,
				"InternalServerError"
			)
		}
	}
}

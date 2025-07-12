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
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles } from "../../../types/types"
import { CreateSurveyInput } from "../../inputs/create/survey/create-survey-input"
import { UpdateSurveyInput } from "../../inputs/update/survey/update-survey-input"
import { MySurveysQueryInput } from "../../inputs/queries/mySurveys-query-input"
import { MySurveysResult } from "../../../database/results/mySurveyResult"
import { AllSurveysResult } from "../../../database/results/allSurveysResult"
import { AllSurveysQueryInput } from "../../inputs/queries/surveys-query-input"

/**
 * Survey Resolver
 * @description
 * Handles all survey-related GraphQL mutations and queries.
 */

@Resolver(Survey)
export class SurveysResolver {
	/**
	 * GraphQL Query permettant de récupérer toutes les enquêtes.
	 *
	 * Cette requête prend en charge :
	 * - la recherche par titre,
	 * - le filtrage par catégorie,
	 * - le tri (par temps estimé pour répondre à l'enquête et durée de disponibilité, ASC/DESC),
	 * - la pagination,
	 * - ainsi que le comptage total d'enquêtes avant et après filtres.
	 *
	 * @param filters - Filtres de recherche et options de tri/pagination (champ, ordre, page, limite...).
	 *
	 * @returns Un objet `AllSurveysResult` contenant :
	 * - `allSurveys` : Liste paginée des enquêtes après application des filtres.
	 * - `totalCount` : Nombre total d’enquêtes correspondant aux filtres.
	 * - `totalCountAll` : Nombre total d’enquêtes de l’utilisateur sans filtre.
	 * - `page` et `limit` : Infos de pagination.
	 *
	 * @throws AppError - Si aucune enquête n'est trouvée ou en cas d’erreur serveur.
	 */
	@Query(() => AllSurveysResult)
	async surveys(
		@Arg("filters", () => AllSurveysQueryInput)
		filters: AllSurveysQueryInput
	): Promise<AllSurveysResult> {
		try {
			const {
				search,
				categoryIds,
				sortBy = "estimatedDuration",
				order = "DESC",
				page = 1,
				limit = 12,
			} = filters

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
					"survey.categoryIds IN (:...categoryIds)",
					{
						categoryIds,
					}
				)
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
	 * GraphQL Query permettant de récupérer les enquêtes de l'utilisateur actuellement authentifié.
	 *
	 * Cette requête prend en charge :
	 * - la recherche par titre,
	 * - le filtrage par statut,
	 * - le tri (par date de création ou de modification, ASC/DESC),
	 * - la pagination,
	 * - ainsi que le comptage total d'enquêtes avant et après filtres.
	 *
	 * ⚠️ L'accès est restreint aux rôles `User` et `Admin`.
	 *
	 * @param filters - Filtres de recherche et options de tri/pagination (champ, ordre, page, limite...).
	 * @param context - Contexte GraphQL contenant l'utilisateur authentifié.
	 *
	 * @returns Un objet `MySurveysResult` contenant :
	 * - `surveys` : Liste paginée des enquêtes après application des filtres.
	 * - `totalCount` : Nombre total d’enquêtes correspondant aux filtres.
	 * - `totalCountAll` : Nombre total d’enquêtes de l’utilisateur sans filtre.
	 * - `page` et `limit` : Infos de pagination.
	 *
	 * @throws AppError - Si aucun utilisateur n’est présent dans le contexte ou en cas d’erreur serveur.
	 */
	@Authorized(Roles.User, Roles.Admin)
	@Query(() => MySurveysResult)
	async mySurveys(
		@Arg("filters", () => MySurveysQueryInput) filters: MySurveysQueryInput,
		@Ctx() context: Context
	): Promise<MySurveysResult> {
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
			} = filters

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

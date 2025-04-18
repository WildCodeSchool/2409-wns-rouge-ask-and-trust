/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey category-related operations.
 * It handles survey category creation, retrieval, and update.
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
import { SurveyCategory } from "../../database/entities/survey/surveyCategory"
import { CreateCategorySurveyInput } from "../inputs/create/create-surveyCategory-input"
import { Context } from "../../types/types"
import { UpdateCategorySurveyInput } from "../inputs/update/update-category-survey-input"

/**
 * SurveyCategoryResolver
 * @description
 * Handles all survey category-related GraphQL mutations and queries.
 */

@Resolver(SurveyCategory)
export class SurveyCategoryResolver {
	/**
	 * Query to get all survey categories.
	 *
	 * @returns A Promise that resolves to an array of SurveyCategory objects.
	 *
	 * This query retrieves all survey categories, including their associated surveys.
	 */
	@Query(() => [SurveyCategory])
	async categories(): Promise<SurveyCategory[]> {
		const categories = await SurveyCategory.find({
			relations: {
				surveys: true,
				createdBy: true,
			},
		})

		return categories
	}

	/**
	 * Query to get a specific survey category by ID.
	 *
	 * @param id - The ID of the category to fetch.
	 *
	 * @returns A Promise that resolves to a SurveyCategory object if found, or null if no category is found.
	 *
	 * This query retrieves a specific survey category by its ID, along with its associated surveys.
	 */
	@Query(() => SurveyCategory, { nullable: true })
	async caterogy(@Arg("id") id: number): Promise<SurveyCategory | null> {
		const category = await SurveyCategory.findOne({
			where: { id },
			relations: {
				surveys: true,
				createdBy: true,
			},
		})

		if (category) {
			return category
		} else {
			return null
		}
	}

	/**
	 * Mutation to create a new survey category.
	 *
	 * @param name - The input data containing the category name.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the newly created SurveyCategory object.
	 *
	 * This mutation allows an admin user to create a new survey category. The category will be associated with the admin user.
	 */
	@Authorized("admin")
	@Mutation(() => SurveyCategory)
	async createCategory(
		@Arg("data", () => CreateCategorySurveyInput)
		data: CreateCategorySurveyInput,
		@Ctx() context: Context
	): Promise<SurveyCategory> {
		const newCategory = new SurveyCategory()
		const user = context.user
		Object.assign(newCategory, data, { createdBy: user })

		await newCategory.save()
		return newCategory
	}

	/**
	 * Mutation to update an existing survey category.
	 *
	 * @param id - The ID of the category to update.
	 * @param name - The input data containing the updated category name.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the updated SurveyCategory object, or null if the category could not be found or updated.
	 *
	 * This mutation allows an admin user to update an existing survey category. Only the admin can update categories.
	 * If the user is not an admin, the mutation will not be executed.
	 */
	@Authorized("admin")
	@Mutation(() => SurveyCategory, { nullable: true })
	async updateCategory(
		@Arg("id", () => ID) id: number,
		@Arg("data", () => UpdateCategorySurveyInput)
		data: UpdateCategorySurveyInput,
		@Ctx() context: Context
	): Promise<SurveyCategory | null> {
		const user = context.user

		if (!user) {
			return null
		}

		// Only admins can update categories
		if (user.role !== "admin") {
			return null
		}

		const category = await SurveyCategory.findOneBy({
			id,
			createdBy: { id: user.id },
		})

		if (category !== null) {
			Object.assign(category, data)
			await category.save()
			return category
		}

		return null
	}
}

/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for survey questions-related operations.
 * It handles survey questions creation, retrieval.
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
import { SurveyQuestions } from "../../database/entities/survey/surveyQuestions"
import { CreateSurveyQuestionsInput } from "../inputs/create/create-surveyQuestions-input"
import { Context } from "../../types/types"

/**
 * SurveyQuestionsResolver
 * @description
 * Handles all GraphQL operations related to survey questions.
 */

@Resolver(SurveyQuestions)
export class SurveyQuestionsResolver {
	/**
	 * Query to get all survey questions.
	 *
	 * @returns A Promise that resolves to an array of SurveyQuestions objects.
	 *
	 * This query retrieves all questions, including their associated survey.
	 */
	@Query(() => [SurveyQuestions])
	async surveyQuestions(): Promise<SurveyQuestions[]> {
		const questions = await SurveyQuestions.find({
			relations: {
				survey: true,
			},
		})

		return questions
	}

	/**
	 * Query to get a specific survey question by ID.
	 *
	 * @param id - The ID of the question to retrieve.
	 *
	 * @returns A Promise that resolves to the corresponding SurveyQuestions object, or null if not found.
	 *
	 * This query fetches a specific question based on its ID, including its related survey.
	 */
	@Query(() => SurveyQuestions, { nullable: true })
	async surveyQuestion(
		@Arg("id", () => ID) id: number
	): Promise<SurveyQuestions | null> {
		const question = await SurveyQuestions.findOne({
			where: { id },
			relations: {
				survey: true,
			},
		})

		if (question) {
			return question
		} else {
			return null
		}
	}

	/**
	 * Mutation to create a new survey question.
	 *
	 * @param data - The input data for creating the question (title, type, answers, etc.).
	 * @param context - The GraphQL context containing the authenticated user.
	 *
	 * @returns A Promise that resolves to the newly created SurveyQuestions object.
	 *
	 * This mutation allows an authenticated user ("user" or "admin" role) to create a new question.
	 * The created question is optionally linked to a survey and associated with the authenticated user.
	 */
	@Authorized("user", "admin")
	@Mutation(() => SurveyQuestions)
	async createSurveyQuestion(
		@Arg("content", () => CreateSurveyQuestionsInput)
		content: CreateSurveyQuestionsInput,
		@Ctx() context: Context
	): Promise<SurveyQuestions> {
		const newQuestion = new SurveyQuestions()
		const user = context.user
		Object.assign(newQuestion, content, { user: user })

		await newQuestion.save()
		return newQuestion
	}
}

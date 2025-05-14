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
import { Questions } from "../../../database/entities/survey/questions"
import { CreateQuestionsInput } from "../../inputs/create/survey/create-questions-input"
import { Context } from "../../../types/types"
import { AppError } from "../../../middlewares/error-handler"

/**
 * QuestionsResolver
 * @description
 * Handles all GraphQL operations related to survey questions.
 */

@Resolver(Questions)
export class QuestionsResolver {
	/**
	 * Query to get all survey questions.
	 *
	 * @returns A Promise that resolves to an array of Questions objects.
	 *
	 * This query retrieves all questions, including their associated survey.
	 */
	@Query(() => [Questions])
	async questions(): Promise<Questions[]> {
		try {
			const questions = await Questions.find({
				relations: {
					survey: true,
				},
			})

			if (!questions) {
				throw new AppError("Questions not found", 404, "NotFoundError")
			}

			return questions
		} catch (error) {
			throw new AppError(
				"Failed to fetch questions",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Query to get a specific survey question by ID.
	 *
	 * @param id - The ID of the question to retrieve.
	 *
	 * @returns A Promise that resolves to the corresponding Questions object, or null if not found.
	 *
	 * This query fetches a specific question based on its ID, including its related survey.
	 */
	@Query(() => Questions, { nullable: true })
	async question(@Arg("id", () => ID) id: number): Promise<Questions | null> {
		try {
			const question = await Questions.findOne({
				where: { id },
				relations: {
					survey: true,
				},
			})

			if (!question) {
				throw new AppError("Question not found", 404, "NotFoundError")
			}

			return question
		} catch (error) {
			throw new AppError(
				"Failed to fetch question",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to create a new survey question.
	 *
	 * @param data - The input data for creating the question (title, type, answers, etc.).
	 * @param context - The GraphQL context containing the authenticated user.
	 *
	 * @returns A Promise that resolves to the newly created Questions object.
	 *
	 * This mutation allows an authenticated user ("user" or "admin" role) to create a new question.
	 * The created question is optionally linked to a survey and associated with the authenticated user.
	 */
	@Authorized("user", "admin")
	@Mutation(() => Questions)
	async createQuestion(
		@Arg("content", () => CreateQuestionsInput)
		content: CreateQuestionsInput,
		@Ctx() context: Context
	): Promise<Questions> {
		try {
			const newQuestion = new Questions()
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			Object.assign(newQuestion, content, { user: user })

			await newQuestion.save()
			return newQuestion
		} catch (error) {
			throw new AppError(
				"Failed to create question",
				500,
				"InternalServerError"
			)
		}
	}
}

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
import { Survey } from "../../../database/entities/survey/survey"
import { Context } from "../../../types/types"
import { AppError } from "../../../middlewares/error-handler"
import { UpdateQuestionInput } from "../../inputs/update/survey/update-question-input"

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
	 * @param data - The input content for creating the question (title, type, answers, etc.).
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
		@Arg("data", () => CreateQuestionsInput)
		data: CreateQuestionsInput,
		@Arg("surveyId", () => ID) surveyId: number,
		@Ctx() context: Context
	): Promise<Questions> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const survey = await Survey.findOne({ where: { id: surveyId } })

			if (!survey) {
				throw new AppError("Survey not found", 404, "NotFoundError")
			}

			const newQuestion = new Questions()
			Object.assign(newQuestion, data, { user: user })
			newQuestion.survey = survey

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

	/**
	 * Mutation to update an existing survey question.
	 *
	 * @param id - The ID of the question to update.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the updated Questions object, or null if the question could not be found or updated.
	 *
	 * This mutation allows an admin user to update an existing survey question. Only the admin or the question owner can update questions.
	 * If the user is not an admin, the mutation will not be executed.
	 */
	@Authorized("user", "admin")
	@Mutation(() => Questions, { nullable: true })
	async updateQuestion(
		@Arg("id", () => ID) id: number,
		@Arg("data", () => UpdateQuestionInput)
		data: UpdateQuestionInput,
		@Ctx() context: Context
	): Promise<Questions | null> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			// Only admins or question owner can update question
			const whereCreatedBy =
				user.role === "admin" ? undefined : { id: user.id }

			const question = await Questions.findOneBy({
				id,
				createdBy: whereCreatedBy,
			})

			if (question !== null) {
				Object.assign(question, data)
				await question.save()
			}

			return question
		} catch (error) {
			throw new AppError(
				"Failed to update question",
				500,
				"InternalServerError"
			)
		}
	}

	/**
	 * Mutation to delete an existing survey question.
	 *
	 * @param id - The ID of the question to delete.
	 * @param context - The context object that contains the currently authenticated user.
	 *
	 * @returns A Promise that resolves to the deleted Question object, or null if the question could not be found or deleted.
	 *
	 * This mutation allows an admin or user to delete an existing survey question. Only the admin or question owner can delete questions.
	 * If the user is not an admin or question owner, the mutation will not be executed.
	 */
	@Authorized("unser", "admin")
	@Mutation(() => Questions, { nullable: true })
	async deleteQuestion(
		@Arg("id", () => ID) id: number,
		@Ctx() context: Context
	): Promise<Questions | null> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			// Only admins or question owner can delete qestions
			const whereCreatedBy =
				user.role === "admin" ? undefined : { id: user.id }

			const question = await Questions.findOneBy({
				id,
				createdBy: whereCreatedBy,
			})

			if (question !== null) {
				await question.remove()
				question.id = id
			}

			return question
		} catch (error) {
			throw new AppError(
				"Failed to delete question",
				500,
				"InternalServerError"
			)
		}
	}
}

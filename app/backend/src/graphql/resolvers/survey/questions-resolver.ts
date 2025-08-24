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
import { Survey } from "../../../database/entities/survey/survey"
import { AppError } from "../../../middlewares/error-handler"
import { Context, Roles, TypesOfQuestion } from "../../../types/types"
import { CreateQuestionsInput } from "../../inputs/create/survey/create-questions-input"
import { UpdateQuestionInput } from "../../inputs/update/survey/update-question-input"
import { isOwnerOrAdmin } from "../../utils/authorizations"

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
	 * @example Good manage error template
	 */
	@Query(() => Questions, { nullable: true })
	async question(@Arg("id", () => ID) id: number): Promise<Questions | null> {
		let question: Questions | null = null

		try {
			question = await Questions.findOne({
				where: { id },
				relations: {
					survey: true,
				},
			})
		} catch (error) {
			throw new AppError(
				"Failed to fetch question",
				500,
				"InternalServerError"
			)
		}

		if (!question) {
			throw new AppError("Question not found", 404, "NotFoundError")
		}

		return question
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
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Questions)
	async createQuestion(
		@Arg("data", () => CreateQuestionsInput)
		data: CreateQuestionsInput,
		@Ctx() context: Context
	): Promise<Questions> {
		try {
			const user = context.user
			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			if (!Object.values(TypesOfQuestion).includes(data.type)) {
				throw new AppError(
					"Invalid question type",
					400,
					"BadRequestError"
				)
			}

			const newQuestion = new Questions()

			newQuestion.title = data.title
			newQuestion.answers = data.answers
			newQuestion.type = data.type

			if (data.surveyId) {
				const survey = await Survey.findOne({
					where: { id: data.surveyId },
					relations: { user: true }, // get survey and its user
				})

				if (!survey) {
					throw new AppError("Survey not found", 404, "NotFoundError")
				}

				if (!isOwnerOrAdmin(survey.user.id, user)) {
					throw new AppError(
						"Not authorized to add a question in this survey",
						403,
						"ForbiddenError"
					)
				}

				newQuestion.survey = survey
			}

			await newQuestion.save()
			return newQuestion
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
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
	@Authorized(Roles.User, Roles.Admin)
	@Mutation(() => Questions, { nullable: true })
	async updateQuestion(
		@Arg("data", () => UpdateQuestionInput)
		data: UpdateQuestionInput,
		@Ctx() context: Context
	): Promise<Questions | null> {
		try {
			const user = context.user

			if (!user) {
				throw new AppError("User not found", 404, "NotFoundError")
			}

			const questionToUpdate = await Questions.findOne({
				where: { id: data.id },
				relations: {
					survey: { user: true }, // get survey and its user
				},
			})

			if (!questionToUpdate) {
				throw new AppError("Question not found", 404, "NotFoundError")
			}

			if (!isOwnerOrAdmin(questionToUpdate.survey.user.id, user)) {
				throw new AppError(
					"Not authorized to update this question",
					403,
					"ForbiddenError"
				)
			}

			const { id, ...dataWithoutId } = data

			const isTypeBoolean = data.type === TypesOfQuestion.Boolean

			if (isTypeBoolean && data.answers && data.answers?.length > 2) {
				throw new AppError(
					"A Boolean question can only have up to 2 answers",
					400,
					"ValidationError"
				)
			}

			// If type is changed to text, clean answers
			if (data.type === TypesOfQuestion.Text) {
				dataWithoutId.answers = []
			}

			Object.assign(questionToUpdate, dataWithoutId)

			await questionToUpdate.save()

			return questionToUpdate
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
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
	@Authorized(Roles.User, Roles.Admin)
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
			const questionToDelete = await Questions.findOne({
				where: { id },
				relations: {
					survey: { user: true }, // get survey and its user
				},
			})

			if (!questionToDelete) {
				throw new AppError("Question not found", 404, "NotFoundError")
			}

			if (!isOwnerOrAdmin(questionToDelete.survey.user.id, user)) {
				throw new AppError(
					"Not authorized to update this question",
					403,
					"ForbiddenError"
				)
			}

			await questionToDelete.remove()
			questionToDelete.id = id

			return questionToDelete
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError(
				"Failed to delete question",
				500,
				"InternalServerError"
			)
		}
	}
}

/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * This module defines the input type used to update a question in the database.
 * It allows partial updates to a question's content, type, and predefined answers.
 */

import { Type } from "class-transformer"
import { Length, ValidateNested } from "class-validator"
import { Field, ID, InputType } from "type-graphql"
import { QuestionTypeEnum } from "../../../../types/types"
import { AnswerObject } from "../../create/survey/create-questions-input"

/**
 * UpdateQuestionInput
 * @description
 * GraphQL input type for updating an existing question.
 * All fields are optional to support partial updates.
 *
 * @example
 * ```ts
 * const updateData = {
 *   content: "What is your favorite animal?",
 *   type: TypeOfQuestion.CHECKBOX,
 *   answers: ["Cat", "Dog", "Bird"]
 * }
 * ```
 *
 * Decorators used:
 * - `@InputType()`: Declares the class as a GraphQL input type.
 * - `@Field()`: Exposes a class property as a GraphQL input field.
 */
@InputType()
export class UpdateQuestionInput {
	/**
	 * Question ID
	 * @description
	 * ID of the question to update.
	 */
	@Field(() => ID)
	id!: number

	@Field(() => String, { nullable: true })
	@Length(1, 1000, {
		message: "Content must be between 1 and 1000 characters",
	})
	title?: string

	/**
	 * Updated type of question
	 * @description
	 * New type for the question (e.g. text, radio, checkbox).
	 */
	@Field(() => QuestionTypeEnum, { nullable: true })
	type?: QuestionTypeEnum

	/**
	 * Updated predefined answers
	 * @description
	 * New set of answers for the question, stored as a JSON array.
	 */
	// @Field(() => [String], { nullable: true })
	// answers?: Answers

	@Field(() => [AnswerObject], { nullable: true })
	@ValidateNested({ each: true }) // Validate each answer object in the array
	@Type(() => AnswerObject) // Transform plain objects to AnswerObject instances to enable validation
	answers?: AnswerObject[]
}

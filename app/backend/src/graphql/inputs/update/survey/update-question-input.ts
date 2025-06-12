/**
 * @packageDocumentation
 * @category Inputs
 * @description
 * This module defines the input type used to update a question in the database.
 * It allows partial updates to a question's content, type, and predefined answers.
 */

import { InputType, Field, ID } from "type-graphql"
import { Answers } from "../../../../database/entities/survey/answers"
import { QuestionType } from "../../../../types/types"

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

	/**
	 * Updated content of the question
	 * @description
	 * New text for the question, must be unique if changed.
	 */
	@Field({ nullable: true })
	content?: string

	/**
	 * Updated type of question
	 * @description
	 * New type for the question (e.g. text, radio, checkbox).
	 */
	@Field(() => String, { nullable: true })
	type?: QuestionType

	/**
	 * Updated predefined answers
	 * @description
	 * New set of answers for the question, stored as a JSON array.
	 */
	@Field(() => [String], { nullable: true })
	answers?: Answers
}

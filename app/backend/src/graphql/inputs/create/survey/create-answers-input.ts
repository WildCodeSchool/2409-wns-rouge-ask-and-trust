import { Length, IsNumber } from "class-validator"
import { InputType, Field } from "type-graphql"

/**
 * Represents input data for creating a new survey answer.
 * This class is used to validate the survey answer data before storing it in the database.
 *
 * @description
 * - `content`: the answer content for the survey question.
 * - `questionId`: the ID of the question being answered.
 * - `createdAt`: timestamp of when the answer was created (automatically set).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 */
@InputType()
export class CreateAnswersInput {
	@Field()
	@Length(1, 1000, {
		message: "Content must be between 1 and 1000 characters",
	})
	content!: string

	@Field(() => Number)
	@IsNumber({}, { message: "Question ID must be a number" })
	questionId!: number
}

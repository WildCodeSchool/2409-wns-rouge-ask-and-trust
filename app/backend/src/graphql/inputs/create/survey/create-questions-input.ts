import { Type } from "class-transformer"
import { Length, ValidateNested } from "class-validator"
import { Field, InputType, ObjectType } from "type-graphql"
import { QuestionType } from "../../../../types/types"

/**
 * Represents input data for creating a new survey question.
 * This class is used to validate the survey question data before storing it in the database.
 *
 * @description
 * - `title`: the content of the survey question, must be a string.
 * - `question`: a reference to the existing survey question, represented by the `Questions` entity.
 * - `answers`: an array of possible answers for the question, must contain at least one answer.
 * - `createdAt`: timestamp when the question is created, automatically set to the current timestamp.
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 */
@InputType()
export class CreateQuestionsInput {
	@Field()
	@Length(1, 1000, {
		message: "Content must be between 1 and 1000 characters",
	})
	title!: string

	@Field(() => String)
	type!: QuestionType

	@Field(() => [AnswerObject])
	@ValidateNested({ each: true }) // Validate each answer object in the array
	@Type(() => AnswerObject) // Transform plain objects to AnswerObject instances to enable validation
	answers!: AnswerObject[]

	@Field(() => Number, { nullable: true })
	surveyId!: number
}

@ObjectType()
@InputType("AnswerObjectInput")
export class AnswerObject {
	@Field()
	@Length(1, 255, {
		message: "An answer must be between 1 and 255 characters",
	})
	value!: string
}

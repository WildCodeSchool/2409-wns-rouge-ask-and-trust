import { InputType, Field } from "type-graphql"

/**
 * Represents input data for creating a new survey question.
 * This class is used to validate the survey question data before storing it in the database.
 *
 * @description
 * - `content`: the content of the survey question, must be a string.
 * - `question`: a reference to the existing survey question, represented by the `SurveyQuestions` entity.
 * - `answers`: an array of possible answers for the question, must contain at least one answer.
 * - `createdAt`: timestamp when the question is created, automatically set to the current timestamp.
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 */
@InputType()
export class CreateSurveyQuestionsInput {
	@Field()
	content!: string

	@Field()
	answers!: string
}

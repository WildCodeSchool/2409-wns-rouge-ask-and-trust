import { InputType, Field } from "type-graphql"

/**
 * Represents input data for creating a new survey answer.
 * This class is used to validate the survey answer data before storing it in the database.
 *
 * @description
 * - `content`: the answer content for the survey question.
 * - `question`: the question to which this answer is associated (relation to `SurveyQuestions`).
 * - `createdAt`: timestamp of when the answer was created (automatically set).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 */
@InputType()
export class CreateSurveyAnswersInput {
	@Field()
	content!: string
}

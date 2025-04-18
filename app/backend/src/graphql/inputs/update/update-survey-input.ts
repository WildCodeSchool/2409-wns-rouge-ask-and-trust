import { InputType, Field } from "type-graphql"
import { Length } from "class-validator"
import { CreateCategorySurveyInput } from "../create/create-surveyCategory-input"

/**
 * Represents input data for updating an existing survey.
 * This class is used to validate the survey data before applying updates in the database.
 *
 * @description
 * - `title`: The title of the survey (must be between 10 and 255 characters).
 * - `description`: The description of the survey (must be between 100 and 5000 characters).
 * - `public`: Indicates whether the survey is public or private (optional).
 * - `category`: The category associated with the survey (optional, follows structure of `CreateCategorySurveyInput`).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Ensures the string length is within the specified bounds.
 */
@InputType()
export class UpdateSurveyInput {
	@Field()
	@Length(10, 255, { message: "Title must be between 10 and 255 chars" })
	title!: string

	@Field()
	@Length(100, 5000, {
		message: "Description must be between 100 and 5000 chars",
	})
	description!: string

	@Field({ nullable: true })
	public!: boolean

	@Field(() => CreateCategorySurveyInput, { nullable: true })
	category!: CreateCategorySurveyInput
}

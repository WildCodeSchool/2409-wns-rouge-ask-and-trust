import { InputType, Field } from "type-graphql"
import { Length } from "class-validator"
import { CreateCategorySurveyInput } from "./create-surveyCategory-input"

/**
 * Represents input data for creating a new survey.
 * This class is used to validate the survey data before storing it in the database.
 *
 * @description
 * - `title`: the title of the survey, must be between 10 and 255 characters.
 * - `description`: the detailed description of the survey, must be between 100 and 5000 characters.
 * - `public`: indicates whether the survey is public or private.
 * - `category`: category for the survey, represented by a nested input of type `CreateCategorySurveyInput`.
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Ensures the string length is within the specified bounds.
 */
@InputType()
export class CreateSurveyInput {
	@Field()
	@Length(10, 255, { message: "Title must be between 10 and 255 characters" })
	title!: string

	@Field()
	@Length(100, 5000, {
		message: "Description must be between 100 and 5000 characters",
	})
	description!: string

	@Field({ nullable: true })
	public!: boolean

	@Field(() => CreateCategorySurveyInput, { nullable: true })
	category!: CreateCategorySurveyInput
}

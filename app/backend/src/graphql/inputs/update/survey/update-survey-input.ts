import { IsIn, IsOptional, Length } from "class-validator"
import { Field, ID, InputType } from "type-graphql"
import { SurveyStatus } from "../../../../types/types"
import { CreateQuestionsInput } from "../../create/survey/create-questions-input"

/**
 * Represents input data for updating an existing survey.
 * This class is used to validate the survey data before applying updates in the database.
 *
 * @description
 * - `title`: The title of the survey (must be between 10 and 255 characters).
 * - `description`: The description of the survey (must be between 100 and 5000 characters).
 * - `public`: Indicates whether the survey is public or private (optional).
 * - `category`: The category associated with the survey (optional, follows structure of `CreateCategoryInput`).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Ensures the string length is within the specified bounds.
 */
@InputType()
export class UpdateSurveyInput {
	@Field(() => ID)
	id!: number

	@Field({ nullable: true })
	@IsOptional()
	@Length(1, 255, { message: "Title must be between 1 and 255 chars" })
	title?: string

	@Field({ nullable: true })
	@IsOptional()
	@Length(1, 5000, {
		message: "Description must be between 1 and 5000 chars",
	})
	description?: string

	@Field({ nullable: true })
	@IsOptional()
	public?: boolean

	@Field({ nullable: true })
	@IsOptional()
	@IsIn(Object.values(SurveyStatus), {
		message: "Status must be one of: draft, published, archived, censored",
	})
	status?: string

	@Field(() => ID, { nullable: true })
	@IsOptional()
	category?: number

	@Field(() => [CreateQuestionsInput], { nullable: true })
	@IsOptional()
	questions?: CreateQuestionsInput[]
}

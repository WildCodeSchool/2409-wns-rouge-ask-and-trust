import { Length } from "class-validator"
import { Field, InputType } from "type-graphql"

/**
 * Represents input data for updating an existing survey category.
 * This class is used to validate the category data before updating it in the database.
 *
 * @description
 * - `name`: The name of the survey category (must be between 5 and 100 characters).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Ensures the string length is within the specified bounds.
 */
@InputType()
export class UpdateCategoryInput {
	@Field()
	@Length(1, 100, { message: "Category must be between 1 and 100 chars" })
	name!: string
}

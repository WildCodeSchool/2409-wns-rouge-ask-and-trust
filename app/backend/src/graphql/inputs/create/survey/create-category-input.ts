import { Length } from "class-validator"
import { Field, InputType } from "type-graphql"

/**
 * Represents input data for creating a new survey category.
 * This class is used to validate the category data before storing it in the database.
 *
 * @description
 * - `name`: the name of the survey category, must be between 5 and 100 characters.
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@Length()`: Ensures the string length is within the specified bounds.
 */
@InputType()
export class CreateCategoryInput {
	@Field()
	@Length(1, 100, {
		message: "Category name must be between 1 and 100 characters.",
	})
	name!: string
}

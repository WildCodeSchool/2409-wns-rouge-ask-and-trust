import { IsEmail, IsIn, IsOptional, Length } from "class-validator"
import { Field, InputType } from "type-graphql"
import { Roles, UserRole } from "../../../types/types"

/**
 * Represents user input for updating an existing user.
 * This class is used to validate the data before updating the user in the database.
 *
 * - `email`: The user's email address (optional, must be valid if provided).
 * - `firstname`: The user's first name (optional, must be between 2 and 100 characters if provided).
 * - `lastname`: The user's last name (optional, must be between 2 and 100 characters if provided).
 * - `role`: the user's role, must be one of the valid roles defined in the `Roles` enum (optional).
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@IsEmail()`: Ensures the email is valid (only if the email is provided).
 * - `@Length()`: Ensures the string length is within the specified bounds (for `firstname`, `lastname`).
 * - `@IsOptional()`: Indicates that the field is optional.
 * - `@IsIn()`: ensures the `role` is a valid role as defined in the `Roles` enum (optional).
 */
@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	@IsEmail({}, { message: "The email must be valid." })
	@IsOptional()
	email?: string

	@Field({ nullable: true })
	@Length(2, 100, {
		message: "The firstname must contain between 2 and 100 characters.",
	})
	@IsOptional()
	firstname?: string

	@Field({ nullable: true })
	@Length(2, 100, {
		message: "The lastname must contain between 2 and 100 characters.",
	})
	@IsOptional()
	lastname?: string

	@Field({ nullable: true })
	@IsIn(Object.values(Roles), {
		message: "This role is invalid",
	})
	@IsOptional()
	role?: UserRole
}

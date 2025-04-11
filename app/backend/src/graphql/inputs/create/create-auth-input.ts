import {
	IsEmail,
	IsIn,
	IsNotEmpty,
	IsStrongPassword,
	Length,
} from "class-validator"
import { Field, InputType } from "type-graphql"
import { Roles, UserRole } from "../../../types/types"

/**
 * Represents user input for creating a new user (SIGN UP).
 * This class is used to validate the data before storing it in the database.
 *
 * - `email`: the user's email address, must be valid.
 * - `password`: the user's password, with specific requirements:
 *   - Must be between 6 and 255 characters.
 *   - Must contain at least one uppercase letter, one lowercase letter, one number, and one symbol.
 * - `firstname`: the user's first name, must be between 2 and 100 characters.
 * - `lastname`: the user's last name, must be between 2 and 100 characters.
 * - `role`: the user's role, must be one of the valid roles defined in the `Roles` enum.
 *
 * The class uses the following decorators:
 * - `@Field()`: exposes the property in the GraphQL schema (via type-graphql).
 * - `@IsEmail()`: ensures the email is valid.
 * - `@IsStrongPassword()`: ensures the password meets strong security requirements.
 * - `@Length()`: ensures the string length is within the specified bounds.
 * - `@IsIn()`: ensures the role is a valid role as defined in the `Roles` enum.
 */
@InputType()
export class CreateUserInput {
	@Field()
	@IsEmail({}, { message: "The email must be valid." })
	email!: string

	@Field()
	@Length(8, 255, {
		message: "The password must contain between 6 and 255 characters.",
	})
	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message:
				"The password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
		}
	)
	password!: string

	@Field()
	@Length(2, 100, {
		message: "The firstname must contain between 2 and 100 characters.",
	})
	firstname!: string

	@Field()
	@Length(2, 100, {
		message: "The lastname must contain between 2 and 100 characters.",
	})
	lastname!: string

	@Field()
	@IsIn(Object.values(Roles), {
		message: "This role is invalid",
	})
	role!: UserRole
}

/**
 * Represents user input for logging in (SIGN IN).
 * This class is used to validate the email and password data provided by the user for authentication.
 *
 * - `email`: The user's email address, must be valid.
 * - `password`: The user's password, must not be empty.
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@IsEmail()`: Ensures the email is valid.
 * - `@IsNotEmpty()`: Ensures the password is provided.
 */
@InputType()
export class LogUserInput {
	@Field()
	@IsEmail({}, { message: "Invalid e-mail" })
	@IsNotEmpty({ message: "Email is required" })
	email!: string

	@Field()
	@IsNotEmpty({ message: "Password is required" })
	password!: string
}

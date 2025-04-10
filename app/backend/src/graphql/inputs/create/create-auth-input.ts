import { IsEmail, IsIn, IsStrongPassword, Length } from "class-validator"
import { Field, InputType } from "type-graphql"
import { Roles, UserRole } from "../../../types/types"

@InputType()
export class CreateUserInput {
	// EMAIL
	@Field()
	@IsEmail({}, { message: "The email must be valid." })
	email!: string

	// PASSWORD
	@Field()
	@Length(6, 255, {
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

	// FIRSTNAME
	@Field()
	@Length(2, 100, {
		message: "The firstname must contain between 2 and 100 characters.",
	})
	firstname!: string

	// LASTNAME
	@Field()
	@Length(2, 100, {
		message: "The lastname must contain between 2 and 100 characters.",
	})
	lastname!: string

	// ROLE
	@Field()
	@IsIn(Object.values(Roles), {
		message: "The lastname must contain between 2 and 100 characters.",
	})
	role!: UserRole
}

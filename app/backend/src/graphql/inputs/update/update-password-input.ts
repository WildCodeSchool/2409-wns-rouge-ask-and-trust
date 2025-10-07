import { Field, InputType } from "type-graphql"
import { IsNotEmpty, IsStrongPassword, Length } from "class-validator"

/**
 * Input for changing password
 * @description
 * Contains current password and new password for authenticated users
 */
@InputType()
export class UpdatePasswordInput {
	@Field()
	@IsNotEmpty({ message: "The current password is required" })
	currentPassword!: string

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
	newPassword!: string
}

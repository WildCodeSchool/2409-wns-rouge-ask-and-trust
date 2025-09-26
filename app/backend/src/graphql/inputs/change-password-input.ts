import { Field, InputType } from "type-graphql"
import { IsNotEmpty, MinLength } from "class-validator"

/**
 * Input for changing password
 * @description
 * Contains current password and new password for authenticated users
 */
@InputType()
export class ChangePasswordInput {
	@Field()
	@IsNotEmpty({ message: "L'ancien mot de passe est requis" })
	currentPassword!: string

	@Field()
	@MinLength(8, {
		message: "Le nouveau mot de passe doit contenir au moins 8 caractères",
	})
	newPassword!: string
}

import { Field, InputType } from "type-graphql"
import { IsNotEmpty, MinLength } from "class-validator"

/**
 * Input for using a recovery code to reset password
 * @description
 * Contains the recovery code and new password for password reset
 */
@InputType()
export class UseRecoveryCodeInput {
	@Field()
	@IsNotEmpty({ message: "L'email est requis" })
	email!: string

	@Field()
	@IsNotEmpty({ message: "Le code de récupération est requis" })
	recoveryCode!: string

	@Field()
	@MinLength(8, {
		message: "Le mot de passe doit contenir au moins 8 caractères",
	})
	newPassword!: string
}

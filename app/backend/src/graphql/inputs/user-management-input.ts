import { Field, InputType } from "type-graphql"
import { IsNotEmpty, MinLength } from "class-validator"

/**
 * Input for confirming account deletion
 * @description
 * Requires password confirmation for security
 */
@InputType()
export class DeleteAccountInput {
	@Field()
	@IsNotEmpty({
		message: "Le mot de passe est requis pour confirmer la suppression",
	})
	@MinLength(1, { message: "Le mot de passe ne peut pas être vide" })
	currentPassword!: string

	@Field()
	@IsNotEmpty({ message: "La confirmation est requise" })
	confirmDeletion!: string // Should be "DELETE" or similar confirmation text
}

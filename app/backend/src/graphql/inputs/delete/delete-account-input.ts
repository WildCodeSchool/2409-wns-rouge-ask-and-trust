import { IsNotEmpty, Length } from "class-validator"
import { Field, InputType } from "type-graphql"

/**
 * Represents user input for deleting their account (RGPD Right to be Forgotten).
 * This class validates data before permanently deleting the user account.
 *
 * - `password`: The user's current password for verification.
 * - `confirmationText`: A confirmation text that must match exactly "SUPPRIMER MON COMPTE".
 *
 * The class uses the following decorators:
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 * - `@IsNotEmpty()`: Ensures the field is provided.
 * - `@Length()`: Ensures the string length is within specified bounds.
 */
@InputType()
export class DeleteAccountInput {
	@Field()
	@IsNotEmpty({ message: "Password is required to confirm account deletion" })
	@Length(8, 255, {
		message: "The password must contain between 8 and 255 characters.",
	})
	password!: string

	@Field()
	@IsNotEmpty({ message: "Confirmation text is required" })
	confirmationText!: string
}

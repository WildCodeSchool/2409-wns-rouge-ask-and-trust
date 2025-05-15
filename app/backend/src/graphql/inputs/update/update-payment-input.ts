import {
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Length,
} from "class-validator"
import { Field, InputType, Int } from "type-graphql"

/**
 * Represents user input for updating an existing payment.
 * This class is used to validate the data before updating a payment in the database.
 *
 * @description
 * - `id`: the unique identifier of the payment to update.
 * - `amount`: the new amount to charge in cents, must be a positive number (optional).
 * - `currency`: the new currency code (e.g., 'eur'), must be a string of 3 characters (optional).
 * - `description`: a new description of the payment, must be between 3 and 255 characters (optional).
 * - `surveyCount`: the new number of surveys that will be added to the user's quota, must be a positive number (optional).
 *
 * @example
 * The class uses the following decorators:
 * - `@Field()`: exposes the property in the GraphQL schema (via type-graphql).
 * - `@IsNumber()`: ensures the amount is a number.
 * - `@IsPositive()`: ensures the amount is positive.
 * - `@IsString()`: ensures the currency is a string.
 * - `@Length()`: ensures the string length is within the specified bounds.
 * - `@IsOptional()`: marks the field as optional for updates.
 */
/**
 * @note Update with role juste for admin
 */
@InputType()
export class UpdatePaymentInput {
	@Field(() => Int)
	@IsNumber({}, { message: "The ID must be a number." })
	@IsPositive({ message: "The ID must be positive." })
	id!: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber({}, { message: "The amount must be a number." })
	@IsPositive({ message: "The amount must be positive." })
	amount?: number

	@Field({ nullable: true })
	@IsOptional()
	@IsString({ message: "The currency must be a string." })
	@Length(3, 3, {
		message: "The currency must be a 3-character code (e.g., 'eur').",
	})
	currency?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString({ message: "The description must be a string." })
	@Length(3, 255, {
		message: "The description must be between 3 and 255 characters.",
	})
	description?: string

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber({}, { message: "The survey count must be a number." })
	@IsPositive({ message: "The survey count must be positive." })
	surveyCount?: number
}

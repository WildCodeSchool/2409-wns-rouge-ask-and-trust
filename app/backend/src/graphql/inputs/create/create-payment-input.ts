import { IsNumber, IsPositive, IsString, Length } from "class-validator"
import { Field, InputType, Int } from "type-graphql"

/**
 * Represents user input for creating a new payment intent.
 * This class is used to validate the data before creating a payment intent with Stripe.
 *
 * @description
 * - `amount`: the amount to charge in cents, must be a positive number.
 * - `currency`: the currency code (e.g., 'eur'), must be a string of 3 characters.
 * - `description`: a description of the payment, must be between 3 and 255 characters.
 * - `surveyCount`: the number of surveys that will be added to the user's quota, must be a positive number.
 *
 * @example
 * The class uses the following decorators:
 * - `@Field()`: exposes the property in the GraphQL schema (via type-graphql).
 * - `@IsNumber()`: ensures the amount is a number.
 * - `@IsPositive()`: ensures the amount is positive.
 * - `@IsString()`: ensures the currency is a string.
 * - `@Length()`: ensures the string length is within the specified bounds.
 */
@InputType()
export class CreatePaymentInput {
	@Field(() => Int)
	@IsNumber({}, { message: "The amount must be a number." })
	@IsPositive({ message: "The amount must be positive." })
	amount!: number

	@Field()
	@IsString({ message: "The currency must be a string." })
	@Length(3, 3, {
		message: "The currency must be a 3-character code (e.g., 'eur').",
	})
	currency!: string

	@Field()
	@IsString({ message: "The description must be a string." })
	@Length(3, 255, {
		message: "The description must be between 3 and 255 characters.",
	})
	description!: string

	@Field(() => Int)
	@IsNumber({}, { message: "The survey count must be a number." })
	@IsPositive({ message: "The survey count must be positive." })
	surveyCount!: number
}

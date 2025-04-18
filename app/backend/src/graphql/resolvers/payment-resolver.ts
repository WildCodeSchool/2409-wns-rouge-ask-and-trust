/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for payment-related operations.
 * It handles payment creation, retrieval, and status management.
 */

import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { Context, Roles } from "../../types/types"
import { Payment } from "../../database/entities/payment"
import {
	createPaymentIntent,
	getPaymentById,
	getPaymentsByUserId,
	updatePayment,
} from "../../services/stripe-service"
import { AppError } from "../../middlewares/error-handler"
import { CreatePaymentInput } from "../inputs/create/create-payment-input"
import { UpdatePaymentInput } from "../inputs/update/update-payment-input"

/**
 * Payment Resolver
 * @description
 * Handles GraphQL operations related to payments, including creation and retrieval.
 * Integrates with the Stripe service for payment processing.
 */
@Resolver()
export class PaymentResolver {
	/**
	 * Creates a new payment intent
	 * @param input - The input data for creating a payment
	 * @param context - The context containing the authenticated user
	 * @returns The client secret for the payment intent
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   createPaymentIntent(input: {
	 *     amount: 1000
	 *     currency: "eur"
	 *     description: "Pack 50 enquêtes"
	 *     surveyCount: 50
	 *   })
	 * }
	 * ```
	 */
	@Mutation(() => String)
	@Authorized()
	async createPaymentIntent(
		@Arg("input") input: CreatePaymentInput,
		@Ctx() { user }: Context
	): Promise<string> {
		if (!user) {
			throw new AppError(
				"Not authenticated",
				401,
				"NotAuthenticatedError"
			)
		}

		return createPaymentIntent(
			input.amount,
			input.currency,
			input.description,
			input.surveyCount,
			user.id
		)
	}

	/**
	 * Updates an existing payment
	 * @param input - The input data for updating a payment
	 * @param context - The context containing the authenticated user
	 * @returns The updated payment object
	 *
	 * @example
	 * ```graphql
	 * mutation {
	 *   updatePayment(input: {
	 *     id: 1
	 *     amount: 2000
	 *     description: "Pack 100 enquêtes"
	 *   }) {
	 *     id
	 *     amount
	 *     status
	 *   }
	 * }
	 * ```
	 */
	@Mutation(() => Payment)
	@Authorized()
	async updatePayment(
		@Arg("input") input: UpdatePaymentInput,
		@Ctx() { user }: Context
	): Promise<Payment> {
		if (!user) {
			throw new AppError(
				"Not authenticated",
				401,
				"NotAuthenticatedError"
			)
		}

		const payment = await getPaymentById(input.id)

		// Ensure the user can only update their own payments
		if (payment.userId !== user.id && user.role !== Roles.Admin) {
			throw new AppError("Not authorized", 403, "NotAuthorizedError")
		}

		return updatePayment(input)
	}

	/**
	 * Retrieves a payment by ID
	 * @param id - The ID of the payment to retrieve
	 * @param context - The context containing the authenticated user
	 * @returns The payment object
	 *
	 * @example
	 * ```graphql
	 * query {
	 *   payment(id: 1) {
	 *     id
	 *     amount
	 *     status
	 *   }
	 * }
	 * ```
	 */
	@Query(() => Payment)
	@Authorized()
	async payment(
		@Arg("id") id: number,
		@Ctx() { user }: Context
	): Promise<Payment> {
		if (!user) {
			throw new AppError(
				"Not authenticated",
				401,
				"NotAuthenticatedError"
			)
		}

		const payment = await getPaymentById(id)

		// Ensure the user can only access their own payments
		if (payment.userId !== user.id && user.role !== Roles.Admin) {
			throw new AppError("Not authorized", 403, "NotAuthorizedError")
		}

		return payment
	}

	/**
	 * Retrieves all payments for the authenticated user
	 * @param context - The context containing the authenticated user
	 * @returns An array of payment objects
	 *
	 * @example
	 * ```graphql
	 * query {
	 *   myPayments {
	 *     id
	 *     amount
	 *     status
	 *   }
	 * }
	 * ```
	 */
	@Query(() => [Payment])
	@Authorized()
	async myPayments(@Ctx() { user }: Context): Promise<Payment[]> {
		if (!user) {
			throw new AppError(
				"Not authenticated",
				401,
				"NotAuthenticatedError"
			)
		}

		return getPaymentsByUserId(user.id)
	}
}

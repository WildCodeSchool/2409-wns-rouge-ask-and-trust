/**
 * @packageDocumentation
 * @category Resolvers
 * @description
 * This module provides GraphQL resolvers for payment-related operations.
 * It handles payment creation, retrieval, and status management.
 */

import { Arg, Ctx, Mutation, Query, Resolver, Float, Int } from "type-graphql"
import { Context, Roles } from "../../types/types"
import { Payment } from "../../database/entities/payment"
import { createPaymentIntent, getPaymentById, getPaymentsByUserId } from "../../services/stripe-service"
import { AppError } from "../../middlewares/error-handler"

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
   * @param amount - The amount to charge in cents
   * @param currency - The currency code (default: 'eur')
   * @param description - Description of the payment
   * @param surveyCount - Number of surveys that will be added to the user's quota
   * @param userId - The ID of the user making the payment
   * @returns The created payment object
   * 
   * @example
   * ```graphql
   * mutation {
   *   createPaymentIntent(amount: 1000, currency: "eur", description: "Pack 50 enquêtes", surveyCount: 50) {
   *     id
   *     amount
   *     status
   *   }
   * }
   * ```
   */
  @Mutation(() => String)
  async createPaymentIntent(
    @Arg("amount", () => Float) amount: number,
    @Arg("currency") currency: string,
    @Arg("description") description: string,
    @Arg("surveyCount", () => Int) surveyCount: number,
    @Ctx() { user }: Context
  ): Promise<string> {
    if (!user) {
      throw new AppError("Not authenticated", 401, "NotAuthenticatedError")
    }

    return createPaymentIntent(amount, currency, description, surveyCount, user.id)
  }

  /**
   * Retrieves a payment by ID
   * @param id - The ID of the payment to retrieve
   * @returns The payment object
   * 
   * @example
   * ```graphql
   * query {
   *   payment(id: "123") {
   *     id
   *     amount
   *     status
   *   }
   * }
   * ```
   */
  @Query(() => Payment)
  async payment(
    @Arg("id") id: number,
    @Ctx() { user }: Context
  ): Promise<Payment> {
    if (!user) {
      throw new AppError("Not authenticated", 401, "NotAuthenticatedError")
    }

    const payment = await getPaymentById(id)

    // Ensure the user can only access their own payments
    if (payment.userId !== user.id && user.role !== Roles.Admin) {
      throw new AppError("Not authorized", 403, "NotAuthorizedError")
    }

    return payment
  }

  /**
   * Retrieves all payments for a user
   * @param userId - The ID of the user
   * @returns An array of payment objects
   * 
   * @example
   * ```graphql
   * query {
   *   userPayments(userId: "123") {
   *     id
   *     amount
   *     status
   *   }
   * }
   * ```
   */
  @Query(() => [Payment])
  async myPayments(@Ctx() { user }: Context): Promise<Payment[]> {
    if (!user) {
      throw new AppError("Not authenticated", 401, "NotAuthenticatedError")
    }

    return getPaymentsByUserId(user.id)
  }
} 
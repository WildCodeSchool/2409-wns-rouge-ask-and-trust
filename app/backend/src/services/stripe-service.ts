/**
 * @packageDocumentation
 * @category Services
 * @description
 * This module provides Stripe payment integration services for the application.
 * It handles payment intents, webhooks, and payment status management.
 */

import Stripe from "stripe"
import dataSource from "../database/config/datasource"
import { Payment } from "../database/entities/payment"
import { User } from "../database/entities/user"
import { AppError } from "../middlewares/error-handler"

/**
 * Stripe service configuration
 * @remarks
 * The service is initialized with a test secret key for development.
 * In production, use the live secret key from environment variables.
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2025-03-31.basil", // Latest API version
})

// Test card details for development
// Card number: 4242 4242 4242 4242
// Expiry: Any future date
// CVC: Any 3 digits

/**
 * Creates a payment intent with Stripe
 * @param amount - Amount in cents
 * @param currency - Currency code (e.g., 'eur')
 * @param description - Description of the payment
 * @param surveyCount - Number of surveys that will be added to the user's quota
 * @param userId - ID of the user making the payment
 * @returns The client secret for the payment intent
 * @throws Error if payment creation fails
 *
 * @example
 * ```typescript
 * const payment = await createPaymentIntent(1000, 'eur', 'Pack 50 enquêtes', 50, 1);
 * ```
 */
export const createPaymentIntent = async (
	amount: number,
	currency: string,
	description: string,
	surveyCount: number,
	userId: number
): Promise<string> => {
	try {
		// Get the user
		const userRepository = dataSource.getRepository(User)
		const user = await userRepository.findOne({ where: { id: userId } })

		if (!user) {
			throw new AppError("User not found", 404, "UserNotFoundError")
		}

		// Create a payment intent with Stripe
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			description,
			payment_method_types: ["card"],
			metadata: {
				userId: userId.toString(),
				surveyCount: surveyCount.toString(),
			},
		})

		// Create a payment record in the database
		const paymentRepository = dataSource.getRepository(Payment)

		const payment = paymentRepository.create({
			amount,
			currency,
			status: paymentIntent.status,
			stripePaymentIntentId: paymentIntent.id,
			description,
			surveyCount,
			userId,
		})

		await payment.save()

		// Return the client secret
		return paymentIntent.client_secret || ""
	} catch (error) {
		console.error("Error creating payment intent:", error)
		throw new AppError(
			"Failed to create payment intent",
			500,
			"PaymentIntentCreationError"
		)
	}
}

/**
 * Handles a webhook event from Stripe
 * @param signature - The Stripe signature header
 * @param payload - The raw request body
 * @returns A success message
 * @throws Error if webhook verification fails
 *
 * @example
 * ```typescript
 * await handleStripeWebhook(signature, rawBody);
 * ```
 */
export const handleWebhook = async (
	signature: string,
	payload: Buffer
): Promise<string> => {
	try {
		// Verify the webhook signature
		const event = stripe.webhooks.constructEvent(
			payload,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET || ""
		)

		// Handle the event
		if (event.type === "payment_intent.succeeded") {
			const paymentIntent = event.data.object as Stripe.PaymentIntent
			await handlePaymentIntentSucceeded(paymentIntent)
		} else if (event.type === "payment_intent.payment_failed") {
			const paymentIntent = event.data.object as Stripe.PaymentIntent
			await handlePaymentIntentFailed(paymentIntent)
		}

		return "Webhook processed successfully"
	} catch (error) {
		console.error("Error processing webhook:", error)
		throw new AppError(
			"Failed to process webhook",
			400,
			"WebhookProcessingError"
		)
	}
}

/**
 * Handles a successful payment intent
 * @param paymentIntent - The Stripe payment intent
 * @returns Promise<void>
 *
 * @example
 * ```typescript
 * await handlePaymentSuccess(paymentIntent);
 * ```
 */
const handlePaymentIntentSucceeded = async (
	paymentIntent: Stripe.PaymentIntent
): Promise<void> => {
	try {
		// Update the payment record in the database
		const paymentRepository = dataSource.getRepository(Payment)
		const payment = await paymentRepository.findOne({
			where: { stripePaymentIntentId: paymentIntent.id },
		})

		if (payment) {
			payment.status = "succeeded"
			await payment.save()

			// Get the user and update their survey quota
			const userRepository = dataSource.getRepository(User)
			const user = await userRepository.findOne({
				where: { id: payment.userId },
			})

			if (user) {
				/**
				 * @Update the user's survey quota
				 * @note You'll need to add a surveyQuota field to the User entity
				 * @note For now, we'll just log the update
				 */
				console.log(
					`User ${user.id} has purchased ${payment.surveyCount} surveys`
				)

				/**
				 * @Update: Implement the actual quota update when the User entity has a surveyQuota field
				 * @note: user.surveyQuota += payment.surveyCount
				 * @note: await user.save()
				 */
			}
		}
	} catch (error) {
		console.error("Error handling successful payment:", error)
	}
}

/**
 * Handles a failed payment intent
 * @param paymentIntent - The Stripe payment intent
 * @returns Promise<void>
 */
const handlePaymentIntentFailed = async (
	paymentIntent: Stripe.PaymentIntent
): Promise<void> => {
	try {
		// Update the payment record in the database
		const paymentRepository = dataSource.getRepository(Payment)
		const payment = await paymentRepository.findOne({
			where: { stripePaymentIntentId: paymentIntent.id },
		})

		if (payment) {
			payment.status = "failed"
			await payment.save()
		}
	} catch (error) {
		console.error("Error handling failed payment:", error)
	}
}

/**
 * Retrieves a payment by its ID
 * @param id - The ID of the payment
 * @returns The payment object
 * @throws Error if payment retrieval fails
 */
export const getPaymentById = async (id: number): Promise<Payment> => {
	try {
		const paymentRepository = dataSource.getRepository(Payment)
		const payment = await paymentRepository.findOne({
			where: { id },
			relations: ["user"],
		})

		if (!payment) {
			throw new AppError("Payment not found", 404, "PaymentNotFoundError")
		}

		return payment
	} catch (error) {
		if (error instanceof AppError) {
			throw error
		}
		console.error("Error retrieving payment:", error)
		throw new AppError(
			"Failed to retrieve payment",
			500,
			"PaymentRetrievalError"
		)
	}
}

/**
 * Retrieves all payments for a user
 * @param userId - The ID of the user
 * @returns An array of payment objects
 * @throws Error if user payments retrieval fails
 */
export const getPaymentsByUserId = async (
	userId: number
): Promise<Payment[]> => {
	try {
		const paymentRepository = dataSource.getRepository(Payment)
		const payments = await paymentRepository.find({
			where: { userId },
			relations: ["user"],
			order: { createdAt: "DESC" },
		})

		return payments
	} catch (error) {
		console.error("Error retrieving user payments:", error)
		throw new AppError(
			"Failed to retrieve user payments",
			500,
			"UserPaymentsRetrievalError"
		)
	}
}

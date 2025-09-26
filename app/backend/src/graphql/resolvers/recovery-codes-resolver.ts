import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { AppError } from "../../middlewares/error-handler"
import {
	generateRecoveryCodes,
	useRecoveryCode,
	hasRecoveryCodes,
	getRemainingRecoveryCodesCount,
} from "../../services/recovery-codes-service"
import { Context } from "../../types/types"
import { UseRecoveryCodeInput } from "../inputs/recovery-codes-input"
import { getUserFromContext } from "../utils/authorizations"
import {
	checkRateLimit,
	authRateLimiter,
} from "../../middlewares/apollo-rate-limiter"

/**
 * RecoveryCodesResolver handles recovery codes operations
 * for secure password reset without email dependency
 */
@Resolver()
export class RecoveryCodesResolver {
	/**
	 * Generates new recovery codes for the authenticated user
	 * @param context - GraphQL context with user information
	 * @returns Promise<string[]> - Array of recovery codes (shown only once)
	 */
	@Authorized()
	@Mutation(() => [String])
	async generateRecoveryCodes(@Ctx() context: Context): Promise<string[]> {
		// Rate limiting for recovery codes generation
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "generate-recovery-codes")

		const currentUser = getUserFromContext(context.user)

		try {
			const codes = await generateRecoveryCodes(currentUser.id)
			return codes
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}

			console.error("Recovery codes generation error:", error)
			throw new AppError(
				"Erreur lors de la génération des codes de récupération",
				500,
				"InternalError"
			)
		}
	}

	/**
	 * Uses a recovery code to reset password
	 * @param data - Input containing email, recovery code and new password
	 * @param context - GraphQL context for rate limiting
	 * @returns Promise<string> - Success message
	 */
	@Mutation(() => String)
	async useRecoveryCode(
		@Arg("data") data: UseRecoveryCodeInput,
		@Ctx() context: Context
	): Promise<string> {
		// Rate limiting for recovery code usage
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "use-recovery-code")

		try {
			const { email, recoveryCode, newPassword } = data
			return await useRecoveryCode(email, recoveryCode, newPassword)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}

			console.error("Recovery code usage error:", error)
			throw new AppError(
				"Erreur lors de l'utilisation du code de récupération",
				500,
				"InternalError"
			)
		}
	}

	/**
	 * Checks if the authenticated user has recovery codes
	 * @param context - GraphQL context with user information
	 * @returns Promise<boolean> - True if user has recovery codes
	 */
	@Authorized()
	@Query(() => Boolean)
	async hasRecoveryCodes(@Ctx() context: Context): Promise<boolean> {
		const currentUser = getUserFromContext(context.user)

		try {
			return await hasRecoveryCodes(currentUser.id)
		} catch (error) {
			console.error("Check recovery codes error:", error)
			return false
		}
	}

	/**
	 * Gets the number of remaining recovery codes for the authenticated user
	 * @param context - GraphQL context with user information
	 * @returns Promise<number> - Number of remaining recovery codes
	 */
	@Authorized()
	@Query(() => Number)
	async remainingRecoveryCodes(@Ctx() context: Context): Promise<number> {
		const currentUser = getUserFromContext(context.user)

		try {
			return await getRemainingRecoveryCodesCount(currentUser.id)
		} catch (error) {
			console.error("Get remaining recovery codes error:", error)
			return 0
		}
	}
}

import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"
import * as argon2 from "argon2"
import { AppError } from "../../middlewares/error-handler"
import {
	deleteUserAccount,
	exportUserData,
} from "../../services/user-management-service"
import { Context, Roles } from "../../types/types"
import { DeleteAccountInput } from "../inputs/user-management-input"
import { getUserFromContext } from "../utils/authorizations"
import {
	checkRateLimit,
	authRateLimiter,
} from "../../middlewares/apollo-rate-limiter"

/**
 * UserManagementResolver handles user account management operations
 * including GDPR-compliant account deletion and data export
 */
@Resolver()
export class UserManagementResolver {
	/**
	 * Deletes the authenticated user's account with GDPR compliance
	 * @param data - Input containing password confirmation
	 * @param context - GraphQL context with user information
	 * @returns Promise<string> - Success message
	 */
	@Authorized()
	@Mutation(() => String)
	async deleteMyAccount(
		@Arg("data") data: DeleteAccountInput,
		@Ctx() context: Context
	): Promise<string> {
		// Rate limiting for account deletion
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "account-deletion")

		const currentUser = getUserFromContext(context.user)

		try {
			const { currentPassword, confirmDeletion } = data

			// Verify confirmation text
			if (confirmDeletion !== "SUPPRIMER") {
				throw new AppError(
					"Vous devez taper 'SUPPRIMER' pour confirmer la suppression",
					400,
					"InvalidConfirmationError"
				)
			}

			// Verify current password
			const isPasswordValid = await argon2.verify(
				currentUser.hashedPassword,
				currentPassword
			)

			if (!isPasswordValid) {
				throw new AppError(
					"Mot de passe incorrect",
					401,
					"UnauthorizedError"
				)
			}

			// Delete the account
			const result = await deleteUserAccount(currentUser.id)

			// Clear authentication cookie
			const { cookies } = context
			if (cookies) {
				cookies.set("token", "", { maxAge: -1 })
			}

			return result
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}

			console.error("Account deletion error:", error)
			throw new AppError(
				"Erreur lors de la suppression du compte",
				500,
				"InternalError"
			)
		}
	}

	/**
	 * Exports all user data for GDPR data portability
	 * @param context - GraphQL context with user information
	 * @returns Promise<string> - JSON string of user data export
	 */
	@Authorized()
	@Query(() => String)
	async exportMyData(@Ctx() context: Context): Promise<string> {
		// Rate limiting for data export
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "data-export")

		const currentUser = getUserFromContext(context.user)

		try {
			const dataExport = await exportUserData(currentUser.id)
			return JSON.stringify(dataExport, null, 2)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}

			console.error("Data export error:", error)
			throw new AppError(
				"Erreur lors de l'export des données",
				500,
				"InternalError"
			)
		}
	}

	/**
	 * Admin-only mutation to delete any user account
	 * @param userId - ID of user to delete
	 * @param context - GraphQL context
	 * @returns Promise<string> - Success message
	 */
	@Authorized(Roles.Admin)
	@Mutation(() => String)
	async deleteUserAccount(
		@Arg("userId") userId: number,
		@Ctx() context: Context
	): Promise<string> {
		// Rate limiting for admin account deletion
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "admin-account-deletion")

		try {
			return await deleteUserAccount(userId)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}

			console.error("Admin account deletion error:", error)
			throw new AppError(
				"Erreur lors de la suppression du compte",
				500,
				"InternalError"
			)
		}
	}

	/**
	 * Admin-only query to export any user's data
	 * @param userId - ID of user whose data to export
	 * @param context - GraphQL context
	 * @returns Promise<string> - JSON string of user data export
	 */
	@Authorized(Roles.Admin)
	@Query(() => String)
	async exportUserData(
		@Arg("userId") userId: number,
		@Ctx() context: Context
	): Promise<string> {
		// Rate limiting for admin data export
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "admin-data-export")

		try {
			const dataExport = await exportUserData(userId)
			return JSON.stringify(dataExport, null, 2)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}

			console.error("Admin data export error:", error)
			throw new AppError(
				"Erreur lors de l'export des données",
				500,
				"InternalError"
			)
		}
	}
}

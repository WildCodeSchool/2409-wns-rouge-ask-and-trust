import { Arg, Ctx, Mutation, Query, Resolver, Authorized } from "type-graphql"
import { LogInResponse, User } from "../../database/entities/user"
import { CreateUserInput } from "../../graphql/inputs/create/create-auth-input"
import { AppError } from "../../middlewares/error-handler"
import {
	login,
	register,
	whoami,
	changePassword,
	deleteAccount,
} from "../../services/auth-service"
import { Context, Roles } from "../../types/types"
import { LogUserInput } from "./../inputs/create/create-auth-input"
import { UpdatePasswordInput } from "../inputs/update/update-password-input"
import { DeleteAccountInput } from "../inputs/delete/delete-account-input"
import {
	checkRateLimit,
	authRateLimiter,
} from "../../middlewares/apollo-rate-limiter"

/**
 * AuthResolver handles all authentication-related GraphQL mutations and queries.
 */

@Resolver(User)
export class AuthResolver {
	/**
	 * Mutation for user registration.
	 *
	 * @param data - The input data containing the user's email, password, firstname, lastname, and role.
	 * @param context - The context object that contains cookies for session management.
	 *
	 * @returns A Promise that resolves to the newly created User object.
	 *
	 * @throws AppError If the email is already in use or if there is any other error during registration.
	 */
	@Mutation(() => User)
	async register(
		@Arg("data") data: CreateUserInput, // Input object containing email and password
		@Ctx() context: Context
	): Promise<User> {
		// Rate limiting for the registration
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "register")

		try {
			// NB : for now, data is checked automatically in buildSchema() in server.ts
			// with the option "validate:true"

			const { email, password, firstname, lastname } = data
			const results = await register(
				email,
				password,
				firstname,
				lastname,
				Roles.User // Always create a user with the role "user"
			) // Call register method from AuthService

			return results
		} catch (error) {
			// If email already used
			if (
				error instanceof AppError &&
				error.errorType === "EmailAlreadyUsedError"
			) {
				throw new AppError(
					error.message,
					error.statusCode,
					error.errorType
				)
			}

			// Others errors
			console.error("Registration error:", error)
			throw new AppError("Registration failed", 400, "InternalError")
		}
	}

	/**
	 * Mutation for user login.
	 *
	 * @param data - The input data containing the user's email and password.
	 * @param context - The context object that contains cookies for session management.
	 *
	 * @returns A Promise that resolves to a LogInResponse object containing a message and cookie status.
	 *
	 * @throws AppError If there is any error during the login process, such as invalid credentials.
	 */
	@Mutation(() => LogInResponse)
	async login(
		@Arg("data") data: LogUserInput, // Input object containing email and password
		@Ctx() context: Context // Context object containing cookies
	): Promise<LogInResponse> {
		// Rate limiting for the login
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "login")

		try {
			const { email, password } = data

			// Get the cookies from the context
			const { cookies } = context

			// Check if the cookies are available
			if (!cookies) {
				throw new AppError(
					"Cookies context not available",
					500,
					"InternalServerError"
				)
			}

			const loginResponse = await login(email, password, cookies)
			return {
				message: loginResponse.message,
				cookieSet: loginResponse.cookieSet,
			}
		} catch (err) {
			console.error("Login error:", err)
			throw new AppError("Login failed", 401, "UnauthorizedError") // Handle login errors
		}
	}

	/**
	 * Mutation for logging out the user by clearing the authentication token cookie.
	 *
	 * @param context - The context object that contains cookies for session management.
	 *
	 * @returns A string message confirming successful logout.
	 */
	@Authorized()
	@Mutation(() => String)
	async logout(@Ctx() context: Context): Promise<string> {
		const { cookies } = context

		// Remove the token cookie
		cookies.set("token", "", { maxAge: -1 })

		return "Logged out successfully"
	}

	/**
	 * Query to get the currently authenticated user.
	 *
	 * @param context - The context object that contains cookies for session management.
	 *
	 * @returns A Promise that resolves to the current User object.
	 *
	 * @throws AppError If no user is found or if there is any error in the process.
	 */
	@Authorized()
	@Query(() => User)
	async whoami(@Ctx() context: Context): Promise<User> {
		const { cookies } = context

		const user = await whoami(cookies)

		if (!user) throw new AppError("User not found", 404, "NotFoundError")

		return user
	}

	/**
	 * Query to get all users in the system.
	 *
	 * @returns A Promise that resolves to an array of User objects, or a string indicating an error.
	 */
	@Query(() => [User])
	@Authorized(Roles.Admin)
	async getUsers(): Promise<User[] | string> {
		const users = await User.find()
		if (users) {
			return users
		} else {
			return "Error to get users"
		}
	}

	/**
	 * Mutation for changing user password
	 * @param data - Input containing current and new passwords
	 * @param context - Context object for authentication and rate limiting
	 * @returns Promise<string> - Success message
	 */
	@Authorized()
	@Mutation(() => String)
	async changePassword(
		@Arg("data") data: UpdatePasswordInput,
		@Ctx() context: Context
	): Promise<string> {
		// Rate limiting for password changes
		const clientIP =
			context.req?.ip || context.req?.socket?.remoteAddress || "unknown"
		checkRateLimit(authRateLimiter, clientIP, "password-change")

		if (!context.user) {
			throw new AppError("Non authentifié", 401, "UnauthorizedError")
		}

		try {
			const { currentPassword, newPassword } = data
			return await changePassword(
				context.user.id,
				currentPassword,
				newPassword
			)
		} catch (err) {
			if (err instanceof AppError) {
				throw err
			}

			throw new AppError("Error updating password", 500, "InternalError")
		}
	}

	/**
	 * Mutation for deleting user account (RGPD Right to be Forgotten)
	 * @param data - Input containing password and confirmation text
	 * @param context - Context object for authentication, rate limiting, and session management
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

		if (!context.user) {
			throw new AppError("Non authentifié", 401, "UnauthorizedError")
		}

		try {
			const { password, confirmationText } = data
			const result = await deleteAccount(
				context.user.id,
				password,
				confirmationText
			)

			// Clear authentication cookie after successful deletion
			const { cookies } = context
			cookies.set("token", "", { maxAge: -1 })

			return result
		} catch (err) {
			// Re-throw AppError with original message
			if (err instanceof AppError) {
				throw err
			}

			throw new AppError("Error deleting account", 500, "InternalError")
		}
	}
}

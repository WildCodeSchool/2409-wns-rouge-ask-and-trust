import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { LogInResponse, User } from "../../database/entities/user"
import { CreateUserInput } from "../../graphql/inputs/create/create-auth-input"
import { AppError } from "../../middlewares/error-handler"
import { login, register, whoami } from "../../services/auth-service"
import { Context } from "../../types/types"
import { LogUserInput } from "./../inputs/create/create-auth-input"

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
		@Ctx() context: Context // Context object containing cookies
	): Promise<User> {
		try {
			// NB : for now, data is checked automatically in buildSchema() in server.ts
			// with the option "validate:true"

			const { email, password, firstname, role, lastname } = data

			// Get the cookies from the context
			const { cookies } = context

			return await register(
				email,
				password,
				firstname,
				lastname,
				role,
				cookies
			) // Call register method from AuthService
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

			return await login(email, password, cookies)
		} catch (error) {
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
	// @TODO : later authorize only admin to get users
	// @Authorized()
	async getUsers(): Promise<User[] | string> {
		const users = await User.find()
		if (users) {
			return users
		} else {
			return "Error to get users"
		}
	}
}

import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql"
import { register, login, whoami } from "../../services/auth-service"
import { CreateUserInput } from "../../graphql/inputs/create/create-auth-input"
import { User } from "../../database/entities/user"
import { AppError } from "../../middlewares/error-handler"
import { Context } from "../../types/types"

// Define the AuthResolver class for handling authentication-related GraphQL mutations
@Resolver(User)
export class AuthResolver {
	// Mutation for user registration
	@Mutation(() => User)
	async register(
		@Arg("data") data: CreateUserInput, // Input object containing email and password
		@Ctx() context: Context // Context object containing cookies
	): Promise<User> {
		try {
			const { email, password } = data

			// Get the cookies from the context
			const { cookies } = context

			return await register(email, password, cookies) // Call register method from AuthService
		} catch (error) {
			throw new AppError("Registration failed", 400, "ValidationError") // Handle registration errors
		}
	}

	// Mutation for user login
	@Mutation(() => String)
	async login(
		@Arg("data") data: CreateUserInput, // Input object containing email and password
		@Ctx() context: Context // Context object containing cookies
	): Promise<string> {
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

			return await login(email, password, cookies) // Call login method from AuthService
		} catch (error) {
			throw new AppError("Login failed", 401, "UnauthorizedError") // Handle login errors
		}
	}

	// Mutation for user logout
	@Mutation(() => String)
	async logout(@Ctx() context: Context): Promise<string> {
		const { cookies } = context

		// Remove the token cookie
		cookies.set("token", "", { maxAge: -1 })

		return "Logged out successfully"
	}

	@Query(() => User)
	async whoami(@Ctx() context: Context): Promise<User> {
		const { cookies } = context

		const user = await whoami(cookies)

		if (!user) throw new AppError("User not found", 404, "NotFoundError")

		return user
	}
}

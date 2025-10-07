import * as argon2 from "argon2"
import Cookies from "cookies"
import jwt from "jsonwebtoken"
import dataSource from "../database/config/datasource"
import { LogInResponse, User } from "../database/entities/user"
import { AppError } from "../middlewares/error-handler"
import { UserRole } from "../types/types"

export const register = async (
	email: string,
	password: string,
	firstname: string,
	lastname: string,
	role: UserRole
): Promise<User> => {
	const userRepository = dataSource.getRepository(User)

	// Check if a user already exists with this email
	const existingUser = await userRepository.findOne({ where: { email } })

	if (existingUser) {
		// Throw an error if the email is already in use
		throw new AppError("Email already exists", 400, "EmailAlreadyUsedError")
	}

	// Hash the password before saving it
	const hashedPassword = await argon2.hash(password)

	// Create a new instance of user and save it in the database
	try {
		const user = userRepository.create({
			email,
			hashedPassword,
			firstname,
			lastname,
			role,
		})

		await userRepository.save(user)

		return user
	} catch (error) {
		throw new AppError(
			"Failed to create user",
			500,
			"DatabaseError",
			error instanceof Error ? error.message : undefined
		)
	}
}

// Function to log in an existing user
export const login = async (
	email: string,
	password: string,
	cookies: Cookies
): Promise<LogInResponse> => {
	const userRepository = dataSource.getRepository(User)

	// Find the user by email
	const user = await userRepository.findOne({ where: { email } })

	// Check if the user exists and if the password is correct
	if (!user) {
		throw new AppError("Invalid identifiers", 401, "UnauthorizedError")
	}

	try {
		// Check if the password is correct
		const isPasswordValid = await argon2.verify(
			user.hashedPassword,
			password
		)

		if (!isPasswordValid) {
			throw new AppError("Invalid identifiers", 401, "UnauthorizedError")
		}

		// Ensure that the JWT secret is defined
		if (!process.env.JWT_SECRET) {
			throw new AppError(
				"JWT_SECRET is not defined in environment variables.",
				500,
				"InternalServerError"
			)
		}

		// Generate a JWT token for the user
		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
			expiresIn: "1d", // Temps d'expiration du token
		})

		// Set the token as a cookie in the response
		cookies.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			signed: true,
		})

		// Return a success message
		return {
			message: "Sign in successful!",
			cookieSet: true,
		}
	} catch (error) {
		// If it's already an AppError, re-throw it
		if (error instanceof AppError) {
			throw error
		}

		// Log the actual error for debugging
		console.error("Login error details:", error)

		// For other errors, provide a more specific message
		throw new AppError(
			"Failed to log in the user.",
			500,
			"InternalServerError",
			error instanceof Error ? error.message : undefined
		)
	}
}

// Function to retrieve the currently logged-in user
export const whoami = async (cookies: Cookies): Promise<User | null> => {
	const token = cookies.get("token", { signed: true })

	if (!token) {
		throw new AppError("No token provided", 401, "UnauthorizedError")
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
			id: number
		}

		// Find the user by id
		const userRepository = dataSource.getRepository(User)
		const user = await userRepository.findOne({ where: { id: payload.id } })

		// Return null if the user is not found instead of throwing an error
		if (!user) {
			return null // Utilisateur non trouvé, retourner null
		}

		return user
	} catch {
		throw new AppError("Invalid token", 401, "UnauthorizedError")
	}
}

/**
 * Changes user password after verifying current password
 * @param userId - ID of the user
 * @param currentPassword - Current password to verify
 * @param newPassword - New password to set
 * @returns Promise<string> - Success message
 */
export const changePassword = async (
	userId: number,
	currentPassword: string,
	newPassword: string
): Promise<string> => {
	const userRepository = dataSource.getRepository(User)

	// Find the user
	const user = await userRepository.findOne({ where: { id: userId } })

	if (!user) {
		throw new AppError("User not found", 404, "UserNotFoundError")
	}

	try {
		// Verify current password
		const isCurrentPasswordValid = await argon2.verify(
			user.hashedPassword,
			currentPassword
		)

		if (!isCurrentPasswordValid) {
			throw new AppError(
				"Current password is incorrect",
				401,
				"InvalidCurrentPasswordError"
			)
		}

		// Hash new password
		const hashedNewPassword = await argon2.hash(newPassword)

		// Update password
		user.hashedPassword = hashedNewPassword
		await userRepository.save(user)

		return "Password updated successfully"
	} catch (error) {
		if (error instanceof AppError) {
			throw error
		}

		throw new AppError(
			"Error updating password",
			500,
			"InternalServerError",
			error instanceof Error ? error.message : undefined
		)
	}
}

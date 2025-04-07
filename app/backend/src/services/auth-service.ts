import { User } from "../database/entities/user"
import dataSource from "../database/config/datasource"
import * as argon2 from "argon2"
import jwt from "jsonwebtoken"
import { AppError } from "../middlewares/error-handler"
import Cookies from "cookies"

export const register = async (
	email: string,
	password: string,
	cookies: Cookies
): Promise<User> => {
	const userRepository = dataSource.getRepository(User)

	// Check to ensure no existing token is present
	if (cookies.get("token")) {
		throw new AppError(
			"A user is already logged in with an active token.",
			400,
			"TokenExistsError"
		)
	}

	// Check if a user already exists with this email
	const existingUser = await userRepository.findOne({ where: { email } })
	if (existingUser) {
		// Throw an error if the email is already in use
		throw new AppError("Email already exists", 400, "ValidationError")
	}

	// Hash the password before saving it
	const hashedPassword = await argon2.hash(password)

	const user = new User()
	user.email = email // Définir l'email de l'utilisateur
	user.password = hashedPassword // Définir le mot de passe haché de l'utilisateur

	// Save the new user in the database
	return await userRepository.save(user)
}

// Function to log in an existing user
export const login = async (
	email: string,
	password: string,
	cookies: Cookies
): Promise<string> => {
	const userRepository = dataSource.getRepository(User)
	// Find the user by email
	const user = await userRepository.findOne({ where: { email } })

	// Check if the user exists and if the password is correct
	if (!user || !(await argon2.verify(user.password, password))) {
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

	// Return the generated token
	return token
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
	} catch (error) {
		throw new AppError("Invalid token", 401, "UnauthorizedError")
	}
}

import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import Cookies from "cookies"
import dotenv from "dotenv"
import { GraphQLFormattedError } from "graphql"
import { buildSchema } from "type-graphql"
import dataSource from "./database/config/datasource"
import { AuthResolver } from "./graphql/resolvers/auth-resolver"
import { PaymentResolver } from "./graphql/resolvers/payment-resolver"
import { customAuthChecker } from "./middlewares/auth-checker"
import { AppError } from "./middlewares/error-handler"
import { TimeoutMiddleware } from "./middlewares/timeout-middleware"
import { createAdmin } from "./scripts/create-admin"
import { SurveysResolver } from "./graphql/resolvers/survey/survey-resolver"
import { AnswersResolver } from "./graphql/resolvers/survey/answers-resolver"
import { CategoryResolver } from "./graphql/resolvers/survey/category-resolver"
import { QuestionsResolver } from "./graphql/resolvers/survey/questions-resolver"
import { SurveyResponsesResolver } from "./graphql/resolvers/survey/survey-responses-resolver"

dotenv.config() // Load environment variables from .env file

// Check that COOKIE_SECRET is defined
if (!process.env.COOKIE_SECRET) {
	throw new Error("COOKIE_SECRET is not defined in environment variables.")
}

// Check that APP_PORT is defined
if (!process.env.APP_PORT) {
	throw new Error("APP_PORT is not defined in environment variables.")
}

// protection contre l'ASI (Automatic Semicolon Insertion) en JavaScript/TypeScript. <;(>
;(async () => {
	try {
		// Initialize the data source (e.g., connect to a database)
		await dataSource.initialize()

		// Create Admin user if doesn't exist
		await createAdmin()

		// Constructing the GraphQL schema with TypeGraphQL
		// Replace the resolvers array with your actual resolvers
		const schema = await buildSchema({
			resolvers: [
				AuthResolver,
				PaymentResolver,
				SurveysResolver,
				AnswersResolver,
				CategoryResolver,
				QuestionsResolver,
				SurveyResponsesResolver,
				/* your resolvers here */
			],
			validate: true, // Activate validation for input fields
			authChecker: customAuthChecker,
			emitSchemaFile: true, // Optional , for debugging
		})

		// Create the instance of the timeout middleware with advanced features
		const timeoutMiddleware = new TimeoutMiddleware({
			timeoutMs: 30000, // 30 seconds default
			message: "Request timeout - operation took too long to complete",
			enableMetrics: true,
			enableDebugLogging: process.env.NODE_ENV === "development",
			operationTimeouts: {
				// Specific timeouts per operation type
				upload: 120000, // 2 minutes for uploads
				search: 10000, // 10 seconds for searches
				report: 60000, // 1 minute for reports
				export: 90000, // 1.5 minutes for exports
				import: 180000, // 3 minutes for imports
				survey: 45000, // 45 seconds for survey operations
				response: 20000, // 20 seconds for responses
				payment: 60000, // 1 minute for payments
			},
		})

		//Create instance of ApolloServer with the schema
		const server = new ApolloServer({
			schema,
			plugins: [timeoutMiddleware.createApolloPlugin()],
			formatError: (
				formattedError: GraphQLFormattedError,
				error: unknown
			): GraphQLFormattedError => {
				// Check if the error is an instance of AppError
				if (error instanceof AppError) {
					// Customize the format
					return {
						message: error.message,
						extensions: {
							code: error.errorType || "INTERNAL_SERVER_ERROR",
							statusCode: error.statusCode,
							additionalInfo: error.additionalInfo,
						},
					}
				}

				// Manage validation errors (class-validator)
				if (Array.isArray((error as any).validationErrors)) {
					return {
						message: "Erreur de validation",
						extensions: {
							code: "BAD_USER_INPUT",
							validationErrors: (error as any).validationErrors,
						},
					}
				}

				// For other errors, you can handle them differently
				return formattedError
			},
		})

		// Start the server
		const { url } = await startStandaloneServer(server, {
			listen: { port: Number(process.env.APP_PORT) || 4000 },
			context: async ({ req, res }) => {
				// Properties to the context here, like the authenticated user
				const cookies = new Cookies(req, res, {
					keys: [process.env.COOKIE_SECRET || "default-secret"],
				})

				return { cookies }
			},
		})

		console.log(
			`🚀  Server ready at: ${url} \n 🚀 Backend : http://localhost:8080/api/v1/ \n 🚀 Frontend : http://localhost:8080`
		)
	} catch (error) {
		console.error("🚨 Error during initialization:", error)
	}
})()

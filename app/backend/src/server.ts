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
import { createAdmin } from "./scripts/create-admin"
import { SurveysResolver } from "./graphql/resolvers/survey-resolver"
import { SurveyAnswersResolver } from "./graphql/resolvers/surveyAnswers-resolver"
import { SurveyCategoryResolver } from "./graphql/resolvers/surveyCategory-resolver"
import { SurveyQuestionsResolver } from "./graphql/resolvers/surveyQuestions-resolver"
import { SurveyQuestionsAnsweredResolver } from "./graphql/resolvers/surveyQuestionsAnswered-resolver"

dotenv.config() // Load environment variables from .env file

// Check that COOKIE_SECRET is defined
if (!process.env.COOKIE_SECRET) {
	throw new Error("COOKIE_SECRET is not defined in environment variables.")
}

// Check that APP_PORT is defined
if (!process.env.APP_PORT) {
	throw new Error("APP_PORT is not defined in environment variables.")
}

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
				SurveyAnswersResolver,
				SurveyCategoryResolver,
				SurveyQuestionsResolver,
				SurveyQuestionsAnsweredResolver,
				/* your resolvers here */
			],
			validate: true, // Activate validation for input fields
			authChecker: customAuthChecker,
			emitSchemaFile: true, // Optional , for debugging
		})

		//Create instance of ApolloServer with the schema
		const server = new ApolloServer({
			schema,
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

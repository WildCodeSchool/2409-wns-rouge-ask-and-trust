import { ApolloServer, BaseContext } from "@apollo/server"
import { DataSource } from "typeorm"
import { buildSchema } from "type-graphql"
import { AuthResolver } from "../graphql/resolvers/auth-resolver"
import { customAuthChecker } from "../middlewares/auth-checker"
import { UsersResolverTest } from "./resolvers/UserResolverTest"
import { SurveysResolver } from "../graphql/resolvers/survey/survey-resolver"
import { AnswersResolver } from "../graphql/resolvers/survey/answers-resolver"
import { CategoryResolver } from "../graphql/resolvers/survey/category-resolver"
import { QuestionsResolver } from "../graphql/resolvers/survey/questions-resolver"
import { SurveyResponsesResolver } from "../graphql/resolvers/survey/survey-responses-resolver"
import dataSource from "../database/config/datasource"
import { SurveyResolverTest } from "./resolvers/SurveyResolverTest"
import { createAdmin } from "../scripts/create-admin"
import { User } from "../database/entities/user"
import Cookies from "cookies"
import { CustomAuthTest } from "./resolvers/CustomAuthTest"

/**
 * index.spec.ts
 *
 * Main integration test suite for the backend GraphQL API.
 *
 * Purpose:
 *  - Initialize the test database and clean existing data before tests.
 *  - Create a default admin user for testing.
 *  - Build GraphQL schema with all resolvers and custom authentication checker.
 *  - Run integration tests for users, surveys, and custom authentication logic.
 *
 * Methodology:
 *  - Uses ApolloServer's `executeOperation` to test GraphQL queries and mutations.
 *  - Uses Jest for mocking, assertions, and lifecycle management (`beforeAll`, `afterAll`, `beforeEach`).
 *  - Provides a reusable `testArgs` object containing the server, database, and created users.
 *
 * Steps:
 *  1. Initialize test database connection.
 *  2. Clean all tables to start with a fresh state.
 *  3. Create an admin user in the database for testing.
 *  4. Build GraphQL schema with resolvers and `customAuthChecker`.
 *  5. Instantiate ApolloServer with the schema.
 *  6. Run integration tests for:
 *     - Users resolver (registration, login, validation)
 *     - Custom authentication checker
 *     - Surveys resolver (create category, create survey, permissions)
 *  7. Destroy the database connection after all tests.
 */
export type TestArgsType = {
	server: ApolloServer<BaseContext>
	datasource: DataSource
	data: {
		admin?: User
		user?: User
	}
}

export const setMock = jest.fn()

jest.mock("cookies", () => {
	return jest.fn().mockImplementation(() => ({
		set: setMock,
		get: jest.fn(),
	}))
})

/**
 * Build GraphQL schema with all resolvers and authentication checker.
 */
async function getSchema() {
	const schema = await buildSchema({
		resolvers: [
			AuthResolver,
			SurveysResolver,
			AnswersResolver,
			CategoryResolver,
			QuestionsResolver,
			SurveyResponsesResolver,
			/* your resolvers here */
		],
		validate: true, // Activate validation for input fields
		authChecker: customAuthChecker,
		emitSchemaFile: false, // Optional , for debugging
	})

	return schema
}

/**
 * Assert helper function.
 * @param expr Expression to assert
 * @param msg Optional error message
 */
export function assert(expr: unknown, msg?: string): asserts expr {
	if (!expr) throw new Error(msg)
}

/**
 * Generate a fake context for testing GraphQL resolvers.
 * @returns Context object containing fake request, response, and cookies
 */
export function getTestContext() {
	const fakeReq = { headers: {} } as any
	const fakeRes = {} as any
	const cookies = new Cookies(fakeReq, fakeRes, { keys: ["test-secret"] })
	return { req: fakeReq, res: fakeRes, cookies }
}

const testArgs = {} as TestArgsType

beforeAll(async () => {
	// 1. Init test database
	await dataSource.initialize()
	try {
		// 2. Delete data in database before testing
		const entities = dataSource.entityMetadatas
		const tableNames = entities
			.map(entity => `"${entity.tableName}"`)
			.join(", ")
		await dataSource.query(`TRUNCATE ${tableNames} CASCADE;`)
	} catch (error) {
		throw new Error(`ERROR: Cleaning test database: ${error}`)
	}
	// 3. Create Admin for tests
	await createAdmin()

	// 4. Build GraphQL schema
	const schema = await getSchema()

	// 5. Create an Apollo Server's instance
	const testServer = new ApolloServer({
		schema,
	})

	// 6. Prepare shared test arguments
	testArgs.datasource = dataSource
	testArgs.server = testServer

	Object.assign(testArgs, {
		datasource: dataSource,
		server: testServer,
		data: {},
	})
})

/**
 * Basic environment validation.
 */
describe("Backend Setup", () => {
	test("should validate environment", () => {
		expect(process).toBeDefined()
		expect(typeof process.env).toBe("object")
	})
})

/**
 * Run Users resolver integration tests.
 */
describe("Users resolver", () => {
	UsersResolverTest(testArgs)
})

/**
 * Run custom authentication checker unit tests.
 */
describe("customAuthChecker", () => {
	CustomAuthTest()
})

/**
 * Run Surveys resolver integration tests.
 */
describe("Surveys resolver", () => {
	SurveyResolverTest(testArgs)
})

/**
 * Close database connection after all tests.
 */
afterAll(async () => {
	await dataSource.destroy()
})

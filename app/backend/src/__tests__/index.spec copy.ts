import { ApolloServer, BaseContext } from "@apollo/server"
import { DataSource } from "typeorm"
// import dataSource from "../database/config/datasource";
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
// import Cookies from "cookies"

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

export function assert(expr: unknown, msg?: string): asserts expr {
	if (!expr) throw new Error(msg)
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

	testArgs.datasource = dataSource
	testArgs.server = testServer

	Object.assign(testArgs, {
		datasource: dataSource,
		server: testServer,
		data: {},
	})
})

describe("Backend Setup", () => {
	test("should validate environment", () => {
		expect(process).toBeDefined()
		expect(typeof process.env).toBe("object")
	})
})
describe("Users resolver", () => {
	console.log("enter describe user")
	UsersResolverTest(testArgs)
})

describe("Surveys resolver", () => {
	console.log("enter describe survey")
	SurveyResolverTest(testArgs)
})

afterAll(async () => {
	await dataSource.destroy()
})

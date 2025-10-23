import { Category } from "../../database/entities/survey/category"
import { CREATE_CATEGORY, CREATE_SURVEY } from "../api/survey"
import { assert, getTestContext, TestArgsType } from "../setup.test"
import * as authService from "../../services/auth-service"
import { Survey } from "../../database/entities/survey/survey"

/**
 * SurveyResolverTest.ts
 *
 * Integration test suite for survey-related GraphQL resolvers.
 *
 * Purpose:
 *  - Ensure that only authorized users can create categories and surveys.
 *  - Validate access control for admins and authenticated users.
 *  - Verify that unauthenticated users are denied.
 *
 * Methodology:
 *  - Use Jest to mock `authService.whoami` for simulating logged-in users.
 *  - Each test restores mocks before execution to avoid side effects.
 *  - GraphQL operations are executed via `ApolloServer.executeOperation`.
 *
 * Scenarios tested:
 *  1. Admin creates a category → should succeed.
 *  2. Authenticated user (non-admin) creates a survey → should succeed.
 *  3. Unauthenticated user attempts to create a survey → should fail.
 *
 * @param testArgs - Shared test arguments including Apollo server, test database, and pre-created users.
 */
export function SurveyResolverTest(testArgs: TestArgsType) {
	beforeEach(() => {
		jest.restoreAllMocks()
	})

	it("should create a category (admin allowed)", async () => {
		assert(testArgs.data.admin, "Admin must exist before mocking whoami")

		// Simulate a connected admin
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.admin)

		const response = await testArgs.server.executeOperation<{
			createCategory: Category
		}>(
			{
				query: CREATE_CATEGORY,
				variables: { data: { name: "top" } },
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")

		const category = response.body.singleResult.data?.createCategory

		assert(category, "Category not returned")
		expect(category.name).toBe("top")
		expect(response.body.singleResult.errors).toBeUndefined()
	})

	it("should NOT create a category (user not allowed)", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate a connected admin
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<{
			createCategory: Category
		}>(
			{
				query: CREATE_CATEGORY,
				variables: { data: { name: "top" } },
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
		expect(response.body.singleResult.data).toBeNull()
	})

	it("should create survey (user allowed)", async () => {
		assert(testArgs.data.user, "User must exist before mocking whoami")

		// Simulate a connected user (not admin)
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.user)

		const response = await testArgs.server.executeOperation<Survey>(
			{
				query: CREATE_SURVEY,
				variables: {
					data: {
						title: "bademail",
						description: "SuperSecret!2025",
						public: true,
						category: 1,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()
	})

	it("should NOT create a survey if not authenticated", async () => {
		const response = await testArgs.server.executeOperation<Survey>(
			{
				query: CREATE_SURVEY,
				variables: {
					data: {
						title: "Unauthorized Survey",
						description: "Should fail",
						public: false,
						category: 1,
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
		expect(response.body.singleResult.data).toBeNull()
	})
}

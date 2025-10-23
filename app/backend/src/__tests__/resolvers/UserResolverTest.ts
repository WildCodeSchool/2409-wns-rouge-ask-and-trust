import { LogInResponse, User } from "../../database/entities/user"
import { Roles } from "../../types/types"
import { LOGIN, REGISTER } from "../api/createUser"
import { assert, getTestContext, TestArgsType } from "../setup.test"

/**
 * UsersResolverTest.ts
 *
 * Integration test suite for user-related GraphQL resolvers including registration,
 * login, and fetching the admin user.
 *
 * Purpose:
 *  - Ensure that user creation validates email, password, and name fields.
 *  - Verify that only valid users are created and stored securely in the database.
 *  - Test login functionality, including setting cookies and returning success messages.
 *
 * Methodology:
 *  - Execute GraphQL operations via `ApolloServer.executeOperation`.
 *  - Assert API responses and validate database entries.
 *  - Track created users for use in subsequent tests (admin and normal user).
 *
 * Scenarios tested:
 *  1. Verify that the pre-created admin exists in the database.
 *  2. Attempt to register users with invalid email, password, or firstname → should fail.
 *  3. Register a valid user → should succeed and persist in the database.
 *  4. Log in as the newly created user → should succeed with cookie set.
 *  5. Log in as admin → should succeed with cookie set.
 *
 * @param testArgs - Shared test arguments including Apollo server, test database, and pre-created users.
 */
export function UsersResolverTest(testArgs: TestArgsType) {
	it("should get an admin", async () => {
		const adminInDb = await User.findOne({
			where: { email: "admin@test.com" },
		})
		assert(adminInDb, "Admin not found in database")
		expect(adminInDb.email).toBe("admin@test.com")
		expect(adminInDb.firstname).toBe("Admin")
		expect(adminInDb.lastname).toBe("Test")
		expect(adminInDb.role).toBe(Roles.Admin)
		expect(adminInDb.hashedPassword).not.toBe("SuperSecret!2025")
		testArgs.data.admin = adminInDb
	})

	it("should NOT create a user with an invalid email", async () => {
		const response = await testArgs.server.executeOperation<{
			register: User
		}>({
			query: REGISTER,
			variables: {
				data: {
					email: "bademail",
					password: "SuperSecret!2025",
					firstname: "Test",
					lastname: "User",
				},
			},
		})

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
		expect(response.body.singleResult.data).toBeNull()
	})

	it("should NOT create a user with an invalid password", async () => {
		const response = await testArgs.server.executeOperation<{
			register: User
		}>({
			query: REGISTER,
			variables: {
				data: {
					email: "ok@email.com",
					password: "notgood",
					firstname: "Test",
					lastname: "User",
				},
			},
		})

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
		expect(response.body.singleResult.data).toBeNull()
	})

	it("should NOT create a user with an invalid firstname", async () => {
		const response = await testArgs.server.executeOperation<{
			register: User
		}>({
			query: REGISTER,
			variables: {
				data: {
					email: "ok@email.com",
					password: "SuperSecret!2025",
					firstname: "",
					lastname: "User",
				},
			},
		})

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeDefined()
		expect(response.body.singleResult.data).toBeNull()
	})

	it("should create an user", async () => {
		const response = await testArgs.server.executeOperation<{
			register: User
		}>({
			query: REGISTER,
			variables: {
				data: {
					email: "test@email.fr",
					password: "SuperSecret!2025",
					firstname: "Toto",
					lastname: "Toto",
				},
			},
		})

		// check API response
		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()
		const userId = response.body.singleResult.data?.register.id
		expect(userId).toBeDefined()

		// check user in database
		const userFromDb = await User.findOneBy({
			id: userId,
		})

		expect(userFromDb).toBeDefined()
		assert(userFromDb, "User not found in DB")
		expect(userFromDb.email).toBe("test@email.fr")
		expect(userFromDb.hashedPassword).not.toBe("SuperSecret!2025")
		testArgs.data.user = userFromDb
	})

	it("should sign me in", async () => {
		const response = await testArgs.server.executeOperation<{
			login: LogInResponse
		}>(
			{
				query: LOGIN,
				variables: {
					data: {
						email: "test@email.fr",
						password: "SuperSecret!2025",
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		// check API response
		assert(response.body.kind === "single")

		expect(response.body.singleResult.errors).toBeUndefined()

		const result = response.body.singleResult.data?.login
		expect(result).toBeDefined()
		expect(result?.message).toBe("Sign in successful!")
		expect(result?.cookieSet).toBe(true)
	})

	it("should sign admin in", async () => {
		const response = await testArgs.server.executeOperation<{
			login: LogInResponse
		}>(
			{
				query: LOGIN,
				variables: {
					data: {
						email: "admin@test.com",
						password: "SuperSecret!2025",
					},
				},
			},
			{ contextValue: getTestContext() }
		)

		// check API response
		assert(response.body.kind === "single")

		expect(response.body.singleResult.errors).toBeUndefined()
		// expect(response.body.singleResult.data?.signin?.id).toBeDefined()
		const result = response.body.singleResult.data?.login
		expect(result).toBeDefined()
		expect(result?.message).toBe("Sign in successful!")
		expect(result?.cookieSet).toBe(true)
	})
}

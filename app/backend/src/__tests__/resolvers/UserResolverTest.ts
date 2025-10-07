// import { User } from "../../src/entities/User";
// import { mutationCreateUser } from "../api/createUser";
// import { mutationSignin } from "../api/signin";
// import { queryWhoami } from "../api/whoiam";
import { LogInResponse, User } from "../../database/entities/user"
import { Roles } from "../../types/types"
import { LOGIN, REGISTER } from "../api/createUser"
import { assert, TestArgsType } from "../setup.test"
// import { setMock } from "../index.spec"

export function UsersResolverTest(testArgs: TestArgsType) {
	it("should get an admin", async () => {
		console.log("run it should get admin")

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

	it("should not create a user with an invalid email", async () => {
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

	it("should not create a user with an invalid password", async () => {
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

	it("should not create a user with an invalid firstname", async () => {
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

	// test signin resolver
	it("should sign me in", async () => {
		const response = await testArgs.server.executeOperation<{
			login: LogInResponse
		}>({
			query: LOGIN,
			variables: {
				data: {
					email: "test@email.fr",
					password: "SuperSecret!2025",
				},
			},
		})

		// check API response
		assert(response.body.kind === "single")

		expect(response.body.singleResult.errors).toBeUndefined()
		// expect(response.body.singleResult.data?.signin?.id).toBeDefined()
		const result = response.body.singleResult.data?.login
		expect(result).toBeDefined()
		expect(result?.message).toBe("Sign in successful!")
		expect(result?.cookieSet).toBe(true)
	})

	it("should sign admin in", async () => {
		const response = await testArgs.server.executeOperation<{
			login: LogInResponse
		}>({
			query: LOGIN,
			variables: {
				data: {
					email: "admin@test.com",
					password: "SuperSecret!2025",
				},
			},
		})

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

import { ApolloServer } from "@apollo/server"
import { DataSource } from "typeorm"
import { User } from "../../database/entities/user"
import { Roles } from "../../types/types"
import { getTestContext, TestArgsType } from "../setup.test"
import { Survey } from "../../database/entities/survey/survey"
import { Category } from "../../database/entities/survey/category"
import * as authService from "../../services/auth-service"

/**
 * MySurveys Query Integration Tests
 *
 * Tests the mySurveys query resolver for:
 * - Authentication requirements
 * - User-specific survey filtering
 * - Search functionality
 * - Status filtering
 * - Pagination and sorting
 */

const MY_SURVEYS = `
  query MySurveys($filters: MySurveysQueryInput) {
    mySurveys(filters: $filters) {
      surveys { id title status createdAt updatedAt }
      totalCount
      totalCountAll
      page
      limit
    }
  }
`

type MySurveysResponse = {
	mySurveys: {
		surveys: Array<{
			id: string
			title: string
			status: string
			createdAt: string
			updatedAt: string
		}>
		totalCount: number
		totalCountAll: number
		page: number
		limit: number
	}
}

export function MySurveysResolverTest(testArgs: TestArgsType) {
	let datasource: DataSource
	let server: ApolloServer
	let alice: User
	let bob: User
	let catHealth: Category
	let catHR: Category
	let catProduct: Category
	let catMkt: Category

	beforeEach(() => {
		jest.restoreAllMocks()
	})

	beforeAll(async () => {
		datasource = testArgs.datasource
		server = testArgs.server

		// Create test users
		const userRepo = datasource.getRepository(User)

		alice = await userRepo.save({
			email: "alice@test.com",
			hashedPassword: "hashed_password_alice",
			firstname: "Alice",
			lastname: "Dupont",
			role: Roles.User,
		})

		bob = await userRepo.save({
			email: "bob@test.com",
			hashedPassword: "hashed_password_bob",
			firstname: "Bob",
			lastname: "Martin",
			role: Roles.User,
		})

		// Create test categories
		const categoryRepo = datasource.getRepository(Category)

		catHealth = await categoryRepo.save({
			name: "Santé",
			createdBy: alice,
		})

		catHR = await categoryRepo.save({
			name: "RH",
			createdBy: alice,
		})

		catProduct = await categoryRepo.save({
			name: "Produit",
			createdBy: alice,
		})

		catMkt = await categoryRepo.save({
			name: "Marketing",
			createdBy: bob,
		})

		// Create test surveys for Alice
		const surveyRepo = datasource.getRepository(Survey)

		await surveyRepo.save([
			{
				user: alice,
				category: catHealth,
				title: "Quiz Santé 2024",
				status: "published",
				description: "Un quiz pour évaluer vos connaissances en santé.",
				public: true,
				createdAt: new Date("2024-10-01"),
				updatedAt: new Date("2024-12-01"),
			},
			{
				user: alice,
				category: catHR,
				title: "sondage RH interne",
				status: "draft",
				description: "Sondage pour recueillir les avis des employés.",
				public: true,
				createdAt: new Date("2024-11-10"),
				updatedAt: new Date("2024-11-20"),
			},
			{
				user: alice,
				category: catProduct,
				title: "Poll Produit Beta",
				status: "archived",
				description:
					"Sondage pour les utilisateurs de la version bêta du produit.",
				public: true,
				createdAt: new Date("2025-01-15"),
				updatedAt: new Date("2025-02-01"),
			},
		])

		// Create test survey for Bob
		await surveyRepo.save({
			user: bob,
			category: catMkt,
			title: "Quiz Marketing",
			status: "censored",
			description: "Quiz pour tester les connaissances en marketing.",
			public: false,
			createdAt: new Date("2024-09-09"),
			updatedAt: new Date("2024-09-10"),
		})
	})

	afterAll(async () => {
		// Clean up test data in correct order (respect foreign keys)
		const surveyRepo = datasource.getRepository(Survey)
		const categoryRepo = datasource.getRepository(Category)
		const userRepo = datasource.getRepository(User)

		// Delete surveys first
		await surveyRepo.delete({ user: { id: alice.id } })
		await surveyRepo.delete({ user: { id: bob.id } })

		// Then delete categories
		await categoryRepo.delete({ createdBy: { id: alice.id } })
		await categoryRepo.delete({ createdBy: { id: bob.id } })

		// Finally delete users
		await userRepo.delete([alice.id, bob.id])
	})

	it("should deny access when user is unauthenticated (401)", async () => {
		const context = getTestContext()

		const response = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: { filters: {} },
			},
			{ contextValue: context }
		)

		expect(response.body.kind).toBe("single")
		if (response.body.kind === "single") {
			expect(response.body.singleResult.errors?.[0].message).toBe(
				"Access denied! You don't have permission for this action!"
			)
		}
	})

	it("should return totalCountAll equal to user's total surveys", async () => {
		jest.spyOn(authService, "whoami").mockResolvedValue(alice)

		const context = getTestContext()

		const response = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: { filters: {} },
			},
			{ contextValue: context }
		)

		expect(response.body.kind).toBe("single")
		if (response.body.kind === "single") {
			expect(response.body.singleResult.errors).toBeUndefined()
			const data = response.body.singleResult.data as MySurveysResponse
			expect(data.mySurveys.totalCountAll).toBe(3)
		}
	})

	it("should search surveys by title (case-insensitive)", async () => {
		jest.spyOn(authService, "whoami").mockResolvedValue(alice)

		const context = getTestContext()

		const response = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: { filters: { search: "quiz" } },
			},
			{ contextValue: context }
		)

		expect(response.body.kind).toBe("single")
		if (response.body.kind === "single") {
			expect(response.body.singleResult.errors).toBeUndefined()

			const data = response.body.singleResult.data as MySurveysResponse
			const titles = data.mySurveys.surveys.map(s =>
				s.title.toLowerCase()
			)
			expect(titles).toEqual(expect.arrayContaining(["quiz santé 2024"]))
		}
	})

	it("should filter surveys by status", async () => {
		jest.spyOn(authService, "whoami").mockResolvedValue(alice)

		const context = getTestContext()

		const response = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: { filters: { status: ["draft"] } },
			},
			{ contextValue: context }
		)

		expect(response.body.kind).toBe("single")
		if (response.body.kind === "single") {
			expect(response.body.singleResult.errors).toBeUndefined()
			const data = response.body.singleResult.data as MySurveysResponse
			expect(data.mySurveys.totalCount).toBe(1)
			expect(data.mySurveys.surveys[0].status).toBe("draft")
		}
	})

	it("should correctly sort and paginate surveys", async () => {
		jest.spyOn(authService, "whoami").mockResolvedValue(alice)

		const context = getTestContext()

		const p1 = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: {
					filters: {
						sortBy: "createdAt",
						order: "ASC",
						page: 1,
						limit: 1,
					},
				},
			},
			{ contextValue: context }
		)

		const p2 = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: {
					filters: {
						sortBy: "createdAt",
						order: "ASC",
						page: 2,
						limit: 1,
					},
				},
			},
			{ contextValue: context }
		)

		expect(p1.body.kind).toBe("single")
		expect(p2.body.kind).toBe("single")

		if (p1.body.kind === "single" && p2.body.kind === "single") {
			expect(p1.body.singleResult.errors).toBeUndefined()
			expect(p2.body.singleResult.errors).toBeUndefined()

			const data1 = p1.body.singleResult.data as MySurveysResponse
			const data2 = p2.body.singleResult.data as MySurveysResponse

			const id1 = data1.mySurveys.surveys[0].id
			const id2 = data2.mySurveys.surveys[0].id
			expect(id1).not.toBe(id2)
		}
	})

	it("should only return surveys belonging to Bob", async () => {
		jest.spyOn(authService, "whoami").mockResolvedValue(bob)

		const context = getTestContext()

		const response = await server.executeOperation(
			{
				query: MY_SURVEYS,
				variables: { filters: {} },
			},
			{ contextValue: context }
		)

		expect(response.body.kind).toBe("single")
		if (response.body.kind === "single") {
			expect(response.body.singleResult.errors).toBeUndefined()
			const data = response.body.singleResult.data as MySurveysResponse
			expect(data.mySurveys.totalCountAll).toBe(1)

			const titles = data.mySurveys.surveys.map(s => s.title)
			expect(titles).toEqual(["Quiz Marketing"])
		}
	})
}

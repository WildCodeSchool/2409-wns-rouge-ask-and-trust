import { DataSource } from "typeorm"
import {
	startTestServer,
	stopTestServer,
	testClientForUser,
} from "./utils/server"
import { seed } from "./utils/seed"
import { Roles } from "../../types/types"

let ds: DataSource
let query: (q: string, opts?: any) => Promise<any>
let alice: any
let bob: any

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

describe("MySurveys query", () => {
	beforeAll(async () => {
		const { ds: dataSource } = await startTestServer()
		ds = dataSource
		const seeded = await seed(ds)
		alice = seeded.alice
		bob = seeded.bob

		const clientAlice = await testClientForUser({
			id: alice.id,
			role: Roles.User,
			email: alice.email,
		})
		query = clientAlice.query
	}, 60000)

	afterAll(async () => {
		await stopTestServer()
	})

	test("should deny access when user is unauthenticated (401)", async () => {
		const unauth = (await testClientForUser(undefined)).query
		const res = await unauth(MY_SURVEYS, { variables: { filters: {} } })
		expect(res.errors?.[0].message).toBe(
			"Access denied! You don't have permission for this action!"
		)
	})

	test("should return totalCountAll equal to user's total surveys", async () => {
		const res = await query(MY_SURVEYS, { variables: { filters: {} } })
		expect(res.errors).toBeUndefined()
		expect(res.data.mySurveys.totalCountAll).toBe(3)
	})

	test("should search surveys by title (case-insensitive)", async () => {
		const res = await query(MY_SURVEYS, {
			variables: { filters: { search: "quiz" } },
		})
		expect(res.errors).toBeUndefined()

		const titles = res.data.mySurveys.surveys.map((s: any) =>
			s.title.toLowerCase()
		)
		expect(titles).toEqual(expect.arrayContaining(["quiz santé 2024"]))
	})

	test("should filter surveys by status", async () => {
		const res = await query(MY_SURVEYS, {
			variables: { filters: { status: ["draft"] } },
		})

		expect(res.errors).toBeUndefined()
		expect(res.data.mySurveys.totalCount).toBe(1)
		expect(res.data.mySurveys.surveys[0].status).toBe("draft")
	})

	test("should correctly sort and paginate surveys", async () => {
		const p1 = await query(MY_SURVEYS, {
			variables: {
				filters: {
					sortBy: "createdAt",
					order: "ASC",
					page: 1,
					limit: 1,
				},
			},
		})

		const p2 = await query(MY_SURVEYS, {
			variables: {
				filters: {
					sortBy: "createdAt",
					order: "ASC",
					page: 2,
					limit: 1,
				},
			},
		})

		expect(p1.errors).toBeUndefined()
		expect(p2.errors).toBeUndefined()
		const id1 = p1.data.mySurveys.surveys[0].id
		const id2 = p2.data.mySurveys.surveys[0].id
		expect(id1).not.toBe(id2)
	})

	test("should only return surveys belonging to Bob", async () => {
		const clientBob = await testClientForUser({
			id: bob.id,
			role: Roles.User,
			email: bob.email,
		})

		const res = await clientBob.query(MY_SURVEYS, {
			variables: { filters: {} },
		})
		expect(res.errors).toBeUndefined()

		expect(res.data.mySurveys.totalCountAll).toBe(1)
		const titles = res.data.mySurveys.surveys.map((s: any) => s.title)
		expect(titles).toEqual(["Quiz Marketing"])
	})
})

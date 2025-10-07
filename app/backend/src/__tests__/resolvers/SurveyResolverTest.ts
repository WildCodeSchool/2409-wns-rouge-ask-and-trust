import Cookies from "cookies"
import { Category } from "../../database/entities/survey/category"
// import { Survey } from "../../database/entities/survey/survey"
import { CREATE_CATEGORY, CREATE_SURVEY } from "../api/survey"
import { assert, TestArgsType } from "../setup.test"
import * as authService from "../../services/auth-service"
import { Survey } from "../../database/entities/survey/survey"

// 1. Be able to sennd graphql queries / mutations
// 2. Mock the PostgreSQL database
// 3. (Mock external http calls)
// 4. Debug the test
// 5. Refacto to easily mock database
const fakeCookies = {
	get: jest.fn(() => "fake-token"),
	set: jest.fn(),
} as unknown as Cookies

export function SurveyResolverTest(testArgs: TestArgsType) {
	it("should create a category", async () => {
		// mock whoami
		assert(
			testArgs.data.admin,
			"Admin must be defined before mocking whoami"
		)
		jest.spyOn(authService, "whoami").mockResolvedValue(testArgs.data.admin)

		const response = await testArgs.server.executeOperation<{
			createCategory: Category
		}>(
			{
				query: CREATE_CATEGORY,
				variables: { data: { name: "top" } },
			},
			{ contextValue: { cookies: fakeCookies } }
		)

		// Vérifier que c’est bien un résultat “single”
		assert(response.body.kind === "single")

		const category = response.body.singleResult.data?.createCategory
		// console.log("category", category)
		assert(category, "Category not returned")
		expect(category.name).toBe("top")
		expect(category.id).toBeDefined()
		expect(response.body.singleResult.errors).toBeUndefined()
	})

	it("should create survey with a default question", async () => {
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
			{
				contextValue: { cookies: fakeCookies },
			}
		)

		console.log("response", response)

		assert(response.body.kind === "single")
		expect(response.body.singleResult.errors).toBeUndefined()
		// expect(response.body.singleResult.data).toBeNull()
	})
}

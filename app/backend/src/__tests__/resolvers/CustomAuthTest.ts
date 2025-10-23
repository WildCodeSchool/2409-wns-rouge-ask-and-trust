import * as authService from "../../services/auth-service"
import { customAuthChecker } from "../../middlewares/auth-checker"

/**
 * CustomAuthTest.ts
 *
 * Unit test suite for the `customAuthChecker` used in the GraphQL application
 * with TypeGraphQL.
 *
 * Purpose:
 *  - Ensure that the auth checker correctly returns `true` or `false`
 *    depending on whether the user is authenticated and has the required roles.
 *  - Simulate different login scenarios: admin, regular user, and unauthenticated user.
 *
 * Methodology:
 *  - Use Jest to mock the `whoami` function, which retrieves the user from cookies.
 *  - Each test restores mocks after execution to avoid side effects.
 *  - TypeScript requires casting `customAuthChecker` as callable since its original
 *    type is not directly callable in this context.
 *
 * Scenarios tested:
 *  1. Admin user with "Admin" role → should be allowed.
 *  2. Authenticated user with no specific role required → should be allowed.
 *  3. Unauthenticated user → should be denied.
 *  4. Authenticated user with a role that does not match the required role → should be denied.
 */
export function CustomAuthTest() {
	afterEach(() => {
		jest.restoreAllMocks()
	})

	it("should return true for admin user", async () => {
		const fakeAdmin = { id: 1, role: "Admin" } as any

		// Mock whoami to get an admin
		jest.spyOn(authService, "whoami").mockResolvedValue(fakeAdmin)

		// Cast for TypeScript to avoid "not callable" error
		const checker = customAuthChecker as (
			resolverData: { context: any },
			roles: string[]
		) => Promise<boolean>

		const allowed = await checker(
			{ context: { cookies: {}, user: undefined } },
			["Admin"]
		)

		expect(allowed).toBe(true)
	})

	it("should return true for authenticated user with no role restriction", async () => {
		const fakeUser = { id: 2, role: "User" } as any
		jest.spyOn(authService, "whoami").mockResolvedValue(fakeUser)

		const checker = customAuthChecker as (
			resolverData: { context: any },
			roles: string[]
		) => Promise<boolean>

		const allowed = await checker(
			{ context: { cookies: {}, user: undefined } },
			[]
		)

		expect(allowed).toBe(true)
	})

	it("should return false for unauthenticated", async () => {
		jest.spyOn(authService, "whoami").mockResolvedValue(null)

		const checker = customAuthChecker as (
			resolverData: { context: any },
			roles: string[]
		) => Promise<boolean>

		const allowed = await checker(
			{ context: { cookies: {}, user: undefined } },
			[]
		)

		expect(allowed).toBe(false)
	})

	it("should return false if role does not match", async () => {
		const fakeUser = { id: 3, role: "User" } as any
		jest.spyOn(authService, "whoami").mockResolvedValue(fakeUser)

		const checker = customAuthChecker as (
			resolverData: { context: any },
			roles: string[]
		) => Promise<boolean>

		const allowed = await checker(
			{ context: { cookies: {}, user: undefined } },
			["Admin"] // Different required role
		)

		expect(allowed).toBe(false)
	})
}

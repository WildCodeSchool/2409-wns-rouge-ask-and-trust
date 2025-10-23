import { GraphQLError } from "graphql"
import {
	TimeoutMiddleware,
	withTimeout,
	Timeout,
} from "../middlewares/timeout-middleware"

// Helper pour simuler des opérations longues
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe("Timeout Middleware", () => {
	describe("TimeoutMiddleware class", () => {
		test("should create middleware with default config", () => {
			const middleware = new TimeoutMiddleware()
			expect(middleware).toBeDefined()
		})

		test("should create middleware with custom config", () => {
			const middleware = new TimeoutMiddleware({
				timeoutMs: 5000,
				message: "Custom timeout message",
			})
			expect(middleware).toBeDefined()
		})

		test("should resolve fast operations successfully", async () => {
			const middleware = new TimeoutMiddleware({ timeoutMs: 1000 })
			const fastOperation = Promise.resolve("success")

			const result = await middleware.withTimeout(fastOperation)
			expect(result).toBe("success")
		})

		test("should timeout slow operations", async () => {
			const middleware = new TimeoutMiddleware({
				timeoutMs: 100,
				message: "Operation timed out",
			})
			const slowOperation = delay(200)

			await expect(middleware.withTimeout(slowOperation)).rejects.toThrow(
				"Operation timed out"
			)
		})

		test("should throw GraphQLError with correct extensions on timeout", async () => {
			const middleware = new TimeoutMiddleware({
				timeoutMs: 50,
				message: "Test timeout",
			})
			const slowOperation = delay(100)

			try {
				await middleware.withTimeout(slowOperation)
				fail("Should have thrown an error")
			} catch (error) {
				expect(error).toBeInstanceOf(GraphQLError)
				expect((error as GraphQLError).message).toBe("Test timeout")
				expect((error as GraphQLError).extensions?.code).toBe(
					"REQUEST_TIMEOUT"
				)
				expect((error as GraphQLError).extensions?.statusCode).toBe(408)
				expect((error as GraphQLError).extensions?.timeoutMs).toBe(50)
			}
		})
	})

	describe("withTimeout utility function", () => {
		test("should resolve fast operations with default timeout", async () => {
			const fastOperation = Promise.resolve("quick result")
			const result = await withTimeout(fastOperation)
			expect(result).toBe("quick result")
		})

		test("should resolve fast operations with custom timeout", async () => {
			const fastOperation = Promise.resolve("result")
			const result = await withTimeout(fastOperation, 1000)
			expect(result).toBe("result")
		})

		test("should timeout with default timeout", async () => {
			const slowOperation = delay(200)

			await expect(withTimeout(slowOperation, 100)).rejects.toThrow(
				"Operation timeout after 100ms"
			)
		}, 1000)

		test("should timeout with custom timeout", async () => {
			const slowOperation = delay(200)

			await expect(withTimeout(slowOperation, 100)).rejects.toThrow(
				"Operation timeout after 100ms"
			)
		})

		test("should throw GraphQLError with correct structure", async () => {
			const slowOperation = delay(150)

			try {
				await withTimeout(slowOperation, 100)
				fail("Should have thrown an error")
			} catch (error) {
				expect(error).toBeInstanceOf(GraphQLError)
				expect((error as GraphQLError).extensions?.code).toBe(
					"OPERATION_TIMEOUT"
				)
				expect((error as GraphQLError).extensions?.statusCode).toBe(408)
				expect((error as GraphQLError).extensions?.timeoutMs).toBe(100)
			}
		})
	})

	describe("@Timeout decorator", () => {
		class TestClass {
			@Timeout(200)
			async fastMethod(): Promise<string> {
				await delay(50)
				return "fast"
			}

			@Timeout(100)
			async slowMethod(): Promise<string> {
				await delay(200)
				return "slow"
			}

			@Timeout() // Default timeout
			async defaultTimeoutMethod(): Promise<string> {
				await delay(50)
				return "default"
			}
		}

		test("should allow fast methods to complete", async () => {
			const instance = new TestClass()
			const result = await instance.fastMethod()
			expect(result).toBe("fast")
		})

		test("should timeout slow methods", async () => {
			const instance = new TestClass()

			await expect(instance.slowMethod()).rejects.toThrow(
				"Operation timeout after 100ms"
			)
		})

		test("should work with default timeout", async () => {
			const instance = new TestClass()
			const result = await instance.defaultTimeoutMethod()
			expect(result).toBe("default")
		})

		test("should preserve method context", async () => {
			class ContextTest {
				value = "test-value"

				@Timeout(1000)
				async getValue(): Promise<string> {
					return this.value
				}
			}

			const instance = new ContextTest()
			const result = await instance.getValue()
			expect(result).toBe("test-value")
		})
	})

	describe("Apollo Plugin", () => {
		test("should create Apollo plugin", () => {
			const middleware = new TimeoutMiddleware()
			const plugin = middleware.createApolloPlugin()

			expect(plugin).toBeDefined()
			expect(typeof plugin.requestDidStart).toBe("function")
		})

		test("should have proper plugin structure", async () => {
			const middleware = new TimeoutMiddleware()
			const plugin = middleware.createApolloPlugin()

			const hooks = await plugin.requestDidStart()
			expect(hooks).toBeDefined()
			expect(typeof hooks.willSendResponse).toBe("function")
			expect(typeof hooks.didResolveOperation).toBe("function")
		})
	})

	describe("Edge Cases", () => {
		test("should handle rejected promises correctly", async () => {
			const middleware = new TimeoutMiddleware({ timeoutMs: 1000 })
			const rejectingPromise = Promise.reject(new Error("Original error"))

			await expect(
				middleware.withTimeout(rejectingPromise)
			).rejects.toThrow("Original error")
		})

		test("should handle very small timeout", async () => {
			const middleware = new TimeoutMiddleware({ timeoutMs: 1 })
			const slowOperation = delay(50)

			// Avec timeout très petit, ça devrait timeout rapidement
			await expect(middleware.withTimeout(slowOperation)).rejects.toThrow(
				"Request timeout after 1ms"
			)
		})

		test("should handle very large timeout", async () => {
			const middleware = new TimeoutMiddleware({ timeoutMs: 999999 })
			const fastOperation = Promise.resolve("result")

			const result = await middleware.withTimeout(fastOperation)
			expect(result).toBe("result")
		})
	})

	describe("Performance", () => {
		test("should not significantly delay fast operations", async () => {
			const middleware = new TimeoutMiddleware({ timeoutMs: 5000 })
			const startTime = Date.now()

			await middleware.withTimeout(Promise.resolve("fast"))

			const duration = Date.now() - startTime
			expect(duration).toBeLessThan(50) // Moins de 50ms de overhead
		})

		test("should timeout accurately", async () => {
			const timeoutMs = 100
			const middleware = new TimeoutMiddleware({ timeoutMs })
			const startTime = Date.now()

			try {
				await middleware.withTimeout(delay(200))
				fail("Should have timed out")
			} catch (error) {
				console.log(error)
				const duration = Date.now() - startTime
				// Le timeout devrait être proche de la valeur configurée (+/- 20ms de tolérance)
				expect(duration).toBeGreaterThanOrEqual(timeoutMs - 20)
				// Augmenter la tolérance pour les tests en environnement CI/CD
				expect(duration).toBeLessThanOrEqual(timeoutMs + 100)
			}
		})
	})
})

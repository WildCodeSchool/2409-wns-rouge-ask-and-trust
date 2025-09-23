import {
	authRateLimiter,
	mutationRateLimiter,
	searchRateLimiter,
	checkRateLimit,
	ApolloRateLimiter,
} from "../middlewares/apollo-rate-limiter"

// Helper pour reset un rate limiter
const resetRateLimiter = (rateLimiter: any) => {
	rateLimiter.store = {}
}

describe("Apollo Rate Limiter", () => {
	beforeEach(() => {
		// Reset tous les rate limiters avant chaque test
		resetRateLimiter(authRateLimiter)
		resetRateLimiter(mutationRateLimiter)
		resetRateLimiter(searchRateLimiter)
	})

	describe("Auth Rate Limiter (20 req/15min)", () => {
		test("should allow 20 requests then block the 21st", () => {
			const testIP = "192.168.1.100"

			// Les 20 premières requêtes doivent passer
			for (let i = 1; i <= 20; i++) {
				expect(() =>
					checkRateLimit(authRateLimiter, testIP, "login")
				).not.toThrow()
			}

			// La 21ème requête doit être bloquée
			expect(() =>
				checkRateLimit(authRateLimiter, testIP, "login")
			).toThrow("Rate limit exceeded for login")
		})

		test("should isolate different IP addresses", () => {
			const ip1 = "192.168.1.100"
			const ip2 = "192.168.1.101"

			// Épuiser la limite pour IP1
			for (let i = 0; i < 20; i++) {
				checkRateLimit(authRateLimiter, ip1, "login")
			}

			// IP1 doit être bloquée
			expect(() => checkRateLimit(authRateLimiter, ip1, "login")).toThrow(
				"Rate limit exceeded for login"
			)

			// IP2 doit encore pouvoir faire des requêtes
			expect(() =>
				checkRateLimit(authRateLimiter, ip2, "login")
			).not.toThrow()
		})

		test("should provide correct error details", () => {
			const testIP = "192.168.1.100"

			// Épuiser la limite
			for (let i = 0; i < 20; i++) {
				checkRateLimit(authRateLimiter, testIP, "register")
			}

			// Tester l'erreur détaillée
			try {
				checkRateLimit(authRateLimiter, testIP, "register")
				fail("Should have thrown an error")
			} catch (error: any) {
				expect(error.message).toBe("Rate limit exceeded for register")
				expect(error.extensions.code).toBe("RATE_LIMIT_EXCEEDED")
				expect(error.extensions.statusCode).toBe(429)
				expect(error.extensions.retryAfter).toBeGreaterThan(0)
				expect(error.extensions.remaining).toBe(0)
				expect(error.extensions.resetTime).toBeDefined()
			}
		})
	})

	describe("Mutation Rate Limiter (20 req/15min)", () => {
		test("should allow 20 requests then block", () => {
			const testIP = "192.168.1.100"

			// Les 20 premières requêtes doivent passer
			for (let i = 1; i <= 20; i++) {
				expect(() =>
					checkRateLimit(mutationRateLimiter, testIP, "createSurvey")
				).not.toThrow()
			}

			// La 21ème requête doit être bloquée
			expect(() =>
				checkRateLimit(mutationRateLimiter, testIP, "createSurvey")
			).toThrow("Rate limit exceeded for createSurvey")
		})
	})

	describe("Search Rate Limiter (30 req/1min)", () => {
		test("should allow 30 requests then block", () => {
			const testIP = "192.168.1.100"

			// Les 30 premières requêtes doivent passer
			for (let i = 1; i <= 30; i++) {
				expect(() =>
					checkRateLimit(searchRateLimiter, testIP, "searchSurveys")
				).not.toThrow()
			}

			// La 31ème requête doit être bloquée
			expect(() =>
				checkRateLimit(searchRateLimiter, testIP, "searchSurveys")
			).toThrow("Rate limit exceeded for searchSurveys")
		})
	})

	describe("Custom Rate Limiter", () => {
		test("should work with custom configuration", () => {
			// Rate limiter custom : 3 requêtes par 1 seconde
			const customLimiter = new ApolloRateLimiter(1000, 3)
			const testIP = "192.168.1.100"

			// Les 3 premières requêtes doivent passer
			for (let i = 1; i <= 3; i++) {
				expect(() =>
					checkRateLimit(customLimiter, testIP, "custom")
				).not.toThrow()
			}

			// La 4ème requête doit être bloquée
			expect(() =>
				checkRateLimit(customLimiter, testIP, "custom")
			).toThrow("Rate limit exceeded for custom")
		})
	})

	describe("Rate Limit Info", () => {
		test("should provide correct remaining count", () => {
			const testIP = "192.168.1.100"

			// Faire 3 requêtes sur 5 autorisées
			for (let i = 0; i < 3; i++) {
				checkRateLimit(authRateLimiter, testIP, "login")
			}

			// Vérifier les informations restantes
			const info = authRateLimiter.getRateLimitInfo(testIP)
			expect(info.remaining).toBe(17) // 20 - 3 = 17
			expect(info.retryAfter).toBeGreaterThan(0) // Il y a toujours un délai jusqu'au reset
			expect(info.resetTime).toBeGreaterThan(Date.now())
		})

		test("should show zero remaining when limit exceeded", () => {
			const testIP = "192.168.1.100"

			// Épuiser la limite
			for (let i = 0; i < 20; i++) {
				checkRateLimit(authRateLimiter, testIP, "login")
			}

			// Vérifier les informations après épuisement
			const info = authRateLimiter.getRateLimitInfo(testIP)
			expect(info.remaining).toBe(0)
			expect(info.retryAfter).toBeGreaterThan(0)
		})
	})

	describe("Edge Cases", () => {
		test("should handle empty identifier gracefully", () => {
			expect(() =>
				checkRateLimit(authRateLimiter, "", "test")
			).not.toThrow()
		})

		test("should handle undefined operation name", () => {
			expect(() =>
				checkRateLimit(
					authRateLimiter,
					"192.168.1.100",
					undefined as any
				)
			).not.toThrow()
		})

		test("should reset after window expires", done => {
			// Ce test nécessiterait d'attendre ou de mocker le temps
			// Pour l'instant, on teste juste la logique de base
			const customLimiter = new ApolloRateLimiter(100, 1) // 100ms window, 1 request
			const testIP = "192.168.1.100"

			// Première requête OK
			expect(() =>
				checkRateLimit(customLimiter, testIP, "test")
			).not.toThrow()

			// Deuxième requête bloquée
			expect(() =>
				checkRateLimit(customLimiter, testIP, "test")
			).toThrow()

			// Attendre l'expiration de la fenêtre
			setTimeout(() => {
				// Après expiration, devrait fonctionner à nouveau
				expect(() =>
					checkRateLimit(customLimiter, testIP, "test")
				).not.toThrow()
				done()
			}, 150)
		}, 1000)
	})
})

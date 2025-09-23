import { GraphQLError } from "graphql"

interface RateLimitStore {
	[key: string]: {
		count: number
		resetTime: number
	}
}

/**
 * Rate limiter natif pour Apollo Server
 */
export class ApolloRateLimiter {
	private store: RateLimitStore = {}
	private readonly windowMs: number
	private readonly maxRequests: number

	constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
		this.windowMs = windowMs
		this.maxRequests = maxRequests
	}

	/**
	 * Vérifie si une requête est autorisée
	 * @param identifier Identifiant unique (IP, user ID, etc.)
	 * @returns true si autorisé, false si rate limit atteint
	 */
	isAllowed(identifier: string): boolean {
		const now = Date.now()
		const key = identifier

		// Nettoyer les entrées expirées
		this.cleanup()

		if (!this.store[key]) {
			this.store[key] = {
				count: 1,
				resetTime: now + this.windowMs,
			}
			return true
		}

		const entry = this.store[key]

		// Si la fenêtre est expirée, réinitialiser
		if (now > entry.resetTime) {
			entry.count = 1
			entry.resetTime = now + this.windowMs
			return true
		}

		// Vérifier si la limite est atteinte
		if (entry.count >= this.maxRequests) {
			return false
		}

		// Incrémenter le compteur
		entry.count++
		return true
	}

	/**
	 * Obtient les informations de rate limiting
	 * @param identifier Identifiant unique
	 * @returns Informations sur le rate limiting
	 */
	getRateLimitInfo(identifier: string): {
		remaining: number
		resetTime: number
		retryAfter: number
	} {
		const now = Date.now()
		const key = identifier
		const entry = this.store[key]

		if (!entry || now > entry.resetTime) {
			return {
				remaining: this.maxRequests,
				resetTime: now + this.windowMs,
				retryAfter: 0,
			}
		}

		return {
			remaining: Math.max(0, this.maxRequests - entry.count),
			resetTime: entry.resetTime,
			retryAfter: Math.ceil((entry.resetTime - now) / 1000),
		}
	}

	/**
	 * Nettoie les entrées expirées
	 */
	private cleanup(): void {
		const now = Date.now()
		Object.keys(this.store).forEach(key => {
			if (now > this.store[key].resetTime) {
				delete this.store[key]
			}
		})
	}
}

// Instances de rate limiter pour différents types d'opérations
export const graphqlRateLimiter = new ApolloRateLimiter(15 * 60 * 1000, 100) // 100 req/15min
export const mutationRateLimiter = new ApolloRateLimiter(15 * 60 * 1000, 20) // 20 mutations/15min
export const authRateLimiter = new ApolloRateLimiter(15 * 60 * 1000, 5) // 5 auth/15min
export const searchRateLimiter = new ApolloRateLimiter(1 * 60 * 1000, 30) // 30 searches/1min

/**
 * Middleware de rate limiting pour Apollo Server
 * @param rateLimiter Instance du rate limiter à utiliser
 * @param getIdentifier Fonction pour obtenir l'identifiant unique
 */
export const createRateLimitMiddleware = (
	rateLimiter: ApolloRateLimiter,
	getIdentifier: (req: any) => string = req => req.ip || "unknown"
) => {
	return (req: any, res: any, next: any) => {
		const identifier = getIdentifier(req)

		if (!rateLimiter.isAllowed(identifier)) {
			const info = rateLimiter.getRateLimitInfo(identifier)

			throw new GraphQLError("Rate limit exceeded", {
				extensions: {
					code: "RATE_LIMIT_EXCEEDED",
					statusCode: 429,
					retryAfter: info.retryAfter,
					remaining: info.remaining,
					resetTime: info.resetTime,
				},
			})
		}

		// Ajouter les headers de rate limiting
		const info = rateLimiter.getRateLimitInfo(identifier)
		if (res && res.setHeader) {
			res.setHeader("X-RateLimit-Limit", rateLimiter["maxRequests"])
			res.setHeader("X-RateLimit-Remaining", info.remaining)
			res.setHeader(
				"X-RateLimit-Reset",
				new Date(info.resetTime).toISOString()
			)
		}

		next?.()
	}
}

/**
 * Fonction utilitaire pour vérifier le rate limiting dans les resolvers
 * @param rateLimiter Instance du rate limiter
 * @param identifier Identifiant unique
 * @param operation Nom de l'opération pour le logging
 */
export const checkRateLimit = (
	rateLimiter: ApolloRateLimiter,
	identifier: string,
	operation: string = "unknown"
): void => {
	if (!rateLimiter.isAllowed(identifier)) {
		const info = rateLimiter.getRateLimitInfo(identifier)

		console.warn(`Rate limit exceeded for ${operation} by ${identifier}`, {
			remaining: info.remaining,
			retryAfter: info.retryAfter,
			resetTime: new Date(info.resetTime).toISOString(),
		})

		throw new GraphQLError(`Rate limit exceeded for ${operation}`, {
			extensions: {
				code: "RATE_LIMIT_EXCEEDED",
				statusCode: 429,
				retryAfter: info.retryAfter,
				remaining: info.remaining,
				resetTime: info.resetTime,
			},
		})
	}
}

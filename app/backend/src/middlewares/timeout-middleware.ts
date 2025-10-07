import { GraphQLError } from "graphql"

/**
 * Configuration du timeout par défaut
 */
export const DEFAULT_TIMEOUT_MS = 30000 // 30 secondes

/**
 * Interface pour la configuration du timeout
 */
export interface TimeoutConfig {
	timeoutMs?: number
	message?: string
	enableMetrics?: boolean
	enableDebugLogging?: boolean
	operationTimeouts?: Record<string, number>
}

/**
 * Interface pour les métriques de timeout
 */
export interface TimeoutMetrics {
	increment(metric: string, tags: Record<string, string>): void
	timing(metric: string, duration: number, tags: Record<string, string>): void
}

/**
 * Interface pour le logger structuré
 */
export interface StructuredLogger {
	info(message: string, context: Record<string, any>): void
	warn(message: string, context: Record<string, any>): void
	error(message: string, context: Record<string, any>): void
	debug(message: string, context: Record<string, any>): void
}

/**
 * Logger par défaut utilisant console
 */
class DefaultLogger implements StructuredLogger {
	info(message: string, context: Record<string, any>): void {
		console.log(`ℹ️ [INFO] ${message}`, JSON.stringify(context))
	}

	warn(message: string, context: Record<string, any>): void {
		console.warn(`⚠️ [WARN] ${message}`, JSON.stringify(context))
	}

	error(message: string, context: Record<string, any>): void {
		console.error(`❌ [ERROR] ${message}`, JSON.stringify(context))
	}

	debug(message: string, context: Record<string, any>): void {
		if (process.env.NODE_ENV === "development") {
			console.log(`🔍 [DEBUG] ${message}`, JSON.stringify(context))
		}
	}
}

/**
 * Métriques par défaut utilisant console
 */
class DefaultMetrics implements TimeoutMetrics {
	increment(metric: string, tags: Record<string, string>): void {
		console.log(`📊 [METRIC] ${metric}`, { type: "counter", tags })
	}

	timing(
		metric: string,
		duration: number,
		tags: Record<string, string>
	): void {
		console.log(`📊 [METRIC] ${metric}`, { type: "timing", duration, tags })
	}
}

/**
 * Middleware de timeout pour Apollo Server
 * Limite le temps d'exécution des requêtes GraphQL
 */
export class TimeoutMiddleware {
	private readonly timeoutMs: number
	private readonly message: string
	private readonly enableMetrics: boolean
	private readonly enableDebugLogging: boolean
	private readonly operationTimeouts: Record<string, number>
	private readonly metrics: TimeoutMetrics
	private readonly logger: StructuredLogger

	constructor(
		config: TimeoutConfig = {},
		metrics?: TimeoutMetrics,
		logger?: StructuredLogger
	) {
		this.timeoutMs = config.timeoutMs || DEFAULT_TIMEOUT_MS
		this.message =
			config.message || `Request timeout after ${this.timeoutMs}ms`
		this.enableMetrics = config.enableMetrics ?? true
		this.enableDebugLogging =
			config.enableDebugLogging ?? process.env.NODE_ENV === "development"
		this.operationTimeouts = config.operationTimeouts || {
			// Timeouts spécifiques par type d'opération
			upload: 120000, // 2 minutes pour les uploads
			search: 10000, // 10 secondes pour les recherches
			report: 60000, // 1 minute pour les rapports
			export: 90000, // 1.5 minutes pour les exports
			import: 180000, // 3 minutes pour les imports
		}
		this.metrics = metrics || new DefaultMetrics()
		this.logger = logger || new DefaultLogger()
	}

	/**
	 * Crée une promesse qui se rejette après le délai spécifié
	 */
	private createTimeoutPromise(): Promise<never> {
		return new Promise((_, reject) => {
			setTimeout(() => {
				reject(
					new GraphQLError(this.message, {
						extensions: {
							code: "REQUEST_TIMEOUT",
							statusCode: 408,
							timeoutMs: this.timeoutMs,
						},
					})
				)
			}, this.timeoutMs)
		})
	}

	/**
	 * Applique le timeout à une promesse
	 */
	async withTimeout<T>(promise: Promise<T>): Promise<T> {
		return Promise.race([promise, this.createTimeoutPromise()])
	}

	/**
	 * Détermine le timeout approprié pour une opération
	 */
	private getTimeoutForOperation(operationName?: string): number {
		if (!operationName) {
			return this.timeoutMs
		}

		// Rechercher dans les timeouts configurés
		for (const [key, timeout] of Object.entries(this.operationTimeouts)) {
			if (operationName.toLowerCase().includes(key.toLowerCase())) {
				return timeout
			}
		}

		return this.timeoutMs
	}

	/**
	 * Plugin Apollo Server pour appliquer le timeout automatiquement
	 */
	createApolloPlugin() {
		const enableMetrics = this.enableMetrics
		const enableDebugLogging = this.enableDebugLogging
		const metrics = this.metrics
		const logger = this.logger

		return {
			requestDidStart: () => {
				return Promise.resolve({
					willSendResponse: async (requestContext: any) => {
						// Nettoyer les timeouts si nécessaire
						if (requestContext.timeoutId) {
							clearTimeout(requestContext.timeoutId)

							if (enableDebugLogging) {
								const operation =
									requestContext.request.operationName ||
									"anonymous"
								logger.debug("Timeout timer cleaned", {
									operation,
									request_id:
										requestContext.request.extensions
											?.requestId,
									user_id:
										requestContext.contextValue?.user?.id,
								})
							}
						}

						// Enregistrer les métriques de durée de requête
						if (enableMetrics && requestContext.startTime) {
							const duration =
								Date.now() - requestContext.startTime
							const operation =
								requestContext.request.operationName ||
								"anonymous"

							metrics.timing(
								"apollo.request.duration",
								duration,
								{
									operation,
									status: requestContext.response.errors
										? "error"
										: "success",
								}
							)
						}
					},

					didResolveOperation: async (requestContext: any) => {
						const startTime = Date.now()
						requestContext.startTime = startTime

						const operation =
							requestContext.request.operationName || "anonymous"
						const operationTimeout =
							this.getTimeoutForOperation(operation)

						if (enableDebugLogging) {
							logger.debug("Starting timeout timer", {
								operation,
								timeout_ms: operationTimeout,
								variables: requestContext.request.variables,
								request_id:
									requestContext.request.extensions
										?.requestId,
								user_id: requestContext.contextValue?.user?.id,
							})
						}

						// Démarrer le timer pour l'opération avec timeout spécifique
						requestContext.timeoutId = setTimeout(() => {
							const duration = Date.now() - startTime

							// Enregistrer les métriques de timeout
							if (enableMetrics) {
								metrics.increment("apollo.timeout.exceeded", {
									operation,
									timeout_ms: operationTimeout.toString(),
								})
							}

							// Log structuré pour l'observabilité
							logger.error("GraphQL operation timeout", {
								operation,
								variables: requestContext.request.variables,
								duration,
								timeout: operationTimeout,
								user_id: requestContext.contextValue?.user?.id,
								request_id:
									requestContext.request.extensions
										?.requestId,
							})

							// Créer une erreur de timeout avec contexte enrichi
							const timeoutError = new GraphQLError(
								`Operation '${operation}' timed out after ${operationTimeout}ms`,
								{
									extensions: {
										code: "REQUEST_TIMEOUT",
										statusCode: 408,
										operation,
										duration,
										timeoutMs: operationTimeout,
										timestamp: new Date().toISOString(),
									},
								}
							)

							// Rejeter la requête avec l'erreur de timeout
							requestContext.response.errors = [timeoutError]
							requestContext.response.data = null
						}, operationTimeout)
					},
				})
			},
		}
	}
}

/**
 * Instance par défaut du middleware de timeout
 */
export const timeoutMiddleware = new TimeoutMiddleware()

/**
 * Fonction utilitaire pour appliquer un timeout à n'importe quelle promesse
 * @param promise La promesse à exécuter
 * @param timeoutMs Délai en millisecondes (optionnel)
 * @returns Promesse avec timeout appliqué
 */
export async function withTimeout<T>(
	promise: Promise<T>,
	timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => {
			reject(
				new GraphQLError(`Operation timeout after ${timeoutMs}ms`, {
					extensions: {
						code: "OPERATION_TIMEOUT",
						statusCode: 408,
						timeoutMs,
					},
				})
			)
		}, timeoutMs)
	})

	return Promise.race([promise, timeoutPromise])
}

/**
 * Décorateur pour appliquer un timeout aux méthodes des resolvers
 */
export function Timeout(timeoutMs: number = DEFAULT_TIMEOUT_MS) {
	return function (
		_target: any,
		_propertyName: string,
		descriptor: PropertyDescriptor
	) {
		const method = descriptor.value

		descriptor.value = async function (...args: any[]) {
			const promise = method.apply(this, args)
			return withTimeout(promise, timeoutMs)
		}

		return descriptor
	}
}

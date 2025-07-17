// Configuration des endpoints selon l'environnement
// Local / staging / production

const getEnvironment = (): 'development' | 'staging' | 'production' => {
	// Check for explicit environment variable
	if (import.meta.env.VITE_NODE_ENV) {
		return import.meta.env.VITE_NODE_ENV as 'development' | 'staging' | 'production'
	}
	
	// Fallback to mode detection
	if (import.meta.env.MODE === 'development') {
		return 'development'
	}
	
	if (import.meta.env.MODE === 'production') {
		return 'production'
	}
	
	// Default to staging for other cases
	return 'staging'
}

export const VITE_GRAPHQL_ENDPOINT = (() => {
	const env = getEnvironment()
	
	switch (env) {
		case 'development':
			return "http://localhost:8080/api/v1"
		case 'production':
			return "https://092024-rouge-4.wns.wilders.dev/api/v1"
		case 'staging':
		default:
			return "https://staging.092024-rouge-4.wns.wilders.dev/api/v1"
	}
})()

// stripe secret key (test mode)
export const VITE_STRIPE_PUBLIC_KEY =
	"pk_test_51ROHcbRet8PeCQDAtNH9dKIsZq6TZewY9325xhmvwVVSNIcYwibm3PeORBvKDnI0HSunuRVduaG0ICtULfrINAhD002OgdIO77"

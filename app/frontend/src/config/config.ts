// Configuration des endpoints selon l'environnement
export const VITE_GRAPHQL_ENDPOINT = import.meta.env.PROD
	? "https://staging.092024-rouge-4.wns.wilders.dev/api/v1"
	: "http://localhost:8080/api/v1"

// stripe secret key (test mode)
export const VITE_STRIPE_PUBLIC_KEY =
	"pk_test_51ROHcbRet8PeCQDAtNH9dKIsZq6TZewY9325xhmvwVVSNIcYwibm3PeORBvKDnI0HSunuRVduaG0ICtULfrINAhD002OgdIO77"

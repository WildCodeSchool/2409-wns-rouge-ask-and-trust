import { VITE_GRAPHQL_ENDPOINT } from "@/config/config"
import { ApolloClient, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
	uri: VITE_GRAPHQL_ENDPOINT,
	cache: new InMemoryCache(),
	credentials: "include",
	headers: {
		"Access-Control-Allow-Credentials": "true",
	},
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
		query: {
			fetchPolicy: "network-only",
		},
	},
})

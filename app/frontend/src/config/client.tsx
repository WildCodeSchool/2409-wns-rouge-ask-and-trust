import { VITE_GRAPHQL_ENDPOINT } from "@/config/config"
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const httpLink = createHttpLink({
	uri: VITE_GRAPHQL_ENDPOINT,
	credentials: "include",
})

export const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "network-only",
		},
		query: {
			fetchPolicy: "network-only",
		},
	},
})

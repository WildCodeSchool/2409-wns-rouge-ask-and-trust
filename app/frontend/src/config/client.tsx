import { ApolloClient, InMemoryCache } from "@apollo/client"
import { VITE_GRAPHQL_ENDPOINT } from "@/config/config"

export const client = new ApolloClient({
	uri: VITE_GRAPHQL_ENDPOINT,
	cache: new InMemoryCache(),
	credentials: "same-origin",
})

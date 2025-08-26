import { client } from "@/config/client"
import Router from "@/config/router"
import { AuthProvider } from "@/contexts/AuthContextProvider"
import "@/styles/index.css"
import { ApolloProvider } from "@apollo/client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<HelmetProvider>
				<AuthProvider>
					<Router />
				</AuthProvider>
			</HelmetProvider>
		</ApolloProvider>
	</StrictMode>
)

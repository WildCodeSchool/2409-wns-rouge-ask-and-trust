/**
 * @fileoverview Main entry point of the React application
 * @module main
 */

import { client } from "@/config/client.tsx"
import Router from "@/config/router.tsx"
import { AuthProvider } from "@/contexts/AuthContextProvider.tsx"
import { StripeContextProvider } from "@/contexts/StripeContextProvider.tsx"
import "@/styles/index.css"
import { ApolloProvider } from "@apollo/client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "react-hot-toast"

/**
 * Initializes and renders the React application
 * 
 * The application is wrapped in several providers:
 * - StrictMode: For detecting potential problems
 * - ApolloProvider: For GraphQL request management
 * - AuthProvider: For authentication management
 * - StripeContextProvider: For payment processing
 * 
 * @returns {void}
 */
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<AuthProvider>
				<StripeContextProvider>
					<Router />
					<Toaster position="bottom-right" />
				</StripeContextProvider>
			</AuthProvider>
		</ApolloProvider>
	</StrictMode>
)

import { client } from "@/config/client.tsx"
import Router from "@/config/router.tsx"
import { AuthProvider } from "@/contexts/AuthContextProvider.tsx"
import "@/styles/index.css"
import { ApolloProvider } from "@apollo/client"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "react-hot-toast"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ApolloProvider client={client}>
			<AuthProvider>
				<Router />
				<Toaster position="bottom-right" />
			</AuthProvider>
		</ApolloProvider>
	</StrictMode>
)

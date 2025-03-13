import App from "@/App.tsx"
import ErrorElement from "@/components/ui/ErrorElement"
import Loader from "@/components/ui/Loader"
import NotFound from "@/pages/NotFound"
import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

// Using lazy loading for pages
const Home = lazy(() => import("@/pages/Home"))
const Auth = lazy(() => import("@/pages/Auth"))

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorElement />,
		children: [
			{
				path: "/",
				element: (
					<Suspense fallback={<Loader />}>
						<Home />
					</Suspense>
				),
			},
			// {
			// 	path: "auth",
			// 	element: (
			// 		//<ProtectedRoute> # example the use protected route here
			// 		<Suspense fallback={<Loader />}>
			// 			<Auth />
			// 		</Suspense>
			// 		//</ProtectedRoute>
			// 	),
			// },
			// @TODO If user is connected, block access to Signin and Signup
			{
				path: "register",
				element: (
					<Suspense fallback={<Loader />}>
						<Auth />
					</Suspense>
				),
			},
			{
				path: "connexion",
				element: (
					<Suspense fallback={<Loader />}>
						<Auth />
					</Suspense>
				),
			},
		],
	},
	{
		path: "*",
		element: <NotFound />,
	},
])

const Router = () => {
	return <RouterProvider router={router} />
}

export default Router

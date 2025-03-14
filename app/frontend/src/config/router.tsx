import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "@/App.tsx"
import NotFound from "@/pages/NotFound"
import Loader from "@/components/ui/Loader"
import ErrorElement from "@/components/ui/ErrorElement"
//import ProtectedRoute from "@/components/hoc/ProtectedRoute";

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
			{
				path: "auth",
				element: (
					//<ProtectedRoute> # example the use protected route here
					<Suspense fallback={<Loader />}>
						<Auth />
					</Suspense>
					//</ProtectedRoute>
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

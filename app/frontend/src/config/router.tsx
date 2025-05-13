import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "@/App.tsx"
import NotFound from "@/pages/NotFound"
import Loader from "@/components/ui/Loader"
import ErrorElement from "@/components/ui/ErrorElement"
//import ProtectedRoute from "@/components/hoc/ProtectedRoute";

// Using lazy loading for pages
const Landing = lazy(() => import("@/pages/Landing"))
const Surveys = lazy(() => import("@/pages/Surveys"))
const Auth = lazy(() => import("@/pages/Auth"))
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse"))
const UserProfile = lazy(() => import("@/pages/UserProfile"))

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
						<Landing />
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
			{
				path: "terms-of-use",
				element: (
					<Suspense fallback={<Loader />}>
						<TermsOfUse />
					</Suspense>
				),
			},
			{
				path: "/surveys",
				element: (
					<Suspense fallback={<Loader />}>
						<Surveys />
					</Suspense>
				),
			},
			{
				path: "/profile",
				element: (
					<Suspense fallback={<Loader />}>
						<UserProfile />
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

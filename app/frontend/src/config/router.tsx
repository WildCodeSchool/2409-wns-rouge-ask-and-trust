/**
 * @fileoverview Router configuration for the application using React Router
 * @module router
 */

import App from "@/App.tsx"
import ProtectedRoute from "@/components/hoc/ProtectedRoute"
import ErrorElement from "@/components/ui/ErrorElement"
import Loader from "@/components/ui/Loader"
import NotFound from "@/pages/NotFound"
import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

/**
 *  Using lazy loading for pages
 * @description
 * Lazy loaded page components
 * These components are loaded only when needed, improving initial load time
 */
const Landing = lazy(() => import("@/pages/Landing"))
const Surveys = lazy(() => import("@/pages/Surveys"))
const Auth = lazy(() => import("@/pages/Auth"))
const TermsOfUse = lazy(() => import("@/pages/TermsOfUse"))
const Payment = lazy(() => import("@/pages/Payment"))
const PaymentConfirmation = lazy(() => import("@/pages/PaymentConfirmation"))
const SurveyCreator = lazy(() => import("@/pages/SurveyCreator"))
const SurveyCreate = lazy(() => import("@/pages/SurveyCreate"))
const PreviewSurveyPage = lazy(() => import("@/pages/PreviewSurvey"))
const Contact = lazy(() => import("@/pages/Contact"))
const SurveyUpdate = lazy(() => import("@/pages/SurveyUpdate"))
const UserProfile = lazy(() => import("@/pages/UserProfile"))

/**
 * Router confirmation
 *
 * @description
 * Defines all routes in the application with their respective components
 * and protection levels
 */
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<Loader />}>
						<Landing />
					</Suspense>
				),
			},
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
				path: "contact",
				element: (
					<Suspense fallback={<Loader />}>
						<Contact />
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
				path: "surveys",
				element: (
					<Suspense fallback={<Loader />}>
						<Surveys />
					</Suspense>
				),
			},
			{
				path: "profile",
				element: (
					<Suspense fallback={<Loader />}>
						<UserProfile />
					</Suspense>
				),
			},
			{
				path: "payment",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<Payment />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "payment-confirmation",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<PaymentConfirmation />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "survey-creator",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<SurveyCreator />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "surveys/create",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<SurveyCreate />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "surveys/update/:id",
				element: (
					<Suspense fallback={<Loader />}>
						<SurveyUpdate />
					</Suspense>
				),
			},
			{
				path: "surveys/build/:id",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<SurveyCreator />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "surveys/preview/:id",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<PreviewSurveyPage />
						</ProtectedRoute>
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

/**
 * Router Component
 *
 * Provides routing functionality to the application using React Router
 * @component
 * @returns {JSX.Element} The RouterProvider component with the configured routes
 */
const Router = () => {
	return <RouterProvider router={router} />
}

export default Router

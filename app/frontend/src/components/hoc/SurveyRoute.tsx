/**
 * @fileoverview Higher Order Component for protecting survey routes based on survey status
 * @module SurveyRoute
 */

import Loader from "@/components/ui/Loader"
import { useSurvey } from "@/hooks/useSurvey"
import { useParams } from "react-router-dom"
import PublishedRequired from "../sections/surveys/PublishedRequired"

/**
 * SurveyRoute Component
 *
 * A Higher Order Component that protects survey routes based on survey availability and status.
 * It checks if the survey exists and is published, and:
 * - Shows a loader while checking survey status
 * - Throws appropriate HTTP errors for missing or invalid surveys
 * - Shows the PublishedRequired component if the survey is not published
 * - Renders the protected content if the survey is published and accessible
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The survey content to be protected
 * @returns {JSX.Element} The rendered survey content or unavailable message
 */
const SurveyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { id } = useParams<{ id: string }>()
	const { survey, surveyLoading, surveyError } = useSurvey(id)
	console.log("🚀 ~ SurveyRoute ~ survey:", survey)

	// If the survey state is still loading, show the loader
	if (id && surveyLoading) {
		return <Loader />
	}

	if (id) {
		// If there's an error fetching the survey, handle different error types
		if (!survey && surveyError) {
			const isNotFoundError = surveyError.graphQLErrors.some(error =>
				error.message.includes("Failed to fetch survey")
			)

			if (isNotFoundError) {
				throw new Response("Survey not found", { status: 404 })
			}

			// For other GraphQL errors
			throw new Response("Error loading survey", { status: 500 })
		}

		// If survey is not loading but doesn't exist, throw 404
		if (!surveyLoading && !survey) {
			throw new Response("Survey not found", { status: 404 })
		}
	}

	// If survey exists but is not published, show the PublishedRequired component
	if (survey.status !== "published") {
		return <PublishedRequired survey={survey} />
	}

	// If survey is published and accessible, render the children components
	return <>{children}</>
}

export default SurveyRoute

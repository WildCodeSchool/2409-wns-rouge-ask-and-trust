import { gql } from "@apollo/client"

export const GET_SURVEY_RESPONSES = gql`
	query SurveyResponses($surveyId: ID!, $filters: SurveyResponsesQueryInput) {
		surveyResponses(surveyId: $surveyId, filters: $filters) {
			responses {
				responseId
				user {
					id
					email
					firstname
					lastname
				}
				answers {
					questionId
					questionTitle
					questionType
					content
					submittedAt
				}
				submittedAt
				completionStatus
				totalQuestions
				answeredQuestions
				completionPercentage
			}
			totalCount
			page
			limit
			totalPages
			hasNextPage
			hasPreviousPage
		}
	}
`

export const GET_SURVEY_RESPONSE = gql`
	query SurveyResponse($surveyId: ID!, $userId: ID!) {
		surveyResponse(surveyId: $surveyId, userId: $userId) {
			responseId
			user {
				id
				email
				firstname
				lastname
			}
			answers {
				questionId
				questionTitle
				questionType
				content
				submittedAt
			}
			submittedAt
			completionStatus
			totalQuestions
			answeredQuestions
			completionPercentage
		}
	}
`

export const GET_SURVEY_RESPONSE_STATS = gql`
	query SurveyResponseStats($surveyId: ID!) {
		surveyResponseStats(surveyId: $surveyId) {
			totalResponses
			completeResponses
			partialResponses
			incompleteResponses
			completionRate
			firstResponseAt
			lastResponseAt
		}
	}
`

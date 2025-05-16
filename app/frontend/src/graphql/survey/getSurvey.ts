import { gql } from "@apollo/client"

export const querySurvey = gql`
	query Survey($surveyId: ID!) {
		survey(id: $surveyId) {
			id
			title
			description
			category {
				id
				name
			}
			createdBy {
				id
				email
				firstname
				lastname
			}
			createdAt
		}
	}
`

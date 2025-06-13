import { gql } from "@apollo/client"

export const GET_SURVEYS = gql`
	query Surveys {
		surveys {
			id
			title
			description
			category {
				id
				name
			}
			user {
				id
				email
			}
		}
	}
`

export const CREATE_SURVEY = gql`
	mutation CreateSurvey($data: CreateSurveyInput!) {
		createSurvey(data: $data) {
			id
			title
			description
			category {
				id
				name
			}
			user {
				id
				email
			}
		}
	}
`

export const GET_SURVEY = gql`
	query getSurvey($surveyId: ID!) {
		survey(id: $surveyId) {
			id
			title
			description
			status
			public
			user {
				id
				email
			}
			category {
				id
				name
			}
			questions {
				id
			}
			createdAt
			updatedAt
		}
	}
`

export const UPDATE_SURVEY = gql`
	mutation UpdateSurvey($id: ID!, $data: UpdateSurveyInput!) {
		updateSurvey(id: $id, data: $data) {
			id
			title
			description
			category {
				id
				name
			}
			user {
				id
				email
			}
		}
	}
`

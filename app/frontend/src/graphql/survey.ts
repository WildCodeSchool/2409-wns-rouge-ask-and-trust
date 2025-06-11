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

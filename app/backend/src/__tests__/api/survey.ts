import { gql } from "@apollo/client"
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
			}
		}
	}
`

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($data: CreateCategoryInput!) {
		createCategory(data: $data) {
			id
			name
		}
	}
`

export const GET_CATEGORIES = gql`
	query Categories {
		categories {
			id
			name
		}
	}
`

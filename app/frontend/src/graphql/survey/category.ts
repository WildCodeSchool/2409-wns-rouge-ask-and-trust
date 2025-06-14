import { gql } from "@apollo/client"

export const GET_CATEGORIES = gql`
	query Categories {
		categories {
			id
			name
		}
	}
`

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($data: createCategoryInput!) {
		createCategory(data: $data) {
			id
			name
		}
	}
`

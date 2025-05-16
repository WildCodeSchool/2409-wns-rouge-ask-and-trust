import { gql } from "@apollo/client"

export const CREATE_CATEGORY = gql`
	mutation CreateCategory($data: createCategoryInput!) {
		createCategory(data: $data) {
			id
			name
		}
	}
`

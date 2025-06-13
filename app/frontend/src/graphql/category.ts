import { gql } from "@apollo/client"

export const GET_CATEGORIES = gql`
	query Categories {
		categories {
			id
			name
		}
	}
`

import { gql } from "@apollo/client"

export const CREATE_QUESTION = gql`
	mutation CreateQuestion($data: CreateQuestionsInput!) {
		createQuestion(data: $data) {
			id
			title
			type
			answers {
				value
			}
			survey {
				id
				title
			}
		}
	}
`

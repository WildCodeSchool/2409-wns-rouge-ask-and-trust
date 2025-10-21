import { gql } from "@apollo/client"

export const CREATE_QUESTION = gql`
	mutation CreateQuestion($data: CreateQuestionInput!) {
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

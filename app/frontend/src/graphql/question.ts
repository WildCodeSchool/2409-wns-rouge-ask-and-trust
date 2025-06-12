import { gql } from "@apollo/client"

export const CREATE_QUESTION = gql`
	mutation CreateQuestion($content: CreateQuestionsInput!) {
		createQuestion(data: $data) {
			id
			content
			answers
		}
	}
`

export const GET_QUESTION = gql`
	query Question($questionId: ID!) {
		question(id: $questionId) {
			id
			title
			type
			answers {
				value
			}
		}
	}
`

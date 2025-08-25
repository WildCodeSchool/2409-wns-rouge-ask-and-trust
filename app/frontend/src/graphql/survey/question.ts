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
			survey {
				id
			}
		}
	}
`

export const UPDATE_QUESTION = gql`
	mutation UpdateQuestion($data: UpdateQuestionInput!) {
		updateQuestion(data: $data) {
			id
		}
	}
`
export const DELETE_QUESTION = gql`
	mutation DeleteQuestion($deleteQuestionId: ID!) {
		deleteQuestion(id: $deleteQuestionId) {
			id
			title
		}
	}
`

// @TODO add get questions by survey id query

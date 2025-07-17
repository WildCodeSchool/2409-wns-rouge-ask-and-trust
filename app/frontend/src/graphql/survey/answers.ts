import { gql } from "@apollo/client"

export const CREATE_ANSWER = gql`
	mutation CreateAnswer($data: CreateAnswersInput!) {
		createAnswer(data: $data) {
			id
			content
			questionId
			userId
			createdAt
		}
	}
`

export const GET_ANSWERS = gql`
	query GetAnswers {
		answers {
			id
			content
			questionId
			userId
			createdAt
		}
	}
`

export const GET_ANSWER = gql`
	query GetAnswer($userId: ID!, $questionId: ID!) {
		answer(userId: $userId, questionId: $questionId) {
			id
			content
			questionId
			userId
			createdAt
		}
	}
`

export const GET_ANSWERS_BY_SURVEY = gql`
	query GetAnswersBySurvey($surveyId: ID!) {
		answersBySurvey(surveyId: $surveyId) {
			id
			content
			questionId
			userId
			createdAt
			question {
				id
				title
				type
			}
		}
	}
`

export const DELETE_ANSWERS_BY_SURVEY = gql`
	mutation DeleteAnswersBySurvey($surveyId: ID!) {
		deleteAnswersBySurvey(surveyId: $surveyId)
	}
`

import { gql } from "@apollo/client"

export const GET_SURVEYS = gql`
	query Surveys($filters: AllSurveysQueryInput) {
		surveys(filters: $filters) {
			allSurveys {
				id
				title
				description
				status
				createdAt
				updatedAt
				category {
					id
					name
				}
				user {
					id
					email
				}
				estimatedDuration
				availableDuration
			}
			totalCount
			totalCountAll
			page
			limit
		}
	}
`

export const GET_SURVEY = gql`
	query GetSurvey($surveyId: ID!) {
		survey(id: $surveyId) {
			id
			title
			description
			status
			public
			user {
				id
				email
			}
			category {
				id
				name
			}
			questions {
				id
				title
				type
				answers {
					value
				}
			}
			createdAt
			updatedAt
		}
	}
`

export const GET_MY_SURVEYS = gql`
	query MySurveys($filters: MySurveysQueryInput) {
		mySurveys(filters: $filters) {
			surveys {
				id
				title
				status
				createdAt
				updatedAt
			}
			totalCount
			totalCountAll
			page
			limit
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
	mutation UpdateSurvey($data: UpdateSurveyInput!) {
		updateSurvey(data: $data) {
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

export const UPDATE_SURVEY_STATUS = gql`
	mutation UpdateSurveyStatus($data: UpdateSurveyInput!) {
		updateSurvey(data: $data) {
			id
			status
		}
	}
`

export const DELETE_SURVEY = gql`
	mutation DeleteSurvey($surveyId: ID!) {
		deleteSurvey(id: $surveyId) {
			id
		}
	}
`

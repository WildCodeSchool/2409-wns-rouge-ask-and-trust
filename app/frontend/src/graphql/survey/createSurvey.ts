import { gql } from "@apollo/client"

export const CREATE_SURVEY = gql`
	mutation CreateSurvey($data: CreateSurveyInput!) {
		createSurvey(data: $data) {
			id
		}
	}
`

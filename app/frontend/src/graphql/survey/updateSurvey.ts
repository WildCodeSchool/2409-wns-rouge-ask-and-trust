import { gql } from "@apollo/client"

export const UPDATE_SURVEY = gql`
	mutation UpdateSurvey($data: updateSurveyInput!, $id: ID!) {
		updateSurvey(data: $data, id: $id) {
			id
		}
	}
`

import { gql } from "@apollo/client"

export const REGISTER = gql`
	mutation Register($data: CreateUserInput!) {
		register(data: $data) {
			id
			email
		}
	}
`

export const LOGIN = gql`
	mutation Login($data: LogUserInput!) {
		login(data: $data) {
			message
			cookieSet
		}
	}
`

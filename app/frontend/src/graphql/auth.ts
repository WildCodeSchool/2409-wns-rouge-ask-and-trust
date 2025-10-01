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

export const WHOAMI = gql`
	query Whoami {
		whoami {
			id
			email
			firstname
			lastname
			role
		}
	}
`

export const LOGOUT = gql`
	mutation Mutation {
		logout
	}
`

export const GET_USERS = gql`
	query GetUsers {
		getUsers {
			id
			email
			firstname
			lastname
			role
			createdAt
		}
	}
`

// export const DELETE_MY_ACCOUNT = gql`
// 	mutation DeleteMyAccount($data: DeleteAccountInput!) {
// 		deleteMyAccount(data: $data)
// 	}
// `

export const UPDATE_PASSWORD = gql`
	mutation ChangePassword($data: UpdatePasswordInput!) {
		changePassword(data: $data)
	}
`

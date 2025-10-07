// import { register } from "../../services/auth-service"

// mutation {
//   register(data: {
//     email: "testuser@example.com",
//     password: "StrongPassw0rd!",
//     firstname: "Jean",
//     lastname: "Dupont"
//   }) {
//     id
//     email
//     role
//   }
// }

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

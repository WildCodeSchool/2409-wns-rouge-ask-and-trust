import { gql } from "@apollo/client"

/**
 * GraphQL mutation for creating a payment intent
 * @description
 * This mutation is used to create a payment intent on the server.
 */
export const CREATE_PAYMENT_INTENT = gql`
	mutation CreatePaymentIntent($input: CreatePaymentInput!) {
		createPaymentIntent(input: $input)
	}
`

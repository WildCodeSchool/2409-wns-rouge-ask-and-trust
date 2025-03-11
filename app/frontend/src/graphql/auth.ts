import { gql } from "@apollo/client";

export const REGISTER = gql`
    mutation Mutation($data: CreateUserInput!) {
        register(data: $data)
    }
`;

export const LOGIN = gql`
    mutation Mutation($data: CreateUserInput!) {
        login(data: $data)
    }
`;

export const WHOAMI = gql`
    query Whoami {
        whoami {
            id
            email
        }
    }
`;

export const LOGOUT = gql`
    mutation Mutation {
        logout
    }
`;
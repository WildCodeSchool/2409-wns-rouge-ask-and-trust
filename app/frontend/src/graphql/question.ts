import { gql } from "@apollo/client"

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($content: CreateQuestionsInput!) {
    createQuestion(content: $content) {
      id
      content
      answers
    }
  }
` 
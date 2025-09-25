import { Field, ObjectType, ID, Int } from "type-graphql"
import { User } from "../entities/user"
import { ResponseCompletionStatus } from "../../graphql/inputs/queries/survey-responses-query-input"

/**
 * Represents a single answer within a survey response
 */
@ObjectType()
export class ResponseAnswer {
	@Field(() => ID)
	questionId!: number

	@Field()
	questionTitle!: string

	@Field()
	questionType!: string

	@Field()
	content!: string

	@Field()
	submittedAt!: Date
}

/**
 * Represents a complete survey response from a user
 */
@ObjectType()
export class SurveyResponse {
	@Field(() => ID)
	responseId!: string

	@Field(() => User)
	user!: User

	@Field(() => [ResponseAnswer])
	answers!: ResponseAnswer[]

	@Field()
	submittedAt!: Date

	@Field(() => String)
	completionStatus!: ResponseCompletionStatus

	@Field(() => Int)
	totalQuestions!: number

	@Field(() => Int)
	answeredQuestions!: number

	@Field(() => Int)
	completionPercentage!: number
}

/**
 * Paginated result for survey responses
 */
@ObjectType()
export class SurveyResponsesResult {
	@Field(() => [SurveyResponse])
	responses!: SurveyResponse[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	page!: number

	@Field(() => Int)
	limit!: number

	@Field(() => Int)
	totalPages!: number

	@Field(() => Boolean)
	hasNextPage!: boolean

	@Field(() => Boolean)
	hasPreviousPage!: boolean
}

/**
 * Summary statistics for survey responses
 */
@ObjectType()
export class SurveyResponseStats {
	@Field(() => Int)
	totalResponses!: number

	@Field(() => Int)
	completeResponses!: number

	@Field(() => Int)
	partialResponses!: number

	@Field(() => Int)
	incompleteResponses!: number

	@Field(() => Int)
	completionRate!: number

	@Field(() => String, { nullable: true })
	firstResponseAt?: string

	@Field(() => String, { nullable: true })
	lastResponseAt?: string
}

import {
	IsOptional,
	IsString,
	IsInt,
	Min,
	Max,
	IsDateString,
	IsEnum,
} from "class-validator"
import { Field, InputType, Int } from "type-graphql"

export enum ResponseCompletionStatus {
	Complete = "complete",
	Partial = "partial",
	Incomplete = "incomplete",
}

export enum ResponseSortField {
	SubmittedAt = "submittedAt",
	UserEmail = "userEmail",
	CompletionStatus = "completionStatus",
}

export enum SortDirection {
	Asc = "asc",
	Desc = "desc",
}

/**
 * Input for querying survey responses with filtering, sorting, and pagination
 *
 * @description
 * - `keyword`: filters responses by answer content or user email
 * - `dateFrom` & `dateTo`: filters by submission date range
 * - `completionStatus`: filters by response completion status
 * - `sortBy`: sorting criteria (submittedAt, userEmail, completionStatus)
 * - `sortDirection`: sorting order (asc, desc)
 * - `page` & `limit`: pagination parameters
 */
@InputType()
export class SurveyResponsesQueryInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	keyword?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsDateString()
	dateFrom?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsDateString()
	dateTo?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsEnum(ResponseCompletionStatus)
	completionStatus?: ResponseCompletionStatus

	@Field({ nullable: true })
	@IsOptional()
	@IsEnum(ResponseSortField)
	sortBy?: ResponseSortField

	@Field({ nullable: true })
	@IsOptional()
	@IsEnum(SortDirection)
	sortDirection?: SortDirection

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	limit?: number
}

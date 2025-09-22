import { Type } from "class-transformer"
import { IsOptional, IsInt, Min, IsArray } from "class-validator"
import { Field, InputType, Int } from "type-graphql"
import { SurveyStatusType } from "../../../types/types"

/**
 * Represents the input parameters for querying all surveys visible on the homepage.
 *
 * @description
 * - `search`: filters surveys by keyword (title).
 * - `categoryId`: filters by category ID.
 * - `estimatedDurationMax`: filters surveys with an estimated duration less than or equal to the given value (in minutes).
 * - `availableDurationMax`: filters surveys whose remaining time before expiration is less than or equal to the given value (in days).
 * - `sortBy`: sorting criteria (creation date, estimated duration, remaining time, etc.).
 * - `status`: filter by survey status, of type `SurveyStatus`.
 * - `order`: sorting order (ASC or DESC).
 * - `page` & `limit`: pagination parameters.
 */
@InputType()
export class AllSurveysQueryInput {
	@Field({ nullable: true })
	@IsOptional()
	search?: string

	@Field(() => [Int], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsInt({ each: true })
	@Type(() => Number)
	categoryIds?: number[]

	@Field({ nullable: true })
	@IsOptional()
	sortBy?: "estimatedDuration" | "availableDuration"

	@Field({ nullable: true })
	@IsOptional()
	order?: "ASC" | "DESC"

	@Field(() => [String], { nullable: true })
	@IsOptional()
	status?: SurveyStatusType

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	limit?: number
}

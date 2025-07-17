import { IsOptional } from "class-validator"
import { Field, InputType } from "type-graphql"
import { SurveyStatus } from "../../../types/types"

/**
 * Represents the input parameters for the user's survey query.
 * This class is used to filter, sort, and paginate the list of surveys.
 *
 * @description
 * - `search`: optional string to filter surveys by keyword.
 * - `sortBy`: sorting criteria, either by creation date (`createdAt`) or update date (`updatedAt`).
 * - `order`: sort order, ascending (`ASC`) or descending (`DESC`).
 * - `status`: filter by survey status, of type `SurveyStatus`.
 * - `page`: page number for pagination.
 * - `limit`: maximum number of surveys returned per page.
 *
 * The decorators used are:
 * - `@Field({ nullable: true })`: exposes the property in the GraphQL schema as optional.
 * - `@IsOptional()`: indicates the validation of the property is optional (class-validator).
 */
@InputType()
export class MySurveysQueryInput {
	@Field({ nullable: true })
	@IsOptional()
	search?: string

	@Field({ nullable: true })
	@IsOptional()
	sortBy?: "createdAt"

	@Field({ nullable: true })
	@IsOptional()
	order?: "ASC" | "DESC"

	@Field(() => [String], { nullable: true })
	@IsOptional()
	status?: SurveyStatus[]

	@Field({ nullable: true })
	@IsOptional()
	page?: number

	@Field({ nullable: true })
	@IsOptional()
	limit?: number
}

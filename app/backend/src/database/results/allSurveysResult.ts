import { Field, Int, ObjectType } from "type-graphql"
import { Survey } from "../entities/survey/survey"

/**
 * Represents the response of the `surveys` query, containing paginated results of all surveys.
 * This class is used to structure the return of the query with pagination data.
 *
 * @description
 * - `surveys`: array of `Survey` objects corresponding to the surveys.
 * - `totalCount`: total number of surveys matching the criteria, useful for client-side pagination.
 * - `page`: current page number (optional, returned for information).
 * - `limit`: number of surveys per page (optional, returned for information).
 *
 * The decorators used are:
 * - `@ObjectType()`: exposes the class as a GraphQL output type.
 * - `@Field()`: exposes each property in the GraphQL schema.
 */
@ObjectType()
export class AllSurveysResult {
	@Field(() => [Survey])
	allSurveys!: Survey[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	totalCountAll!: number

	@Field(() => Int, { nullable: true })
	page?: number

	@Field(() => Int, { nullable: true })
	limit?: number
}

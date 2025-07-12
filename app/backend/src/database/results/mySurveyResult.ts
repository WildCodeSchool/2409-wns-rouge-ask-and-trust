import { Field, Int, ObjectType } from "type-graphql"
import { Survey } from "../entities/survey/survey"

/**
 * Représente la réponse de la requête `mySurveys`, contenant les résultats paginés des enquêtes de l'utilisateur.
 * Cette classe est utilisée pour structurer le retour de la requête avec les données de pagination.
 *
 * @description
 * - `surveys` : tableau d'objets `Survey` correspondant aux enquêtes de l'utilisateur.
 * - `totalCount` : nombre total d'enquêtes correspondant aux critères, utile pour la pagination côté client.
 * - `page` : numéro de page actuelle (optionnel, renvoyé pour information).
 * - `limit` : nombre d'enquêtes par page (optionnel, renvoyé pour information).
 *
 * Les décorateurs utilisés sont :
 * - `@ObjectType()` : expose la classe comme un type GraphQL de sortie.
 * - `@Field()` : expose chaque propriété dans le schéma GraphQL.
 */
@ObjectType()
export class MySurveysResult {
	@Field(() => [Survey])
	surveys!: Survey[]

	@Field(() => Int)
	totalCount!: number

	@Field(() => Int)
	totalCountAll!: number

	@Field(() => Int, { nullable: true })
	page?: number

	@Field(() => Int, { nullable: true })
	limit?: number
}

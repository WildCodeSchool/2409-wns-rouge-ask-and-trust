import { IsOptional } from "class-validator"
import { Field, InputType } from "type-graphql"
import { SurveyStatus } from "../../../types/types"

/**
 * Représente les paramètres d'entrée pour la requête des enquêtes de l'utilisateur.
 * Cette classe est utilisée pour filtrer, trier et paginer la liste des enquêtes.
 *
 * @description
 * - `search` : chaîne de caractères optionnelle pour filtrer les enquêtes par mot-clé.
 * - `sortBy` : critère de tri, soit par date de création (`createdAt`) soit par date de mise à jour (`updatedAt`).
 * - `order` : ordre de tri, ascendant (`ASC`) ou descendant (`DESC`).
 * - `status` : filtre par statut du sondage, de type `SurveyStatus`.
 * - `page` : numéro de page pour la pagination.
 * - `limit` : nombre maximal de enquêtes retournés par page.
 *
 * Les décorateurs utilisés sont :
 * - `@Field({ nullable: true })` : expose la propriété dans le schéma GraphQL en optionnel.
 * - `@IsOptional()` : indique que la validation de la propriété est optionnelle (class-validator).
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

import { Type } from "class-transformer"
import { IsOptional, IsInt, Min, IsArray } from "class-validator"
import { Field, InputType, Int } from "type-graphql"

/**
 * Représente les paramètres d'entrée pour la requête de toutes les enquêtes visibles en page d'accueil.
 *
 * @description
 * - `search` : filtre les enquêtes par mot-clé (titre).
 * - `categoryId` : filtre par identifiant de catégorie.
 * - `estimatedDurationMax` : filtre les enquêtes avec une durée estimée inférieure ou égale (en minutes).
 * - `remainingDurationMax` : filtre celles dont le temps restant avant expiration est inférieur ou égal (en jours).
 * - `sortBy` : critère de tri (création, durée estimée, temps restant...).
 * - `order` : ordre de tri (ASC ou DESC).
 * - `page` & `limit` : paramètres de pagination.
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

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	estimatedDurationMax?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	remainingDurationMax?: number

	@Field({ nullable: true })
	@IsOptional()
	sortBy?: "estimatedDuration" | "remainingDuration"

	@Field({ nullable: true })
	@IsOptional()
	order?: "ASC" | "DESC"

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

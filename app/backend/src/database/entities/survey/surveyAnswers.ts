/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the `SurveyAnswers` entity for the database.
 * It represents a completed survey submission by a specific user.
 */

import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../user"
import { Survey } from "./survey"

/**
 * SurveyAnswers Entity
 * @description
 * Represents a completed survey by a user, linking a user to a specific survey.
 * This entity acts as a submission record, and is used to associate
 * a set of answers with both the user who submitted them and the survey.
 *
 * @param name is the entity's name in the database (`answers`).
 *
 * This class defines the structure of the survey question answered entity in the database:
 * - `id`: unique identifier for the submission.
 * - `user`: the user who completed the survey (relation to `User`).
 * - `survey`: the survey that was completed (relation to `Survey`).
 *
 * @example
 * ```ts
 * const submission = new SurveyAnswers()
 * submission.user = someUser
 * submission.survey = someSurvey
 * await submission.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: defines the database table for the entity.
 * - `@PrimaryGeneratedColumn()`: auto-generates the `id`.
 * - `@ManyToOne()`: defines the relations to `User` and `Survey`.
 * - `@Field()`: exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "answers" })
export class SurveyAnswers extends BaseEntity {
	/**
	 * Unique identifier for the survey submission
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * User who completed the survey
	 * @description
	 * Many-to-one relation to the `User` entity.
	 */
	@ManyToOne(() => User, user => user.answers)
	user!: User

	/**
	 * Survey that was completed
	 * @description
	 * Many-to-one relation to the `Survey` entity.
	 */
	@ManyToOne(() => Survey, survey => survey.answers)
	survey!: Survey
}

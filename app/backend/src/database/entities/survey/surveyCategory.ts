/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the `SurveyCategory` entity for the database.
 * It represents a category to which surveys can be assigned.
 */

import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { Survey } from "./survey"
import { User } from "../user"

/**
 * SurveyCategory Entity
 * @description
 * Represents a category for organizing surveys.
 * Each category is uniquely named and can contain multiple surveys.
 * It is created by a user and timestamps are automatically handled.
 *
 * @param name is the entity's name in the database (`surveyCategory`).
 *
 * This class defines the structure of the category entity in the database:
 * - `id`: unique identifier for the category.
 * - `name`: unique name for the category.
 * - `user`: the user who created this category.
 * - `surveys`: surveys that belong to this category.
 * - `createdAt`: timestamp of when the category was created.
 * - `updatedAt`: timestamp of the last update.
 *
 * @example
 * ```ts
 * const category = new SurveyCategory()
 * category.name = "Satisfaction"
 * category.user = currentUser
 * await category.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: defines the table.
 * - `@PrimaryGeneratedColumn()`: auto-generates the primary key.
 * - `@Column()`: maps properties to columns.
 * - `@OneToOne()` / `@OneToMany()`: defines relations.
 * - `@ManyToOne()`: defines the relations to `SurveyCategory` and `User`.
 * - `@Field()`: exposes fields in GraphQL schema.
 */
@ObjectType()
@Entity({ name: "surveyCategory" })
export class SurveyCategory extends BaseEntity {
	/**
	 * Unique identifier for the category
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * Name of the survey category
	 * @description
	 * A short, unique label used to classify surveys.
	 */
	@Field()
	@Column({ length: 100, unique: true })
	name!: string

	/**
	 * Surveys belonging to this category
	 * @description
	 * One-to-many relation to the `Survey` entity.
	 */
	@OneToMany(() => Survey, survey => survey.category)
	@Field(() => [Survey])
	surveys!: Survey[]

	/**
	 * User who created the category
	 * @description
	 * Many relation to the `User` entity.
	 */
	@ManyToOne(() => User)
	@Field(() => User, { nullable: true })
	createdBy!: User

	/**
	 * Timestamp when the category was created
	 * @description
	 * Automatically set on insertion.
	 */
	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date

	/**
	 * Timestamp when the category was last updated
	 * @description
	 * Automatically updated on change.
	 */
	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date
}

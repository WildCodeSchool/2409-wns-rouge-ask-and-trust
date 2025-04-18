/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the Survey entity for the database.
 * It represents a survey created by a user, with a title, description,
 * status, category, and a set of questions and answers.
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
import { User } from "../user"
import { SurveyCategory } from "./surveyCategory"
import { SurveyQuestions } from "./surveyQuestions"
import { SurveyQuestionAnswered } from "./surveyQuestionAnswered"

/**
 * Survey Entity
 * @description
 * Represents a survey entity in the database.
 *
 * @param name is the entity's name in database.
 *
 * This class defines the structure of the survey entity in database:
 * - `id`: unique identifier for the survey.
 * - `title`: title of the survey (must be unique).
 * - `description`: detailed information or context about the survey.
 * - `status`: the current state of the survey (`draft`, `publish`, `archive`, `censored`), defaults to `draft`.
 * - `public`: defines whether the survey is accessible publicly or only to selected users.
 * - `user`: the creator of the survey (relation to the `User` entity).
 * - `category`: the category to which the survey belongs (relation to the `SurveyCategory` entity).
 * - `createdAt`: timestamp of when the survey was created.
 * - `updatedAt`: timestamp of when the survey was last updated.
 *
 * @example
 * ```typescript
 * // Create a new survey
 * const survey = new Survey()
 * survey.title = "Customer Satisfaction"
 * survey.description = "Survey about customer experience"
 * survey.status = "draft"
 * survey.public = true
 * survey.user = userInstance
 * survey.category = categoryInstance
 * await survey.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Marks the primary key column with auto-increment.
 * - `@Column()`: Maps a class property to a database column.
 * - `@ManyToOne()`: Defines a many-to-one relationship between entities.
 * - `@OneToMany()`: Defines a one-to-many relationship between entities.
 * - `@Field()`: Exposes a class property to the GraphQL schema.
 *
 */
@ObjectType()
@Entity({ name: "survey" })
export class Survey extends BaseEntity {
	/**
	 * Unique identifier for the survey
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * Title of the survey
	 * @description
	 * A short, unique label that identifies the survey.
	 */
	@Field()
	@Column({ length: 255, unique: true })
	title!: string

	/**
	 * Description of the survey
	 * @description
	 * Provides additional information or context about the survey.
	 */
	@Field()
	@Column({ type: "text" })
	description!: string

	/**
	 * Status of the survey
	 * @description
	 * Indicates the state of the survey (`draft`, `publish`, `archive`, `censored`).
	 * Defaults to `draft`.
	 */
	@Column({
		enum: ["draft", "publish", "archive", "censored"],
		default: "draft",
	})
	@Field()
	status!: string

	/**
	 * Whether the survey is public
	 * @description
	 * If true, the survey is publicly accessible; otherwise, access is restricted.
	 */
	@Field()
	@Column()
	public!: boolean

	/**
	 * The user who created the survey
	 * @description
	 * Many-to-one relationship with the User entity.
	 */
	@ManyToOne(() => User, user => user.surveys)
	@Field(() => User, { nullable: true })
	user!: User

	/**
	 * Category of the survey
	 * @description
	 * Many-to-one relationship with the SurveyCategory entity.
	 */
	@ManyToOne(() => SurveyCategory, category => category.surveys)
	@Field(() => SurveyCategory)
	category!: SurveyCategory

	/**
	 * Questions in the survey
	 * @description
	 * One-to-many relationship with the SurveyQuestions entity.
	 */
	@OneToMany(() => SurveyQuestions, question => question.survey)
	@Field(() => SurveyQuestions, { nullable: true })
	questions!: SurveyQuestions[]

	/**
	 * Answers submitted to the survey
	 * @description
	 * One-to-many relationship with the SurveyQuestionAnswered entity.
	 */
	@OneToMany(() => SurveyQuestionAnswered, answer => answer.user)
	@Field(() => SurveyQuestionAnswered, { nullable: true })
	answers!: SurveyQuestionAnswered[]

	/**
	 * Timestamp when the survey was created
	 * @description
	 * Automatically set when the survey is created.
	 */
	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date

	/**
	 * Timestamp when the survey was last updated
	 * @description
	 * Automatically updated whenever the survey is modified.
	 */
	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date
}

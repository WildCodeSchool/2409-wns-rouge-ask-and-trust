/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the `SurveyAnswers` entity for the database.
 * It represents a single answer provided by a user to a specific survey question.
 */

import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { SurveyQuestions } from "./surveyQuestions"
import { SurveyQuestionAnswered } from "./surveyQuestionAnswered"

/**
 * SurveyAnswers Entity
 * @description
 * Represents a single answer to a survey question submitted by a user.
 * Each answer is linked to a specific question and to a group of answers
 * representing a full survey submission.
 *
 * @param name is the entity's name in the database (`surveyAnswers`).
 *
 * This class defines the structure of the survey answer entity in the database:
 * - `id`: unique identifier for the answer.
 * - `content`: the textual content of the answer.
 * - `questionAnswered`: reference to the group of answers from one user.
 * - `question`: the survey question to which this answer belongs.
 * - `createdAt`: timestamp indicating when the answer was submitted.
 *
 * @example
 * ```ts
 * const answer = new SurveyAnswers()
 * answer.content = "I strongly agree"
 * answer.question = someQuestion
 * answer.questionAnswered = someSubmissionGroup
 * await answer.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: defines the database table for the entity.
 * - `@PrimaryGeneratedColumn()`: auto-generates the `id`.
 * - `@Column()`: maps fields to database columns.
 * - `@OneToOne()` + `@JoinColumn()`: links to `SurveyQuestions` and `SurveyQuestionAnswered`.
 * - `@Field()`: exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "surveyAnswers" })
export class SurveyAnswers extends BaseEntity {
	/**
	 * Unique identifier for the answer
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * Text content of the answer
	 * @description
	 * The actual response provided by the user to the question.
	 */
	@Field()
	@Column({ type: "text" })
	content!: string

	/**
	 * Grouped submission this answer is part of
	 * @description
	 * Links to the survey submission that this answer belongs to.
	 */
	@OneToOne(() => SurveyQuestionAnswered)
	@JoinColumn()
	questionAnswered!: SurveyQuestionAnswered

	/**
	 * Question associated with this answer
	 * @description
	 * One-to-one link to the question being answered.
	 */
	@OneToOne(() => SurveyQuestions)
	@JoinColumn()
	question!: SurveyQuestions

	/**
	 * Timestamp when the answer was created
	 * @description
	 * Automatically set when the answer is saved.
	 */
	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date
}

/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the `Answers` entity for the database.
 * It represents a single answer provided by a user to a specific survey question.
 */

import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { Questions } from "./questions"
import { User } from "../user"

/**
 * Answers Entity
 * @description
 * Represents a single answer to a survey question submitted by a user.
 * Each answer is linked to a specific question and to a group of answers
 * representing a full survey submission.
 *
 * @param name is the entity's name in the database (`Answers`).
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
 * const answer = new Answers()
 * answer.content = "I strongly agree"
 * answer.question = someQuestion
 * answer.questionAnswered = someSubmissionGroup
 * await answer.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: defines the database table for the entity.
 * - `@PrimaryColumn()`: Part of the composite primary key.
 * - `@Column()`: maps fields to database columns.
 * - `@OneToOne()` + `@JoinColumn()`: links to `Questions` and `SurveyAnswers`.
 * - `@Field()`: exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "answers" })
export class Answers extends BaseEntity {
	/**
	 * Unique identifier for the answer
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	id() {
		return this.user.id + this.question.id
	}

	/**
	 * User ID
	 * @description
	 * Part of the composite primary key.
	 * Identifies the user who submitted this answer.
	 */
	@Field(() => ID)
	@PrimaryColumn()
	userId!: number

	/**
	 * Question ID
	 * @description
	 * Part of the composite primary key.
	 * Identifies the question to which the user responded.
	 */
	@Field(() => ID)
	@PrimaryColumn()
	questionId!: number

	/**
	 * Text content of the answer
	 * @description
	 * The actual response provided by the user to the question.
	 */
	@Field()
	@Column({ length: 1000 })
	content!: string

	/**
	 * User associated with this answer
	 * @description
	 * One-to-one link to the user who answered.
	 */
	@OneToOne(() => User)
	@JoinColumn()
	user!: User

	/**
	 * Question associated with this answer
	 * @description
	 * One-to-one link to the question being answered.
	 */
	@OneToOne(() => Questions)
	@JoinColumn()
	question!: Questions

	/**
	 * Timestamp when the answer was created
	 * @description
	 * Automatically set when the answer is saved.
	 */
	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date
}

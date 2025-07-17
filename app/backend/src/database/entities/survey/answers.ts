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
	ManyToOne,
	PrimaryColumn,
	CreateDateColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { Questions } from "./questions"
import { User } from "../user"

/**
 * Answers Entity
 * @description
 * Represents a single answer to a survey question submitted by a user.
 * Each answer is linked to a specific question and user.
 *
 * @param name is the entity's name in the database (`Answers`).
 *
 * This class defines the structure of the survey answer entity in the database:
 * - `id`: unique identifier combining userId and questionId.
 * - `content`: the textual content of the answer.
 * - `user`: reference to the user who answered.
 * - `question`: the survey question to which this answer belongs.
 * - `createdAt`: timestamp indicating when the answer was submitted.
 *
 * @example
 * ```ts
 * const answer = new Answers()
 * answer.content = "I strongly agree"
 * answer.question = someQuestion
 * answer.user = someUser
 * await answer.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: defines the database table for the entity.
 * - `@PrimaryColumn()`: Part of the composite primary key.
 * - `@Column()`: maps fields to database columns.
 * - `@ManyToOne()` + `@JoinColumn()`: links to `Questions` and `User`.
 * - `@Field()`: exposes fields to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "answers" })
export class Answers extends BaseEntity {
	/**
	 * Unique identifier for the answer
	 * @description
	 * Computed from userId and questionId for GraphQL.
	 */
	@Field(() => ID)
	get id(): string {
		return `${this.userId}_${this.questionId}`
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
	 * Many-to-one link to the user who answered.
	 */
	@Field(() => User)
	@ManyToOne(() => User)
	@JoinColumn({ name: "userId" })
	user!: User

	/**
	 * Question associated with this answer
	 * @description
	 * Many-to-one link to the question being answered.
	 */
	@Field(() => Questions)
	@ManyToOne(() => Questions)
	@JoinColumn({ name: "questionId" })
	question!: Questions

	/**
	 * Timestamp when the answer was created
	 * @description
	 * Automatically set when the answer is saved.
	 */
	@Field()
	@CreateDateColumn()
	createdAt!: Date
}

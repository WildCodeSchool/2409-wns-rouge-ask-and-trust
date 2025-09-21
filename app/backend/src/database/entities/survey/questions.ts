import { QuestionTypeEnum, TypesOfQuestion } from "./../../../types/types"
/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the Questions entity for the database.
 * It represents a question that belongs to a survey and can have
 * a specific type (e.g. text, radio, checkbox) and optional predefined answers.
 */

import { Field, ID, ObjectType } from "type-graphql"
import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm"
import { AnswerObject } from "../../../graphql/inputs/create/survey/create-questions-input"
import { Survey } from "./survey"

/**
 * Questions Entity
 * @description
 * Represents a question that belongs to a survey.
 *
 * @param name is the entity's name in database ("questions").
 *
 * This class defines the structure of the survey questions in the database:
 * - `id`: unique identifier for the question.
 * - `content`: the text of the question (must be unique).
 * - `type`: the expected type of answer (e.g. `text`, `radio`, `checkbox`), based on `TypeOfQuestion` enum.
 * - `answers`: optional predefined choices for the question, stored as a JSON array.
 * - `survey`: the survey to which this question belongs (relation to the `Survey` entity).
 *
 * @example
 * ```ts
 * const question = new Questions()
 * question.title = "What is your favorite color?"
 * question.type = TypeOfQuestion.RADIO
 * question.answers = ["Red", "Blue", "Green"]
 * question.survey = someSurveyInstance
 * await question.save()
 * ```
 *
 * Decorators used:
 * - `@Entity()`: Declares the class as a database entity.
 * - `@PrimaryGeneratedColumn()`: Marks the primary key column with auto-increment.
 * - `@Column()`: Maps a class property to a database column.
 * - `@ManyToOne()`: Defines a many-to-one relationship between entities.
 * - `@Field()`: Exposes a class property to the GraphQL schema.
 */
@ObjectType()
@Entity({ name: "questions" })
export class Questions extends BaseEntity {
	/**
	 * Unique identifier for the question
	 * @description
	 * Auto-generated primary key.
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * Title of the question
	 * @description
	 * The actual text/content of the question (must be unique).
	 */
	@Field()
	@Column({ length: 1000 /*, unique: true*/ }) // @todo check type
	title!: string

	/**
	 * Type of question
	 * @description
	 * The type expected for the question (e.g. text, multiple choice, boolean)
	 */
	@Field(() => QuestionTypeEnum)
	@Column({
		type: "enum",
		enum: TypesOfQuestion,
		default: TypesOfQuestion.Text,
	})
	type!: QuestionTypeEnum

	/**
	 * Answers to the question
	 * @description
	 * Stored as a single JSON array in PostgreSQL (`jsonb`).
	 * Why `jsonb`:
	 *  - (+) Allows indexing and efficient queries
	 *  - (+) Faster to process (binary format, no reparsing on each access)
	 *  - (-) Slightly larger storage size compared to plain `json`
	 *
	 * Why `array: false`:
	 *  - Ensures this is a single `jsonb` column containing one JSON array
	 *    (e.g. `[{"value": "Yes"}, {"value": "No"}]`)
	 *  - Not a Postgres `jsonb[]` (which would be an array of `jsonb` values)
	 */
	@Field(() => [AnswerObject])
	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	answers!: AnswerObject[]

	// relation Answers

	/**
	 * The survey to which this question belongs
	 * @description
	 * Many-to-one relationship with the Survey entity.
	 */
	@ManyToOne(() => Survey, survey => survey.questions)
	@Field(() => Survey, { nullable: true })
	survey!: Survey

	/**
	 * User who created the question
	 * @description
	 * Many relation to the `User` entity.
	 */

	// Maybe for later if several users can create questions in the same survey.

	// @ManyToOne(() => User)
	// @Field(() => User, { nullable: true })
	// createdBy!: User
}

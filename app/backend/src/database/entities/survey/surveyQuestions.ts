/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the SurveyQuestions entity for the database.
 * It represents a question that belongs to a survey and can have
 * a specific type (e.g. text, radio, checkbox) and optional predefined answers.
 */

import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { TypeOfQuestion } from "../../../types/types"
import { Survey } from "./survey"
import { SurveyAnswers } from "./surveyAnswers"

/**
 * SurveyQuestions Entity
 * @description
 * Represents a question that belongs to a survey.
 *
 * @param name is the entity's name in database ("surveyQuestions").
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
 * const question = new SurveyQuestions()
 * question.content = "What is your favorite color?"
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
@Entity({ name: "surveyQuestions" })
export class SurveyQuestions extends BaseEntity {
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
	@Column({ length: 255, unique: true })
	content!: string

	/**
	 * Type of question
	 * @description
	 * The type expected for the question (e.g. text, multiple choice, boolean)
	 */
	@Field(() => String)
	@Column({
		type: "enum",
		enum: TypeOfQuestion,
		default: TypeOfQuestion.TEXT,
	})
	type!: TypeOfQuestion

	/**
	 * Answers to the question
	 * @description
	 * Used to stock answers
	 */
	@Column({
		type: "jsonb",
		array: false,
		default: () => "'[]'",
		nullable: false,
	})
	answers!: SurveyAnswers

	/**
	 * The survey to which this question belongs
	 * @description
	 * Many-to-one relationship with the Survey entity.
	 */
	@ManyToOne(() => Survey, survey => survey.questions)
	@Field(() => Survey, { nullable: true })
	survey!: Survey
}

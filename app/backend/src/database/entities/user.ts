import { Field, ID, ObjectType, UseMiddleware } from "type-graphql"
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm"
import { Roles, UserRole } from "../../types/types"
import { Category } from "./survey/category"
import { Survey } from "./survey/survey"
import { HideEmail } from "../../middlewares/hide-email"

/**
 * Represents a user entity in the database.
 * @param name is the entity's name in database.
 * This class defines the structure of the user entity in database:
 * - `id`: unique identifier for the user.
 * - `email`: user's email address (unique).
 * - `hashedPassword`: the user's password stored in a hashed format (not exposed via GraphQL).
 * - `firstname`: the user's first name.
 * - `lastname`: the user's last name.
 * - `role`: the user's role (defaults to `Roles.User`).
 * - `surveys`: list of surveys created by the user (relation to the `Survey` entity).
 * - `createdAt`: timestamp of when the user was created.
 * - `updatedAt`: timestamp of when the user was last updated.
 *
 * The class also leverages the following decorators:
 * - `@Column()`: Tells TypeORM to store the property in the database.
 * - `@Field()`: Exposes the property in the GraphQL schema (via type-graphql).
 *
 * For `createdAt` and `updatedAt`, the timestamps are automatically set by the database.
 */

@ObjectType()
@Entity({ name: "user" })
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	@Field({ nullable: true })
	@Column({ length: 254, unique: true })
	@UseMiddleware(HideEmail)
	email!: string // standard RFC 5321 for email's length

	@Column({ length: 255 })
	hashedPassword!: string // User's hashed password (not exposed via GraphQL)

	@Field()
	@Column({ length: 100 })
	firstname!: string

	@Field()
	@Column({ length: 100 })
	lastname!: string

	@Field()
	@Column({
		type: "enum",
		enum: Roles,
		default: Roles.User,
	})
	role!: UserRole

	@Field(() => [Survey], { nullable: true })
	@OneToMany(() => Survey, survey => survey.user)
	surveys!: Survey[]

	@Field(() => [Category], { nullable: true })
	@OneToMany(() => Category, category => category.createdBy)
	categories!: Category[]

	// @Field(() => [Questions], { nullable: true })
	// @OneToMany(() => Questions, question => question.createdBy)
	// questions!: Questions[]

	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date

	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date

	/**
	 * Recovery codes for password reset (hashed)
	 * @description
	 * Array of hashed recovery codes that can be used once each for password reset
	 * Generated when user requests them and stored as JSON array
	 */
	@Column({ type: "json", nullable: true })
	recoveryCodes?: string[]
}

@ObjectType()
export class LogInResponse {
	@Field()
	message!: string

	@Field(() => Boolean)
	cookieSet!: boolean
}

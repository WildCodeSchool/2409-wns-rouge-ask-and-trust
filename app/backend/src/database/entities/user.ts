import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Roles, UserRole } from "../../types/types"

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

	@Field()
	@Column({ length: 254, unique: true })
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

	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date 

	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date 
}

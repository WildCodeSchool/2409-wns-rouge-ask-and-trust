import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

// This class represents a user entity in the database.
// It defines the structure of a user, including its unique identifier (id),
// the user's email address, and the user's hashed password.
@ObjectType()
@Entity({ name: "user" }) // The name of the table in the database
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number // Unique identifier for the user

	@Field()
	@Column({ length: 254, unique: true })
	email!: string // User's email address
	// standard RFC 5321 for email's length

	@Column({ length: 255 })
	hashedPassword!: string // User's hashed password (not exposed via GraphQL)

	@Field()
	@Column({ length: 100 })
	firstname!: string

	@Field()
	@Column({ length: 100 })
	lastname!: string

	@Field()
	@Column({ enum: ["user", "admin"], default: "user" })
	role!: "user" | "admin" | "moderator" // User's role

	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date // The date and time when the user was created

	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date // The date and time when the user was last updated
}

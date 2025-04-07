import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"

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
	@Column({ length: 255, unique: true })
	email!: string // User's email address

	@Column({ length: 255 })
	password!: string // User's hashed password (not exposed via GraphQL)

	@Column({ enum: ["user", "admin"], default: "user" })
	@Field()
	role!: string // "user" | "admin"

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

import { Field, ID, ObjectType } from "type-graphql"
import {
	BaseEntity,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from "typeorm"
import { Payment } from "./payment"

/**
 * User Snapshot Entity for GDPR compliance and accounting requirements
 * @description
 * Represents a snapshot of user data at the time of payment for legal/accounting purposes.
 * This ensures we can maintain payment records even after user account deletion (GDPR Article 17 exceptions).
 *
 * Key features:
 * - Immutable snapshot of user data at payment time
 * - Separate from live user data to allow account deletion
 * - Contains minimal necessary data for legal/accounting compliance
 * - Anonymized where possible while maintaining audit trail
 */
@ObjectType()
@Entity({ name: "user_snapshot" })
export class UserSnapshot extends BaseEntity {
	/**
	 * Unique identifier for the user snapshot
	 */
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id!: number

	/**
	 * Original user ID (for reference, may be null if user deleted)
	 */
	@Field({ nullable: true })
	@Column({ nullable: true })
	originalUserId?: number

	/**
	 * User's email at time of payment (anonymized after account deletion)
	 */
	@Field()
	@Column({ length: 254 })
	email!: string

	/**
	 * User's first name at time of payment
	 */
	@Field()
	@Column({ length: 100 })
	firstname!: string

	/**
	 * User's last name at time of payment
	 */
	@Field()
	@Column({ length: 100 })
	lastname!: string

	/**
	 * User's role at time of payment
	 */
	@Field()
	@Column({ length: 50 })
	role!: string

	/**
	 * Whether this snapshot has been anonymized due to account deletion
	 */
	@Field()
	@Column({ default: false })
	isAnonymized!: boolean

	/**
	 * Timestamp when user account was deleted (if applicable)
	 */
	@Field({ nullable: true })
	@Column({ nullable: true })
	accountDeletedAt?: Date

	/**
	 * Legal basis for retaining this data (e.g., "accounting_requirements", "legal_obligation")
	 */
	@Field()
	@Column({ length: 100, default: "accounting_requirements" })
	retentionBasis!: string

	/**
	 * Payments associated with this user snapshot
	 */
	@Field(() => [Payment], { nullable: true })
	@OneToMany(() => Payment, payment => payment.userSnapshot)
	payments!: Payment[]

	/**
	 * Timestamp when this snapshot was created
	 */
	@Field()
	@Column({ default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date

	/**
	 * Timestamp when this snapshot was last updated
	 */
	@Field()
	@Column({
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updatedAt!: Date
}

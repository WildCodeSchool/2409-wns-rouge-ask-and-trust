/**
 * @packageDocumentation
 * @category Entities
 * @description
 * This module defines the Payment entity for the database.
 * It represents payment transactions in the system.
 */

import { Field, ID, ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user"

/**
 * Payment Entity
 * @description
 * Represents a payment entity in the database.
 * This class defines the structure of the payment entity in database:
 * - `id`: unique identifier for the payment.
 * - `amount`: amount of the payment in cents.
 * - `currency`: currency of the payment (e.g., 'eur').
 * - `status`: status of the payment (e.g., 'succeeded', 'failed').
 * - `stripePaymentIntentId`: ID of the Stripe PaymentIntent.
 * - `description`: description of the payment.
 * - `surveyCount`: number of surveys that will be added to the user's quota.
 * - `userId`: ID of the user who made the payment.
 * - `user`: relation to the User entity.
 * - `createdAt`: timestamp of when the payment was created.
 * - `updatedAt`: timestamp of when the payment was last updated.
 * 
 * @example
 * ```typescript
 * // Create a new payment
 * const payment = new Payment();
 * payment.amount = 1000; // 10.00 in cents
 * payment.currency = 'eur';
 * payment.status = 'pending';
 * payment.stripePaymentIntentId = 'pi_1234567890';
 * payment.userId = 1;
 * payment.surveyCount = 50; // 50 surveys will be added to the user's quota
 * await payment.save();
 * ```
 */
@ObjectType()
@Entity({ name: "payment" })
export class Payment extends BaseEntity {
  /**
   * Unique identifier for the payment
   * @description
   * Auto-generated primary key for the payment entity.
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  /**
   * Amount of the payment in cents
   * @description
   * The amount of the payment in the smallest currency unit (e.g., cents for EUR).
   * For example, 1000 represents 10.00 EUR.
   */
  @Field()
  @Column()
  amount!: number

  /**
   * Currency of the payment
   * @description
   * The three-letter ISO currency code (e.g., 'eur', 'usd').
   */
  @Field()
  @Column({ length: 3 })
  currency!: string

  /**
   * Status of the payment
   * @description
   * The current status of the payment (e.g., 'pending', 'succeeded', 'failed').
   */
  @Field()
  @Column({ length: 20 })
  status!: string

  /**
   * ID of the Stripe PaymentIntent
   * @description
   * The unique identifier of the Stripe PaymentIntent associated with this payment.
   * This is used to track the payment in Stripe.
   */
  @Field()
  @Column({ length: 255, unique: true })
  stripePaymentIntentId!: string

  /**
   * Description of the payment
   * @description
   * A human-readable description of what the payment is for.
   */
  @Field()
  @Column({ length: 255, nullable: true })
  description!: string

  /**
   * Number of surveys that will be added to the user's quota
   * @description
   * The number of surveys that will be added to the user's quota when the payment is successful.
   * This is determined by the package purchased.
   */
  @Field()
  @Column({ default: 0 })
  surveyCount!: number

  /**
   * ID of the user who made the payment
   * @description
   * The ID of the user who made this payment.
   */
  @Field()
  @Column()
  userId!: number

  /**
   * Relation to the User entity
   * @description
   * The user who made this payment.
   * This is a many-to-one relationship with the User entity.
   */
  @Field(() => User)
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User

  /**
   * Timestamp of when the payment was created
   * @description
   * The date and time when this payment was created.
   */
  @Field()
  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date

  /**
   * Timestamp of when the payment was last updated
   * @description
   * The date and time when this payment was last updated.
   */
  @Field()
  @Column({
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date
} 
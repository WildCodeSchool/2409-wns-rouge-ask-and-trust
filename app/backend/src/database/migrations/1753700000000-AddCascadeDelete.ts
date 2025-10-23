import { MigrationInterface, QueryRunner } from "typeorm"

/**
 * Migration to add CASCADE DELETE for RGPD compliance
 * @description
 * This migration updates foreign key constraints to automatically delete
 * related data when a user account is deleted, ensuring compliance with
 * RGPD (Right to be Forgotten).
 *
 * Updated relations:
 * - survey.user → CASCADE DELETE
 * - category.createdBy → CASCADE DELETE
 * - answers.user → CASCADE DELETE
 * - payment.user → Already has CASCADE DELETE
 */
export class AddCascadeDelete1753700000000 implements MigrationInterface {
	name = "AddCascadeDelete1753700000000"

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Drop existing foreign key constraints
		await queryRunner.query(
			`ALTER TABLE "survey" DROP CONSTRAINT IF EXISTS "FK_survey_user"`
		)
		await queryRunner.query(
			`ALTER TABLE "category" DROP CONSTRAINT IF EXISTS "FK_category_createdBy"`
		)
		await queryRunner.query(
			`ALTER TABLE "answers" DROP CONSTRAINT IF EXISTS "FK_answers_user"`
		)

		// Re-create foreign key constraints with CASCADE DELETE
		await queryRunner.query(
			`ALTER TABLE "survey" ADD CONSTRAINT "FK_survey_user" 
			FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
		)
		await queryRunner.query(
			`ALTER TABLE "category" ADD CONSTRAINT "FK_category_createdBy" 
			FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE`
		)
		await queryRunner.query(
			`ALTER TABLE "answers" ADD CONSTRAINT "FK_answers_user" 
			FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop CASCADE constraints
		await queryRunner.query(
			`ALTER TABLE "answers" DROP CONSTRAINT IF EXISTS "FK_answers_user"`
		)
		await queryRunner.query(
			`ALTER TABLE "category" DROP CONSTRAINT IF EXISTS "FK_category_createdBy"`
		)
		await queryRunner.query(
			`ALTER TABLE "survey" DROP CONSTRAINT IF EXISTS "FK_survey_user"`
		)

		// Re-create without CASCADE (RESTRICT by default)
		await queryRunner.query(
			`ALTER TABLE "survey" ADD CONSTRAINT "FK_survey_user" 
			FOREIGN KEY ("userId") REFERENCES "user"("id")`
		)
		await queryRunner.query(
			`ALTER TABLE "category" ADD CONSTRAINT "FK_category_createdBy" 
			FOREIGN KEY ("createdById") REFERENCES "user"("id")`
		)
		await queryRunner.query(
			`ALTER TABLE "answers" ADD CONSTRAINT "FK_answers_user" 
			FOREIGN KEY ("userId") REFERENCES "user"("id")`
		)
	}
}

import { MigrationInterface, QueryRunner } from "typeorm"

export class InitSchema1753601000000 implements MigrationInterface {
	name = "InitSchema1753601000000"

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."questions_type_enum" AS ENUM('text', 'textarea', 'checkbox', 'radio', 'boolean', 'select')`
		)
		await queryRunner.query(
			`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "title" character varying(1000) NOT NULL, "type" "public"."questions_type_enum" NOT NULL DEFAULT 'text', "answers" jsonb NOT NULL DEFAULT '[]', "surveyId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "survey" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "description" character varying(5000) NOT NULL, "status" character varying NOT NULL DEFAULT 'draft', "public" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "estimatedDuration" integer NOT NULL DEFAULT '5', "availableDuration" integer NOT NULL DEFAULT '30', "userId" integer, "categoryId" integer, CONSTRAINT "UQ_af2eef92c9425e355b20bd941fc" UNIQUE ("title"), CONSTRAINT "PK_f0da32b9181e9c02ecf0be11ed3" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'moderator', 'admin')`
		)
		await queryRunner.query(
			`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(254) NOT NULL, "hashedPassword" character varying(255) NOT NULL, "firstname" character varying(100) NOT NULL, "lastname" character varying(100) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "currency" character varying(3) NOT NULL, "status" character varying(255) NOT NULL, "stripePaymentIntentId" character varying(255) NOT NULL, "description" character varying(255), "surveyCount" integer NOT NULL DEFAULT '0', "userId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_aaf4912b634282efbc202ebd4d1" UNIQUE ("stripePaymentIntentId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "answers" ("userId" integer NOT NULL, "questionId" integer NOT NULL, "content" character varying(1000) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40034f94e491ce389310fb21bb7" PRIMARY KEY ("userId", "questionId"))`
		)
		await queryRunner.query(
			`ALTER TABLE "questions" ADD CONSTRAINT "FK_8eee23e5ccebd4025ecaccda1b2" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "survey" ADD CONSTRAINT "FK_5963e1aea20c3c7c2108849c08a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "survey" ADD CONSTRAINT "FK_a9a5e5343edefde3dcbbe711f28" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "category" ADD CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "answers" ADD CONSTRAINT "FK_1bd66b7e0599333e61d2e3e1678" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "answers" ADD CONSTRAINT "FK_c38697a57844f52584abdb878d7" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "answers" DROP CONSTRAINT "FK_c38697a57844f52584abdb878d7"`
		)
		await queryRunner.query(
			`ALTER TABLE "answers" DROP CONSTRAINT "FK_1bd66b7e0599333e61d2e3e1678"`
		)
		await queryRunner.query(
			`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`
		)
		await queryRunner.query(
			`ALTER TABLE "category" DROP CONSTRAINT "FK_50c69cdc9b3e7494784a2fa2db4"`
		)
		await queryRunner.query(
			`ALTER TABLE "survey" DROP CONSTRAINT "FK_a9a5e5343edefde3dcbbe711f28"`
		)
		await queryRunner.query(
			`ALTER TABLE "survey" DROP CONSTRAINT "FK_5963e1aea20c3c7c2108849c08a"`
		)
		await queryRunner.query(
			`ALTER TABLE "questions" DROP CONSTRAINT "FK_8eee23e5ccebd4025ecaccda1b2"`
		)
		await queryRunner.query(`DROP TABLE "answers"`)
		await queryRunner.query(`DROP TABLE "payment"`)
		await queryRunner.query(`DROP TABLE "user"`)
		await queryRunner.query(`DROP TYPE "public"."user_role_enum"`)
		await queryRunner.query(`DROP TABLE "category"`)
		await queryRunner.query(`DROP TABLE "survey"`)
		await queryRunner.query(`DROP TABLE "questions"`)
		await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`)
	}
}

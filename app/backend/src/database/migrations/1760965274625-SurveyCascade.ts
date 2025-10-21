import { MigrationInterface, QueryRunner } from "typeorm"

export class SurveyCascade1760965274625 implements MigrationInterface {
	name = "SurveyCascade1760965274625"

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "questions" DROP CONSTRAINT "FK_8eee23e5ccebd4025ecaccda1b2"`
		)
		await queryRunner.query(
			`ALTER TABLE "questions" ALTER COLUMN "surveyId" SET NOT NULL`
		)
		await queryRunner.query(
			`ALTER TABLE "questions" ADD CONSTRAINT "FK_8eee23e5ccebd4025ecaccda1b2" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "survey" DROP CONSTRAINT "FK_5963e1aea20c3c7c2108849c08a"`
		)
		await queryRunner.query(
			`ALTER TABLE "questions" DROP CONSTRAINT "FK_8eee23e5ccebd4025ecaccda1b2"`
		)
		await queryRunner.query(
			`ALTER TABLE "questions" ALTER COLUMN "surveyId" DROP NOT NULL`
		)

		await queryRunner.query(
			`ALTER TABLE "questions" ADD CONSTRAINT "FK_8eee23e5ccebd4025ecaccda1b2" FOREIGN KEY ("surveyId") REFERENCES "survey"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
	}
}

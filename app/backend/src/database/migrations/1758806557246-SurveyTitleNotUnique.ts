import { MigrationInterface, QueryRunner } from "typeorm"

export class SurveyTitleNotUnique1758806557246 implements MigrationInterface {
	name = "SurveyTitleNotUnique1758806557246"

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "survey" DROP CONSTRAINT "UQ_af2eef92c9425e355b20bd941fc"`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "survey" ADD CONSTRAINT "UQ_af2eef92c9425e355b20bd941fc" UNIQUE ("title")`
		)
	}
}

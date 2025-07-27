import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedDefaultCategories1753603523829 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const categories = [
			"Santé",
			"Société",
			"Politique",
			"Économie",
			"Environnement",
			"Technologie",
			"Éducation",
			"Médias",
			"Consommation",
			"Culture",
			"International",
			"Faits divers",
		]

		for (const categoryName of categories) {
			await queryRunner.query(
				`INSERT INTO category (name, "createdAt", "updatedAt") 
                 VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                 ON CONFLICT (name) DO NOTHING`,
				[categoryName]
			)
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const categories = [
			"Santé",
			"Société",
			"Politique",
			"Économie",
			"Environnement",
			"Technologie",
			"Éducation",
			"Médias",
			"Consommation",
			"Culture",
			"International",
			"Faits divers",
		]

		await queryRunner.query(`DELETE FROM category WHERE name = ANY($1)`, [
			categories,
		])
	}
}

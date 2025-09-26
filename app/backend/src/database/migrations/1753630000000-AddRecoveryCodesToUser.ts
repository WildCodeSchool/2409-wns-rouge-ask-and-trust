import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddRecoveryCodesToUser1753630000000 implements MigrationInterface {
	name = "AddRecoveryCodesToUser1753630000000"

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add recovery codes column to user table
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "recoveryCodes",
				type: "json",
				isNullable: true,
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Remove recovery codes column
		await queryRunner.dropColumn("user", "recoveryCodes")
	}
}

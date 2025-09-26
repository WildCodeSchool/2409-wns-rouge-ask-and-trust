import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddPasswordResetToUser1753610000000 implements MigrationInterface {
	name = "AddPasswordResetToUser1753610000000"

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Add password reset token column
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "passwordResetToken",
				type: "varchar",
				length: "255",
				isNullable: true,
			})
		)

		// Add password reset token expiry column
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "passwordResetTokenExpiry",
				type: "timestamp",
				isNullable: true,
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Remove password reset token expiry column
		await queryRunner.dropColumn("user", "passwordResetTokenExpiry")

		// Remove password reset token column
		await queryRunner.dropColumn("user", "passwordResetToken")
	}
}

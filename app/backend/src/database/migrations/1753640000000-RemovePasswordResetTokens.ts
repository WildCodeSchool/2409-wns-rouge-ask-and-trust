import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class RemovePasswordResetTokens1753640000000
	implements MigrationInterface
{
	name = "RemovePasswordResetTokens1753640000000"

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Remove password reset token columns (replaced by recovery codes)
		await queryRunner.dropColumn("user", "passwordResetToken")
		await queryRunner.dropColumn("user", "passwordResetTokenExpiry")
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Add back password reset token columns if needed
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "passwordResetToken",
				type: "varchar",
				length: "255",
				isNullable: true,
			})
		)

		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "passwordResetTokenExpiry",
				type: "timestamp",
				isNullable: true,
			})
		)
	}
}

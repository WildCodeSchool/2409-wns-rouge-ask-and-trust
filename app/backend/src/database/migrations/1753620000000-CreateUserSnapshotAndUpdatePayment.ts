import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
	TableColumn,
} from "typeorm"

export class CreateUserSnapshotAndUpdatePayment1753620000000
	implements MigrationInterface
{
	name = "CreateUserSnapshotAndUpdatePayment1753620000000"

	public async up(queryRunner: QueryRunner): Promise<void> {
		// Create user_snapshot table
		await queryRunner.createTable(
			new Table({
				name: "user_snapshot",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{
						name: "originalUserId",
						type: "int",
						isNullable: true,
					},
					{
						name: "email",
						type: "varchar",
						length: "254",
					},
					{
						name: "firstname",
						type: "varchar",
						length: "100",
					},
					{
						name: "lastname",
						type: "varchar",
						length: "100",
					},
					{
						name: "role",
						type: "varchar",
						length: "50",
					},
					{
						name: "isAnonymized",
						type: "boolean",
						default: false,
					},
					{
						name: "accountDeletedAt",
						type: "timestamp",
						isNullable: true,
					},
					{
						name: "retentionBasis",
						type: "varchar",
						length: "100",
						default: "'accounting_requirements'",
					},
					{
						name: "createdAt",
						type: "timestamp",
						default: "CURRENT_TIMESTAMP",
					},
					{
						name: "updatedAt",
						type: "timestamp",
						default: "CURRENT_TIMESTAMP",
						onUpdate: "CURRENT_TIMESTAMP",
					},
				],
			}),
			true
		)

		// Add userSnapshotId column to payment table
		await queryRunner.addColumn(
			"payment",
			new TableColumn({
				name: "userSnapshotId",
				type: "int",
				isNullable: true, // Temporary nullable for existing records
			})
		)

		// Modify user foreign key in payment table to allow SET NULL
		await queryRunner.dropForeignKey("payment", "FK_payment_user")

		// Add foreign key for userSnapshot
		await queryRunner.createForeignKey(
			"payment",
			new TableForeignKey({
				columnNames: ["userSnapshotId"],
				referencedColumnNames: ["id"],
				referencedTableName: "user_snapshot",
				onDelete: "RESTRICT",
				name: "FK_payment_userSnapshot",
			})
		)

		// Re-add user foreign key with SET NULL
		await queryRunner.createForeignKey(
			"payment",
			new TableForeignKey({
				columnNames: ["userId"],
				referencedColumnNames: ["id"],
				referencedTableName: "user",
				onDelete: "SET NULL",
				name: "FK_payment_user_setNull",
			})
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		// Drop foreign keys
		await queryRunner.dropForeignKey("payment", "FK_payment_userSnapshot")
		await queryRunner.dropForeignKey("payment", "FK_payment_user_setNull")

		// Remove userSnapshotId column
		await queryRunner.dropColumn("payment", "userSnapshotId")

		// Restore original user foreign key
		await queryRunner.createForeignKey(
			"payment",
			new TableForeignKey({
				columnNames: ["userId"],
				referencedColumnNames: ["id"],
				referencedTableName: "user",
				onDelete: "CASCADE",
				name: "FK_payment_user",
			})
		)

		// Drop user_snapshot table
		await queryRunner.dropTable("user_snapshot")
	}
}

import dataSource from "../database/config/datasource"
import { User } from "../database/entities/user"
import { UserSnapshot } from "../database/entities/user-snapshot"
import { Payment } from "../database/entities/payment"
import { AppError } from "../middlewares/error-handler"
import crypto from "crypto"

/**
 * Creates a snapshot of user data for payment record keeping
 * @param user - User entity to create snapshot for
 * @returns Promise<UserSnapshot> - Created user snapshot
 */
export const createUserSnapshot = async (user: User): Promise<UserSnapshot> => {
	const userSnapshotRepository = dataSource.getRepository(UserSnapshot)

	try {
		const snapshot = userSnapshotRepository.create({
			originalUserId: user.id,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
			role: user.role,
			isAnonymized: false,
			retentionBasis: "accounting_requirements",
		})

		return await userSnapshotRepository.save(snapshot)
	} catch (error) {
		throw new AppError(
			"Erreur lors de la création du snapshot utilisateur",
			500,
			"InternalServerError",
			error instanceof Error ? error.message : undefined
		)
	}
}

/**
 * Anonymizes a user snapshot while preserving essential data for legal compliance
 * @param snapshot - UserSnapshot to anonymize
 * @returns Promise<UserSnapshot> - Anonymized snapshot
 */
export const anonymizeUserSnapshot = async (
	snapshot: UserSnapshot
): Promise<UserSnapshot> => {
	const userSnapshotRepository = dataSource.getRepository(UserSnapshot)

	try {
		// Generate anonymous identifiers
		const anonymousId = crypto.randomBytes(8).toString("hex")

		// Anonymize personal data while keeping format for technical requirements
		snapshot.email = `deleted-user-${anonymousId}@anonymized.local`
		snapshot.firstname = `Utilisateur-${anonymousId.substring(0, 4)}`
		snapshot.lastname = `Supprimé-${anonymousId.substring(4, 8)}`
		snapshot.isAnonymized = true
		snapshot.accountDeletedAt = new Date()
		snapshot.originalUserId = undefined // Remove link to original user

		return await userSnapshotRepository.save(snapshot)
	} catch (error) {
		throw new AppError(
			"Erreur lors de l'anonymisation du snapshot",
			500,
			"InternalServerError",
			error instanceof Error ? error.message : undefined
		)
	}
}

/**
 * Deletes a user account with GDPR compliance
 * This function:
 * 1. Anonymizes all user snapshots associated with payments
 * 2. Removes all personal data from the user account
 * 3. Preserves payment records for legal/accounting requirements
 * 4. Deletes surveys and other user-generated content
 *
 * @param userId - ID of user to delete
 * @returns Promise<string> - Success message
 */
export const deleteUserAccount = async (userId: number): Promise<string> => {
	const queryRunner = dataSource.createQueryRunner()

	await queryRunner.connect()
	await queryRunner.startTransaction()

	try {
		const userRepository = queryRunner.manager.getRepository(User)
		const userSnapshotRepository =
			queryRunner.manager.getRepository(UserSnapshot)
		const paymentRepository = queryRunner.manager.getRepository(Payment)

		// Find the user
		const user = await userRepository.findOne({
			where: { id: userId },
			relations: ["surveys", "categories"],
		})

		if (!user) {
			throw new AppError("Utilisateur non trouvé", 404, "NotFoundError")
		}

		// 1. Find all user snapshots associated with this user's payments
		const userSnapshots = await userSnapshotRepository.find({
			where: { originalUserId: userId },
		})

		// 2. Anonymize all user snapshots
		for (const snapshot of userSnapshots) {
			if (!snapshot.isAnonymized) {
				await anonymizeUserSnapshot(snapshot)
			}
		}

		// 3. Update payments to remove direct user reference (keep snapshot reference)
		await paymentRepository.update({ userId: userId }, { user: undefined })

		// 4. Delete user's surveys and categories (cascade will handle related data)
		// Note: This respects the user's right to deletion for their content
		// while preserving payment records for legal requirements

		// 5. Delete the user account
		await userRepository.remove(user)

		await queryRunner.commitTransaction()

		return "Compte utilisateur supprimé avec succès. Les données de paiement ont été anonymisées et conservées pour les obligations légales."
	} catch (error) {
		await queryRunner.rollbackTransaction()

		if (error instanceof AppError) {
			throw error
		}

		throw new AppError(
			"Erreur lors de la suppression du compte",
			500,
			"InternalServerError",
			error instanceof Error ? error.message : undefined
		)
	} finally {
		await queryRunner.release()
	}
}

/**
 * Exports all user data for GDPR data portability requirements
 * @param userId - ID of user requesting data export
 * @returns Promise<object> - Complete user data export
 */
export const exportUserData = async (userId: number): Promise<object> => {
	const userRepository = dataSource.getRepository(User)
	const paymentRepository = dataSource.getRepository(Payment)

	try {
		// Get user with all related data
		const user = await userRepository.findOne({
			where: { id: userId },
			relations: [
				"surveys",
				"surveys.questions",
				"surveys.questions.answers",
				"categories",
			],
		})

		if (!user) {
			throw new AppError("Utilisateur non trouvé", 404, "NotFoundError")
		}

		// Get payment history
		const payments = await paymentRepository.find({
			where: { userId: userId },
			relations: ["userSnapshot"],
		})

		// Compile complete data export
		const dataExport = {
			exportDate: new Date().toISOString(),
			user: {
				id: user.id,
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				role: user.role,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			surveys:
				user.surveys?.map(survey => ({
					id: survey.id,
					title: survey.title,
					description: survey.description,
					status: survey.status,
					createdAt: survey.createdAt,
					updatedAt: survey.updatedAt,
					questions: survey.questions?.map(question => ({
						id: question.id,
						title: question.title,
						type: question.type,
						answers: question.answers?.map(answer => ({
							value: answer.value,
						})),
					})),
				})) || [],
			categories:
				user.categories?.map(category => ({
					id: category.id,
					name: category.name,
					createdAt: category.createdAt,
				})) || [],
			payments: payments.map(payment => ({
				id: payment.id,
				amount: payment.amount,
				currency: payment.currency,
				status: payment.status,
				description: payment.description,
				surveyCount: payment.surveyCount,
				createdAt: payment.createdAt,
			})),
			legalNotice:
				"Ces données sont exportées conformément au RGPD (Article 20 - Droit à la portabilité). Les données de paiement peuvent être conservées après suppression du compte pour des obligations légales et comptables.",
		}

		return dataExport
	} catch (error) {
		if (error instanceof AppError) {
			throw error
		}

		throw new AppError(
			"Erreur lors de l'export des données",
			500,
			"InternalServerError",
			error instanceof Error ? error.message : undefined
		)
	}
}

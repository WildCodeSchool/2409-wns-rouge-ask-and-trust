import crypto from "crypto"
import * as argon2 from "argon2"
import dataSource from "../database/config/datasource"
import { User } from "../database/entities/user"
import { AppError } from "../middlewares/error-handler"

/**
 * Génère des codes de récupération à usage unique
 * L'utilisateur les télécharge lors de la création du compte
 * @param userId - ID de l'utilisateur
 * @returns Promise<string[]> - Codes de récupération en clair (à afficher une seule fois)
 */
export const generateRecoveryCodes = async (
	userId: number
): Promise<string[]> => {
	const userRepository = dataSource.getRepository(User)
	const user = await userRepository.findOne({ where: { id: userId } })

	if (!user) {
		throw new AppError("Utilisateur non trouvé", 404, "UserNotFoundError")
	}

	// Générer 10 codes de récupération
	const codes: string[] = []
	const hashedCodes: string[] = []

	for (let i = 0; i < 10; i++) {
		// Format : XXXX-XXXX (8 caractères alphanumériques)
		const code = crypto.randomBytes(4).toString("hex").toUpperCase()
		const formattedCode = `${code.slice(0, 4)}-${code.slice(4, 8)}`

		codes.push(formattedCode)
		hashedCodes.push(await argon2.hash(formattedCode))
	}

	// Sauvegarder les codes hashés
	user.recoveryCodes = hashedCodes
	await userRepository.save(user)

	return codes // Retourner les codes en clair (une seule fois !)
}

/**
 * Utilise un code de récupération pour réinitialiser le mot de passe
 * @param email - Email de l'utilisateur
 * @param recoveryCode - Code de récupération fourni
 * @param newPassword - Nouveau mot de passe
 * @returns Promise<string> - Message de succès
 */
export const useRecoveryCode = async (
	email: string,
	recoveryCode: string,
	newPassword: string
): Promise<string> => {
	const userRepository = dataSource.getRepository(User)
	const user = await userRepository.findOne({ where: { email } })

	if (!user) {
		throw new AppError("Utilisateur non trouvé", 404, "UserNotFoundError")
	}

	if (!user.recoveryCodes || user.recoveryCodes.length === 0) {
		throw new AppError(
			"Aucun code de récupération disponible pour ce compte",
			400,
			"NoRecoveryCodesError"
		)
	}

	// Vérifier si le code fourni correspond à un des codes hashés
	let codeIndex = -1
	for (let i = 0; i < user.recoveryCodes.length; i++) {
		const isValid = await argon2.verify(user.recoveryCodes[i], recoveryCode)
		if (isValid) {
			codeIndex = i
			break
		}
	}

	if (codeIndex === -1) {
		throw new AppError(
			"Code de récupération invalide ou déjà utilisé",
			401,
			"InvalidRecoveryCodeError"
		)
	}

	// Supprimer le code utilisé (usage unique)
	user.recoveryCodes.splice(codeIndex, 1)

	// Mettre à jour le mot de passe
	user.hashedPassword = await argon2.hash(newPassword)

	await userRepository.save(user)

	return `Mot de passe réinitialisé avec succès. Il vous reste ${user.recoveryCodes.length} codes de récupération.`
}

/**
 * Vérifie si un utilisateur a des codes de récupération
 * @param userId - ID de l'utilisateur
 * @returns Promise<boolean> - True si l'utilisateur a des codes
 */
export const hasRecoveryCodes = async (userId: number): Promise<boolean> => {
	const userRepository = dataSource.getRepository(User)
	const user = await userRepository.findOne({ where: { id: userId } })

	return !!(user?.recoveryCodes && user.recoveryCodes.length > 0)
}

/**
 * Obtient le nombre de codes de récupération restants
 * @param userId - ID de l'utilisateur
 * @returns Promise<number> - Nombre de codes restants
 */
export const getRemainingRecoveryCodesCount = async (
	userId: number
): Promise<number> => {
	const userRepository = dataSource.getRepository(User)
	const user = await userRepository.findOne({ where: { id: userId } })

	return user?.recoveryCodes?.length || 0
}

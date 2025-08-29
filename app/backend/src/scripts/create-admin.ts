import { User } from "../database/entities/user"
import dataSource from "../database/config/datasource"
import { register } from "../services/auth-service"
import { Roles } from "../types/types"

async function createAdmin() {
	const email = process.env.ADMIN_EMAIL
	const password = process.env.ADMIN_PASSWORD
	const firstname = process.env.ADMIN_FIRSTNAME
	const lastname = process.env.ADMIN_LASTNAME

	const userRepository = dataSource.getRepository(User)

	// Verify environment variables
	if (!email) {
		console.error("❌ ADMIN_EMAIL is not defined.")
		return
	}
	if (!password) {
		console.error("❌ ADMIN_PASSWORD is not defined.")
		return
	}
	if (!firstname) {
		console.error("❌ ADMIN_FIRSTNAME is not defined.")
		return
	}
	if (!lastname) {
		console.error("❌ ADMIN_LASTNAME is not defined.")
		return
	}

	try {
		// Verify if an admin exists in database
		const existingAdmin = await userRepository.findOne({
			where: { email },
			select: { id: true, email: true },
		})

		if (existingAdmin) {
			return
		}

		// Create an Admin user if doesn't exist in database
		const user = await register(
			email,
			password,
			firstname,
			lastname,
			Roles.Admin
		)

		console.log(`✅ Admin user created: ${user.email}`)
	} catch (error) {
		console.error("❌ Failed to create admin user:", error)
	}
}

export { createAdmin }

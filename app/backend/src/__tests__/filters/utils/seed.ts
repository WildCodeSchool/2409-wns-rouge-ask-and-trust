// test/utils/seed.ts
import { DataSource } from "typeorm"
import { User } from "../../../database/entities/user"
import { Survey } from "../../../database/entities/survey/survey"
import { Roles } from "../../../types/types" //
import { Category } from "../../../database/entities/survey/category"

export async function seed(ds: DataSource) {
	const userRepo = ds.getRepository(User)
	const catRepo = ds.getRepository(Category)
	const surveyRepo = ds.getRepository(Survey)

	const alice = userRepo.create({
		email: "alice@test",
		hashedPassword: "x",
		firstname: "Alice",
		lastname: "Test",
		role: Roles.User,
	})
	const bob = userRepo.create({
		email: "bob@test",
		hashedPassword: "x",
		firstname: "Bob",
		lastname: "Test",
		role: Roles.User,
	})
	await userRepo.save([alice, bob])

	// 2) Categories (sauvegardées AVANT les surveys)
	const [catHealth, catHR, catProduct, catMkt] = await catRepo.save([
		catRepo.create({ name: "Santé", createdBy: alice }),
		catRepo.create({ name: "RH", createdBy: alice }),
		catRepo.create({ name: "Produit", createdBy: alice }),
		catRepo.create({ name: "Marketing", createdBy: bob }),
	])

	await surveyRepo.save([
		surveyRepo.create({
			user: alice,
			category: { id: catHealth.id } as Category,
			title: "Quiz Santé 2024",
			status: "published",
			description: "Un quiz pour évaluer vos connaissances en santé.",
			public: true,
			createdAt: new Date("2024-10-01"),
			updatedAt: new Date("2024-12-01"),
		}),
		surveyRepo.create({
			user: alice,
			category: { id: catHR.id } as Category,
			title: "sondage RH interne",
			status: "draft",
			description: "Sondage pour recueillir les avis des employés.",
			public: true,
			createdAt: new Date("2024-11-10"),
			updatedAt: new Date("2024-11-20"),
		}),
		surveyRepo.create({
			user: alice,
			category: { id: catProduct.id } as Category,
			title: "Poll Produit Beta",
			status: "archived",
			description:
				"Sondage pour les utilisateurs de la version bêta du produit.",
			public: true,
			createdAt: new Date("2025-01-15"),
			updatedAt: new Date("2025-02-01"),
		}),
		surveyRepo.create({
			user: bob,
			category: { id: catMkt.id } as Category,
			title: "Quiz Marketing",
			status: "censored",
			description: "Quiz pour tester les connaissances en marketing.",
			public: false,
			createdAt: new Date("2024-09-09"),
			updatedAt: new Date("2024-09-10"),
		}),
	])

	return { alice, bob }
}

import { Category } from "../../database/entities/survey/category"
import { AppError } from "../../middlewares/error-handler"

export async function getCategory(categoryId: number): Promise<Category> {
	const category = await Category.findOne({
		where: { id: categoryId },
	})

	if (!category) {
		throw new AppError("Category not found", 404, "NotFoundError")
	}

	return category
}

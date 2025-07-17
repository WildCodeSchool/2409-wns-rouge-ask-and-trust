import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import logoFooter from "/logos/logo-footer.svg"
import { Button } from "@/components/ui/Button"
import NavAndAuthButtons from "./NavAndAuthButtons"
import { useAuthContext } from "@/hooks/useAuthContext"
import { cn, slugify } from "@/lib/utils"
import { useQuery } from "@apollo/client"
import { GET_CATEGORIES } from "@/graphql/survey/category"
import { SurveyCategoryType } from "@/types/types"
import { useResponsivity } from "@/hooks/useResponsivity"

export default function Header({ showCategories = false }) {
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)
	const [searchParams, setSearchParams] = useSearchParams()
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	)
	const { user } = useAuthContext()

	const { data: categoriesData, loading: loadingCategories } =
		useQuery(GET_CATEGORIES)
	const categories = categoriesData?.categories || []

	const filterByCategory = (categorySlug: string, categoryId: string) => {
		const newParams = new URLSearchParams(searchParams)

		if (newParams.get("category") === categorySlug) {
			newParams.delete("category")
			newParams.delete("categoryId")
			newParams.set("page", "1")
			setSelectedCategory(null)
		} else {
			newParams.set("category", categorySlug)
			newParams.set("categoryId", categoryId)
			newParams.set("page", "1")
			setSelectedCategory(categorySlug)
		}

		setSearchParams(newParams)
	}

	return (
		<header
			lang="fr"
			className={cn(
				"bg-primary-600 flex flex-col gap-9 px-6 py-5",
				isHorizontalCompact ? "mb-14" : "mb-20"
			)}
			role="contentinfo"
			aria-label="En-tête de page"
			ref={rootRef}
		>
			<div className="flex items-center justify-between gap-20 max-lg:gap-6 max-md:gap-20 max-sm:gap-12">
				<Link
					to={user ? "/surveys" : "/"}
					className="max-w-36 max-sm:max-w-28"
				>
					<img
						src={logoFooter}
						alt="Logo AskTrust"
						className="w-full"
					/>
				</Link>
				<NavAndAuthButtons isHorizontalCompact={isHorizontalCompact} />
			</div>
			{showCategories && (
				<div className="flex items-center gap-3 overflow-x-scroll pt-1 pb-3 pl-1">
					{loadingCategories && (
						<p className="text-white">
							Chargement des catégories...
						</p>
					)}
					{categories.map((category: SurveyCategoryType) => {
						const slug = slugify(category.name)

						return (
							<Button
								key={category.id}
								variant="navbar_btn"
								size="sm"
								ariaLabel={`Annonces de la catégorie ${category.name}`}
								children={category.name}
								className={cn(
									"min-w-fit",
									selectedCategory === slug &&
										"text-primary-700 bg-white"
								)}
								onClick={() =>
									filterByCategory(slug, category.id)
								}
							/>
						)
					})}
				</div>
			)}
		</header>
	)
}

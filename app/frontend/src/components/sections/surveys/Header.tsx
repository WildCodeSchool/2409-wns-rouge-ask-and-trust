import { Button } from "@/components/ui/Button"
import { GET_CATEGORIES } from "@/graphql/survey/category"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useResponsivity } from "@/hooks/useResponsivity"
import { cn, slugify } from "@/lib/utils"
import { SurveyCategoryType } from "@/types/types"
import { useQuery } from "@apollo/client"
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import NavAndAuthButtons from "@/components/sections/auth/NavAndAuthButtons"
import logoFooter from "/logos/logo-footer.svg"

export default function Header({ isInSurveys = false }) {
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
			setSelectedCategory(null)
		} else {
			newParams.set("category", categorySlug)
			newParams.set("categoryId", categoryId)
			setSelectedCategory(categorySlug)
		}

		setSearchParams(newParams)
	}

	return (
		<header
			lang="fr"
			className={"bg-primary-600 flex flex-col gap-9 px-6 py-5"}
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
				<NavAndAuthButtons
					isHorizontalCompact={isHorizontalCompact}
					isInSurveys={isInSurveys}
				/>
			</div>
			{isInSurveys && (
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

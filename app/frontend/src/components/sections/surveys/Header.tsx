import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logoFooter from "/logos/logo-footer.svg"
import { Button } from "@/components/ui/Button"
import NavAndAuthButtons from "./NavAndAuthButtons"
import { useAuthContext } from "@/hooks/useAuthContext"
import { cn } from "@/lib/utils"
import { useQuery } from "@apollo/client"
import { GET_CATEGORIES } from "@/graphql/survey/category"
import { SurveyCategoryType } from "@/types/types"

export default function Header({ showCategories = false }) {
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)
	const { user } = useAuthContext()

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	const { data: categoriesData, loading: loadingCategories } =
		useQuery(GET_CATEGORIES)
	const categories = categoriesData?.categories || []

	return (
		<header
			lang="fr"
			className={cn(
				"bg-primary-600 flex flex-col gap-9 px-6 py-5",
				isMobile ? "mb-14" : "mb-20"
			)}
			role="contentinfo"
			aria-label="En-tête de page"
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
				<NavAndAuthButtons isMobile={isMobile} />
			</div>
			{showCategories && (
				<div className="flex items-center gap-3 overflow-x-scroll pb-3">
					{loadingCategories && (
						<p className="text-white">
							Chargement des catégories...
						</p>
					)}
					{categories.map((category: SurveyCategoryType) => (
						<Button
							variant="navbar_btn"
							size="sm"
							ariaLabel={`Annonces de la catégorie ${category.name}`}
							children={category.name}
							className="min-w-fit"
						/>
					))}
				</div>
			)}
		</header>
	)
}

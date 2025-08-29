import { useLocation } from "react-router-dom"
import SearchForm from "../surveys/SearchForm"
import { NavAndAuthButtonsProps } from "@/types/types"
import { cn } from "@/lib/utils"
import Links from "@/components/ui/Links"
import AuthButtons from "./AuthButtons"

export default function NavAndAuthButtons({
	links,
	isHorizontalCompact,
	isInSurveys,
	isInHeader,
	isInFooter,
}: NavAndAuthButtonsProps) {
	const location = useLocation()
	const isOnLanding = location.pathname === "/"

	// UL layout selon le contexte
	const listLayoutClass = cn(
		"flex items-center justify-center gap-10",
		isHorizontalCompact &&
			isOnLanding &&
			"flex-col items-start justify-start gap-5",
		!isHorizontalCompact && "max-sm:flex-col max-sm:gap-5"
	)

	// LI animation selon le layout
	const listItemClass = cn(
		"list-none duration-200 ease-in-out",
		isHorizontalCompact && isOnLanding
			? "transition-all hover:pl-5"
			: "transition-transform hover:scale-105"
	)

	// Navigation container global
	const navClass = cn(
		"flex w-full flex-1 items-center gap-10 max-lg:gap-6",
		isInSurveys ? "justify-between" : "justify-end",
		isHorizontalCompact && isOnLanding && "flex-col gap-20",
		isInFooter && "max-lg:flex-col"
	)

	return (
		<nav
			className={navClass}
			role="navigation"
			aria-label="Navigation du site"
		>
			{links && !isInSurveys && (
				<div className="flex w-full flex-1 items-center justify-center gap-10 max-md:hidden">
					<ul className={listLayoutClass} role="list">
						{links.map(link => (
							<li
								className={listItemClass}
								key={link.href}
								role="listitem"
							>
								<Links {...link} />
							</li>
						))}
					</ul>
				</div>
			)}
			{isInSurveys && <SearchForm />}
			<AuthButtons
				isHorizontalCompact={isHorizontalCompact}
				isInHeader={isInHeader}
				isInFooter={isInFooter}
			/>
		</nav>
	)
}

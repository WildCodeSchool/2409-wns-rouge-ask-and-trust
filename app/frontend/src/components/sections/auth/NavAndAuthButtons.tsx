import SearchForm from "../surveys/SearchForm"
import { NavAndAuthButtonsProps } from "@/types/types"
import { cn } from "@/lib/utils"
import Links from "@/components/ui/Links"
import AuthButtons from "./AuthButtons"

export default function NavAndAuthButtons({
	links,
	isHorizontalCompact,
	isInSurveys,
}: NavAndAuthButtonsProps) {
	return (
		<nav
			className={cn(
				"flex w-full flex-1 items-center justify-between gap-12",
				!isInSurveys && "justify-end",
				isHorizontalCompact &&
					location.pathname === "/" &&
					"flex flex-col gap-20"
			)}
			role="navigation"
			aria-label="Navigation du site"
		>
			{links && (
				<div
					className={cn(
						"flex w-full flex-1 items-center justify-center gap-12",
						isHorizontalCompact && "justify-start"
					)}
				>
					<ul
						className={cn(
							"flex items-center justify-center gap-12",
							isHorizontalCompact &&
								"flex-col items-start justify-start gap-5"
						)}
						role="list"
					>
						{links.map(link => (
							<li
								className="list-none transition-transform hover:scale-105"
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
			<AuthButtons isHorizontalCompact={isHorizontalCompact} />
		</nav>
	)
}

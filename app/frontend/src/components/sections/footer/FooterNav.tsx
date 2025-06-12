import { cn } from "@/lib/utils"
import { FooterLink } from "./Footer"
import { Separator } from "@radix-ui/react-separator"
import { LinksType } from "@/types/types"

export default function FooterNav({
	footerLinks,
}: {
	footerLinks: readonly LinksType[]
}) {
	const CURRENT_YEAR = new Date().getFullYear()

	return (
		/* Navigation links */
		/* cn: Use for conditional classes and avoid error when using multiple classes */
		<nav
			className={cn(
				"order-2 mb-8 text-center md:order-1 md:mb-0 md:text-left",
				"flex flex-col space-y-3"
			)}
			aria-label="Navigation du pied de page"
		>
			{footerLinks.map(link => (
				<FooterLink key={link.href} {...link} />
			))}

			{/* Separator for mobile */}
			<div className="mt-6 md:hidden" role="separator">
				<Separator className="bg-black-300" />
			</div>

			{/* Copyright */}
			<div className="mt-8 text-center md:mt-4 md:text-left">
				<p className="text-primary-50 flex flex-col text-sm md:flex md:flex-row md:flex-wrap md:items-center md:space-x-2">
					<span>&copy; {CURRENT_YEAR}</span>
					<span className="hidden md:inline" aria-hidden="true">
						-
					</span>
					<span>Wild Code School</span>
					<span className="hidden md:inline" aria-hidden="true">
						-
					</span>
					<span>Alternance</span>
					<span className="hidden md:inline" aria-hidden="true">
						-
					</span>
					<span>Concepteur Développeur d&apos;Applications</span>
				</p>
			</div>
		</nav>
	)
}

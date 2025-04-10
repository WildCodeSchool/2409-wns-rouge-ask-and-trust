import { SurveyCardType } from "@/types/types"
import { Link } from "react-router-dom"
import { Timer, Hourglass } from "lucide-react"
import { Chipset } from "@/components/ui/Chipset"

/**
 * SurveyCard component with external link management and accessibility
 *
 * @param {object} props - Component properties
 * @param {string} props.href - Link destination URL
 * @returns {JSX.Element} A Link component with appropriate safety and accessibility attributes
 */

export default function SurveyCard({
	href,
	picture,
	title,
	content,
	tag,
	estimateTime,
	timeLeft,
}: SurveyCardType) {
	const isExternal = href.startsWith("http")

	// Security: check allowed protocols
	if (isExternal && !href.startsWith("https://")) {
		console.warn("Warning: Non-HTTPS external link detected")
	}

	return (
		<Link
			to={href}
			className="font-roboto flex max-w-96 flex-col gap-5 overflow-hidden rounded-xl bg-white shadow-[0_7px_29px_rgba(100,100,111,0.2)] transition-shadow duration-200 ease-in-out hover:shadow-[0_7px_29px_rgba(99,107,227,0.5)]"
			// Indicates to assistive technologies the current page
			aria-current={
				href === window.location.pathname ? "page" : undefined
			}
			// Security: protects against tabnabbing by preventing access to window.opener
			// and prevents the external site from controlling our window
			rel={isExternal ? "noopener noreferrer" : undefined}
			// Opens external links in a new tab to preserve navigation context on our site
			target={isExternal ? "_blank" : undefined}
			// Provides a descriptive label for assistive technologies
			aria-label="Voir l'enquête"
			// data attribute for analytics tracking
			data-category="Enquête"
		>
			<div className="h-52 w-full">
				<img
					src={picture}
					alt="Représentation de l'enquête"
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col gap-3 px-5">
				<h2 className="text-card-fg font-bold">{title}</h2>
				<p className="text-card-fg text-xs">{content}</p>
				<Chipset
					ariaLabel={`Cette annonce concerne la catégorie ${tag}`}
					children={tag}
					rounded
				/>
			</div>
			<div className="bg-primary-default flex items-center justify-between px-5 py-3">
				<div className="flex items-center gap-1">
					<Timer className="h-4 w-4 text-white" aria-hidden />
					<span className="text-xs leading-none font-semibold text-white">
						{estimateTime} minutes
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Hourglass className="h-4 w-4 text-white" aria-hidden />
					<span className="text-xs leading-none font-semibold text-white">
						{timeLeft}
					</span>
				</div>
			</div>
		</Link>
	)
}

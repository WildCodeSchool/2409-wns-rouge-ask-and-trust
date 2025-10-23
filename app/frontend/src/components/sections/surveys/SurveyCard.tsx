import { Chipset } from "@/components/ui/Chipset"
import { SurveyCardType } from "@/types/types"
import { Hourglass, Timer } from "lucide-react"
import { Link } from "react-router-dom"

/**
 * SurveyCard component with external link management and accessibility
 *
 * @param {object} props - Component properties
 * @param {string} props.id - Link destination URL
 * @returns {JSX.Element} A Link component with appropriate safety and accessibility attributes
 */

export default function SurveyCard({
	id,
	picture,
	title,
	description,
	category,
	estimatedDuration,
	availableDuration,
	isOwner,
}: SurveyCardType) {
	const href = `/surveys/respond/${id}`
	const isExternal = href.startsWith("http")

	// Security: check allowed protocols
	if (isExternal && !href.startsWith("https://")) {
		console.warn("Warning: Non-HTTPS external link detected")
	}

	return (
		<Link
			to={href}
			className="border-black-100 shadow-default hover:shadow-primary-default/50 flex w-full flex-col justify-between gap-5 overflow-hidden rounded-xl border bg-white transition-shadow duration-200 ease-in-out hover:shadow-lg"
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
			<div className="border-black-100 h-52 w-full border-b">
				<img
					src={picture}
					alt="Représentation de l'enquête"
					className="h-full w-full object-cover"
				/>
			</div>
			<div className="flex flex-col gap-3 px-5">
				<h2 className="text-card-fg font-bold">{title}</h2>
				<p className="text-card-fg text-xs">{description}</p>
				<div className="flex items-center justify-between gap-5">
					<Chipset
						ariaLabel={`Cette annonce concerne la catégorie ${category.name}`}
						children={category.name}
						rounded
						size="sm"
					/>
					{isOwner && (
						<Chipset
							ariaLabel="Cette enquête m'appartient"
							variant="secondary"
							children="Propriétaire"
							rounded
							size="sm"
						/>
					)}
				</div>
			</div>
			<div className="bg-primary-default flex items-center justify-between px-5 py-3">
				<div className="flex items-center gap-1">
					<Timer className="h-4 w-4 text-white" aria-hidden />
					<span className="text-xs leading-none font-semibold text-white">
						{estimatedDuration} minutes
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Hourglass className="h-4 w-4 text-white" aria-hidden />
					<span className="text-xs leading-none font-semibold text-white">
						{availableDuration} jours
					</span>
				</div>
			</div>
		</Link>
	)
}

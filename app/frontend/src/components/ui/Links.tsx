import { Link, useLocation } from "react-router-dom"
import { LinksType } from "@/types/types"
import { JSX } from "react"
import { cn } from "@/lib/utils"

/**
 * Links component with external link management and accessibility
 *
 * @param {object} props - Component properties
 * @param {string} props.href - Link destination URL
 * @param {string} props.label - The link text
 * @param {string} props.category - Link category for grouping
 * @param {string} props.ariaLabel - The personalized ARIA label for accessibility
 * @returns {JSX.Element} A Link component with appropriate safety and accessibility attributes
 */
export default function Links({
	href,
	label,
	category,
	ariaLabel,
	mobileFooter,
	Icon,
}: LinksType): JSX.Element {
	const isExternal = href.startsWith("http")
	const location = useLocation()

	// Security: check allowed protocols
	if (isExternal && !href.startsWith("https://")) {
		console.warn("Warning: Non-HTTPS external link detected")
	}

	// ariaLabel generation for accessibility
	const finalAriaLabel =
		ariaLabel ||
		`${label} ${category ? `- ${category}` : ""} ${isExternal ? "(s'ouvre dans un nouvel onglet)" : ""}`

	return (
		<Link
			to={href}
			className={cn(
				"font-semibold",
				location.pathname === "/"
					? "text-primary-700"
					: "text-primary-50",
				mobileFooter &&
					"group text-primary-700 flex flex-col items-center gap-1 text-xs font-medium"
			)}
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
			aria-label={finalAriaLabel}
			// data attribute for analytics tracking
			data-category={category}
		>
			{mobileFooter && Icon && (
				<Icon
					className="text-primary-700 h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-105"
					aria-hidden
				/>
			)}
			{label}
		</Link>
	)
}

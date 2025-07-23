import { Link } from "react-router-dom"
import { LinksType } from "@/types/types"
import logoFooter from "/logos/logo-footer.svg"
import NavAndAuthButtons from "../auth/NavAndAuthButtons"
import { useAuthContext } from "@/hooks/useAuthContext"

export default function Footer() {
	const FOOTER_LINKS: LinksType[] = [
		{
			href: "/surveys",
			label: "Liste des enquêtes",
			category: "Enquêtes",
			ariaLabel: "Voir la liste des enquêtes disponibles",
		},
		{
			href: "/payment",
			label: "Achat de packs d'enquêtes",
			category: "Enquêtes",
			ariaLabel: "Acheter des packs d'enquêtes",
		},
		{
			href: "/terms-of-use",
			label: "Mentions légales",
			category: "Informations",
			ariaLabel: "Consulter les mentions légales",
		},
		{
			href: "/contact",
			label: "Contact",
			category: "Informations",
			ariaLabel: "Nous contacter",
		},
	] as const

	const CURRENT_YEAR = new Date().getFullYear()

	const { user } = useAuthContext()

	return (
		<footer
			lang="fr"
			className="bg-primary-600 flex w-full flex-col gap-6 px-6 py-5"
			role="contentinfo"
			aria-label="Pied de page"
		>
			<div className="flex items-center justify-between">
				{/* Logo desktop */}
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
				{/* Component for navigation */}
				<NavAndAuthButtons links={FOOTER_LINKS} />
			</div>
			{/* Copyright */}
			<div className="text-center md:text-left">
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
		</footer>
	)
}

/**
 * Footer link component with external link management and accessibility
 *
 * @param {object} props - Component properties
 * @param {string} props.href - Link destination URL
 * @param {string} props.label - The link text
 * @param {string} props.category - Link category for grouping
 * @param {string} props.ariaLabel - The personalized ARIA label for accessibility
 * @returns {JSX.Element} A Link component with appropriate safety and accessibility attributes
 */

function FooterLink({ href, label, category, ariaLabel }: LinksType) {
	const isExternal = href.startsWith("http")

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
			className="text-primary-50 hover:text-primary-100"
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
			{label}
		</Link>
	)
}

export { FooterLink }

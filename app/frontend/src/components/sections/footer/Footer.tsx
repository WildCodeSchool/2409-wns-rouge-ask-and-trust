import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { LinksType } from "@/types/types"
import logoFooter from "/logos/logo-footer.svg"

const FOOTER_LINKS: readonly LinksType[] = [
	{
		href: "/register",
		label: "S'inscrire",
		category: "Compte",
		ariaLabel: "Créer un compte",
	},
	{
		href: "/connexion",
		label: "Se connecter",
		category: "Compte",
		ariaLabel: "Se connecter à votre compte",
	},
	{
		href: "/surveys",
		label: "Liste des enquêtes",
		category: "Enquêtes",
		ariaLabel: "Voir la liste des enquêtes disponibles",
	},
	{
		href: "/packs",
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

export default function Footer() {
	return (
		<footer
			lang="fr"
			className="bg-primary-700 relative w-full pt-16"
			role="contentinfo"
			aria-label="Pied de page"
		>
			{/* Curved top edge - decorative element */}
			<div
				className="absolute top-0 left-0 w-full overflow-hidden"
				style={{ height: "50px" }}
				aria-hidden="true"
			>
				<svg
					viewBox="0 0 1440 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="absolute bottom-0 h-full w-full"
					preserveAspectRatio="none"
				>
					<path
						d="M0 0H1440V100C1440 100 1082.5 0 720 0C357.5 0 0 100 0 100V0Z"
						fill="#fafafa"
					/>
				</svg>
			</div>

			<div
				className="w-full px-4 pb-8"
				role="navigation"
				aria-label="Plan du site"
			>
				<div className="flex flex-col items-center md:flex-row md:items-end md:justify-between">
					{/* Logo mobile */}
					<div className="mt-4 mb-8 md:hidden">
						<div className="relative flex items-center">
							<img src={logoFooter} alt="Logo AskTrust" />
						</div>
					</div>

					{/* Navigation links */}
					{/* cn: Use for conditional classes and avoid error when using multiple classes */}
					<nav
						className={cn(
							"order-2 mb-8 text-center md:order-1 md:mb-0 md:text-left",
							"flex flex-col space-y-3"
						)}
						aria-label="Navigation du pied de page"
					>
						{FOOTER_LINKS.map(link => (
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
								<span
									className="hidden md:inline"
									aria-hidden="true"
								>
									-
								</span>
								<span>Wild Code School</span>
								<span
									className="hidden md:inline"
									aria-hidden="true"
								>
									-
								</span>
								<span>Alternance</span>
								<span
									className="hidden md:inline"
									aria-hidden="true"
								>
									-
								</span>
								<span>
									Concepteur Développeur d&apos;Applications
								</span>
							</p>
						</div>
					</nav>

					{/* Logo desktop */}
					<div
						className="mr-2 hidden md:order-2 md:block"
						aria-hidden="true"
					>
						<div className="relative flex items-center">
							<img src={logoFooter} alt="Logo AskTrust" />
						</div>
					</div>
				</div>
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

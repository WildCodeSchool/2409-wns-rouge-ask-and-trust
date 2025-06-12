import { Link } from "react-router-dom"
import { LinksType } from "@/types/types"
import logoFooter from "/logos/logo-footer.svg"
import FooterNav from "./FooterNav"
import { WHOAMI } from "@/graphql/auth"
import { useQuery } from "@apollo/client"

export default function Footer() {
	const { data: whoamiData } = useQuery(WHOAMI)
	const me = whoamiData?.whoami

	const FOOTER_LINKS: LinksType[] = [
		{
			href: me
				? me.role === "admin"
					? "/admin"
					: "/profil"
				: "/connexion",
			label: me
				? me.role === "admin"
					? "Admin"
					: "Profil"
				: "Se connecter",
			category: "Compte",
			ariaLabel: "Se connecter ou accéder à son compte",
		},
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
	].filter(Boolean)

	if (!me || me === null) {
		FOOTER_LINKS.unshift({
			href: "/register",
			label: "S'inscrire",
			category: "Compte",
			ariaLabel: "Créer un compte",
		})
	}

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

					{/* Component for navigation */}
					<FooterNav footerLinks={FOOTER_LINKS} />

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

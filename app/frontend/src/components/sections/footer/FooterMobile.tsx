import { useAuthContext } from "@/hooks/useAuthContext"
import { LinksType } from "@/types/types"
import { House, SquarePlus, Bell, User } from "lucide-react"
import { Link } from "react-router-dom"

export default function FooterMobile() {
	const { user } = useAuthContext()

	const FOOTER_LINKS: LinksType[] = [
		{
			href: user ? "/surveys" : "/",
			label: "Accueil",
			category: "Accueil",
			ariaLabel: "Retourner sur la page d'accueil",
			Icon: House,
		},
		{
			href: "/surveys/create",
			label: "Créer",
			category: "Création",
			ariaLabel: "Créer une enquête",
			Icon: SquarePlus,
		},
		{
			href: user
				? user.role === "admin"
					? "/admin"
					: "/profil"
				: "/connexion",
			label: user
				? user.role === "admin"
					? "Admin"
					: "Profil"
				: "Se connecter",
			category: "Compte",
			ariaLabel: "Se connecter ou accéder à son compte",
			Icon: User,
		},
	].filter(Boolean)

	if (user) {
		const notifications = {
			href: "/profil/notification",
			label: "Notifications",
			category: "Notifications",
			ariaLabel: "Voir les notifications",
			Icon: Bell,
		}

		const position = 2

		FOOTER_LINKS.splice(position, 0, notifications)
	}

	return (
		<footer className="bg-primary-600 fixed bottom-0 flex w-full justify-between px-5 py-2.5 sm:justify-around">
			{FOOTER_LINKS.map(link => (
				<FooterLinks key={link.href} {...link} />
			))}
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
function FooterLinks({ href, label, category, ariaLabel, Icon }: LinksType) {
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
			className="group text-button-primary-fg flex flex-col items-center gap-1 text-xs"
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
			{Icon && (
				<Icon
					className="text-button-primary-fg h-5 w-5 transition-transform duration-200 ease-in-out group-hover:scale-110"
					aria-hidden
				/>
			)}
			{label}
		</Link>
	)
}

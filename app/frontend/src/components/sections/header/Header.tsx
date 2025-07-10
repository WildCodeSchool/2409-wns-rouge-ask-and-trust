import { LinksType } from "@/types/types"
import logoHeader from "/logos/logo-header.svg"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { useEffect, useState } from "react"
import HeaderMobileMenu from "./HeaderMobileMenu"
import NavAndAuthButtons from "./NavAndAuthButtons"
import { Button } from "@/components/ui/Button"

const HEADER_LINKS: readonly LinksType[] = [
	{
		href: "/surveys",
		label: "Les enquêtes",
		category: "Enquêtes",
		ariaLabel: "Voir la liste des enquêtes disponibles",
	},
	{
		href: "/payment",
		label: "Notre offre",
		category: "Enquêtes",
		ariaLabel: "Acheter des packs d'enquêtes",
	},
	{
		href: "/contact",
		label: "Contact",
		category: "Informations",
		ariaLabel: "Nous contacter",
	},
] as const

export default function Header() {
	const [showMenu, setShowMenu] = useState<boolean>(false)
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024)

	const handleShowMenu = () => {
		setShowMenu(!showMenu)
	}

	useEffect(() => {
		if (showMenu) {
			document.body.classList.add("no-scroll")
		} else {
			document.body.classList.remove("no-scroll")
		}

		return () => {
			document.body.classList.remove("no-scroll")
		}
	}, [showMenu])

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 1024)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return (
		<header
			lang="fr"
			className="bg-bg mb-20 flex items-center justify-between gap-10 px-5 pt-4"
			role="contentinfo"
			aria-label="En-tête de page"
		>
			<Link to="/" className="max-w-36">
				<img
					src={logoHeader}
					alt="Logo AskTrust"
					className="w-full"
					aria-hidden
				/>
			</Link>
			{isMobile ? (
				<>
					<Button
						size="square"
						variant="tertiary"
						className="border-0 bg-transparent hover:bg-transparent"
						ariaLabel="Ouvrir le menu"
						onClick={handleShowMenu}
						aria-expanded={showMenu}
					>
						<Menu
							className="text-primary-default h-12 w-12 cursor-pointer"
							aria-hidden
						/>
					</Button>
					<HeaderMobileMenu
						showMenu={showMenu}
						handleShowMenu={handleShowMenu}
						headerLinks={HEADER_LINKS}
					/>
				</>
			) : (
				<>
					<NavAndAuthButtons
						headerLinks={HEADER_LINKS}
						isMobile={false}
					/>
				</>
			)}
		</header>
	)
}

/**
 * Header link component with external link management and accessibility
 *
 * @param {object} props - Component properties
 * @param {string} props.href - Link destination URL
 * @param {string} props.label - The link text
 * @param {string} props.category - Link category for grouping
 * @param {string} props.ariaLabel - The personalized ARIA label for accessibility
 * @returns {JSX.Element} A Link component with appropriate safety and accessibility attributes
 */
function HeaderLink({ href, label, category, ariaLabel }: LinksType) {
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
			className="text-primary-700 max-lg:transition-padding font-bold max-lg:duration-200 max-lg:ease-in-out max-lg:hover:pl-5"
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

export { HeaderLink }

import { Link, useLocation } from "react-router-dom"
import { LinksType } from "@/types/types"
import logoFooter from "/logos/logo-header.svg"
import NavAndAuthButtons from "@/components/sections/auth/NavAndAuthButtons"
import { useAuthContext } from "@/hooks/useAuthContext"
import { cn } from "@/lib/utils"

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
	const location = useLocation()

	return (
		<footer
			lang="fr"
			className={cn(
				"flex w-full flex-col gap-6 px-6 py-5",
				location.pathname === "/" ? "bg-bg" : "bg-primary-600"
			)}
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
				<p className="text-primary-600 flex flex-col text-sm md:flex md:flex-row md:flex-wrap md:items-center md:space-x-2">
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

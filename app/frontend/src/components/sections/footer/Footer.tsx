import { Link, useLocation } from "react-router-dom"
import { LinksType } from "@/types/types"
import logoLanding from "/logos/logo-landing.svg"
import logoSurveys from "/logos/logo-footer.svg"
import NavAndAuthButtons from "@/components/sections/auth/NavAndAuthButtons"
import { useAuthContext } from "@/hooks/useAuthContext"
import { cn } from "@/lib/utils"
import { useRef } from "react"
import { useHeightVariable } from "@/hooks/useHeightVariable"

export default function Footer() {
	const footerRef = useRef<HTMLElement>(null)
	useHeightVariable(footerRef, "--footer-height")

	const FOOTER_LINKS: LinksType[] = [
		{
			href: "/surveys",
			label: "Liste des enquêtes",
			category: "Enquêtes",
			ariaLabel: "Voir la liste des enquêtes disponibles",
		},
		{
			href: "/payment",
			label: "Packs d'enquêtes",
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

	const { user } = useAuthContext()
	const location = useLocation()

	const CURRENT_YEAR = new Date().getFullYear()
	const isInHome = location.pathname === "/"

	return (
		<footer
			lang="fr"
			className={cn(
				"flex w-full flex-col gap-6 px-6 py-5",
				isInHome ? "bg-bg" : "bg-primary-600"
			)}
			role="contentinfo"
			aria-label="Pied de page"
			ref={footerRef}
		>
			<div className="flex items-center justify-between gap-10 max-lg:flex-col max-lg:gap-6">
				{/* Logo desktop */}
				<Link to={user ? "/surveys" : "/"} className="max-w-36">
					{isInHome ? (
						<img
							src={logoLanding}
							alt="Logo AskTrust"
							className="w-full"
						/>
					) : (
						<img
							src={logoSurveys}
							alt="Logo AskTrust"
							className="w-full"
						/>
					)}
				</Link>
				{/* Component for navigation */}
				<NavAndAuthButtons links={FOOTER_LINKS} isInFooter />
			</div>
			{/* Copyright */}
			<div className="text-center md:text-left">
				<p
					className={cn(
						isInHome ? "text-primary-700" : "text-primary-50",
						"flex flex-col text-sm max-lg:justify-center sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:space-x-2"
					)}
				>
					<span>&copy; {CURRENT_YEAR}</span>
					<span className="hidden sm:inline" aria-hidden="true">
						-
					</span>
					<span>Wild Code School</span>
					<span className="hidden sm:inline" aria-hidden="true">
						-
					</span>
					<span>Alternance</span>
					<span className="hidden sm:inline" aria-hidden="true">
						-
					</span>
					<span>Concepteur Développeur d&apos;Applications</span>
				</p>
			</div>
		</footer>
	)
}

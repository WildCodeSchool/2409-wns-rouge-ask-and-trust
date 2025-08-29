import NavAndAuthButtons from "@/components/sections/auth/NavAndAuthButtons"
import { Button } from "@/components/ui/Button"
import { useResponsivity } from "@/hooks/useResponsivity"
import { LinksType } from "@/types/types"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import HeaderMobileMenu from "./HeaderMobileMenu"
import logo from "/logos/logo-landing.svg"
import { useHeightVariable } from "@/hooks/useHeightVariable"

export const HEADER_LINKS: readonly LinksType[] = [
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
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 1024)

	// Update header's height variable if change
	// header's height is different depending on pages
	useHeightVariable(rootRef, "--header-height")

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

	return (
		<header
			lang="fr"
			className="bg-bg mb-20 flex items-center justify-between gap-10 px-5 pt-4"
			role="contentinfo"
			aria-label="En-tête de page"
			ref={rootRef}
		>
			<Link to="/" className="max-w-36">
				<img
					src={logo}
					alt="Logo AskTrust"
					className="w-full"
					aria-hidden
				/>
			</Link>
			{isHorizontalCompact ? (
				<>
					<Button
						size="square"
						variant="tertiary"
						className="z-50 border-0 bg-transparent hover:bg-transparent"
						ariaLabel="Ouvrir le menu"
						onClick={handleShowMenu}
						aria-expanded={showMenu}
					>
						{showMenu ? (
							<X
								className="text-primary-default h-6 w-6 cursor-pointer"
								aria-hidden
							/>
						) : (
							<Menu
								className="text-primary-default h-12 w-12 cursor-pointer"
								aria-hidden
							/>
						)}
					</Button>
					<HeaderMobileMenu
						showMenu={showMenu}
						isHorizontalCompact={isHorizontalCompact}
						handleShowMenu={handleShowMenu}
						links={HEADER_LINKS}
					/>
				</>
			) : (
				<>
					<NavAndAuthButtons links={HEADER_LINKS} />
				</>
			)}
		</header>
	)
}

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import logoFooter from "/logos/logo-footer.svg"
import { Button } from "@/components/ui/Button"
import SearchForm from "./SearchForm"
import clsx from "clsx"

export default function Header() {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return (
		<header
			lang="fr"
			className={clsx(
				"bg-primary-600 flex flex-col gap-9 px-6 py-5",
				isMobile ? "mb-14" : "mb-20"
			)}
			role="contentinfo"
			aria-label="En-tête de page"
		>
			<div className="flex items-center justify-between gap-20 max-lg:gap-6 max-md:gap-20 max-sm:gap-12">
				<Link to="/" className="max-w-36 max-sm:max-w-28">
					<img
						src={logoFooter}
						alt="Logo AskTrust"
						className="w-full"
					/>
				</Link>
				<nav
					className="flex w-full flex-1 items-center justify-center gap-6"
					role="navigation"
				>
					<SearchForm />
					{!isMobile && (
						<div className="flex items-center justify-center gap-6">
							<Button
								to="/"
								variant="tertiary"
								role="link"
								ariaLabel="Créer une enquête"
							>
								Créer une enquête
							</Button>
							<Button
								to="/login"
								variant="transparent"
								role="link"
								ariaLabel="Se connecter"
							>
								Se connecter
							</Button>
						</div>
					)}
				</nav>
			</div>
			<div className="flex items-center gap-3 overflow-x-scroll pb-3">
				<Button
					variant="navbar_btn"
					size="sm"
					ariaLabel="Annonces de la catégorie sport"
					children="Sport"
				/>
			</div>
		</header>
	)
}

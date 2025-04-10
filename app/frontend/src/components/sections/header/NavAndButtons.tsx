import { Button } from "../../ui/Button"
import { NavAndAuthButtonsProps } from "@/types/types"
import { HeaderLink } from "./Header"

export default function NavAndAuthButtons({
	headerLinks,
	isMobile,
}: NavAndAuthButtonsProps) {
	return (
		<>
			<nav
				className={
					isMobile
						? "flex flex-col gap-20"
						: "flex flex-1 items-center justify-between"
				}
				role="navigation"
			>
				<ul
					className={
						isMobile
							? "flex flex-col gap-5"
							: "flex flex-1 items-center justify-center gap-20"
					}
					role="list"
				>
					{headerLinks.map(link => (
						<li key={link.href} role="listitem">
							<HeaderLink {...link} />
						</li>
					))}
				</ul>
				<div
					className={
						isMobile
							? "flex flex-col gap-5"
							: "flex items-center justify-center gap-6"
					}
				>
					<Button
						to="/register"
						variant={isMobile ? "outline" : "secondary"}
						role="link"
						fullWidth={isMobile}
						ariaLabel="S'inscrire"
					>
						S'inscrire
					</Button>
					<Button
						to="/login"
						variant="primary"
						role="link"
						fullWidth={isMobile}
						ariaLabel="Se connecter"
					>
						Se connecter
					</Button>
				</div>
			</nav>
		</>
	)
}

import { Button } from "../../ui/Button"
import { NavAndAuthButtonsProps } from "@/types/types"
import { HeaderLink } from "./Header"

export default function NavAndAuthButtons({
	headerLinks,
	isHorizontalCompact,
	handleShowMenu,
}: NavAndAuthButtonsProps) {
	return (
		<>
			<nav
				className={
					isHorizontalCompact
						? "flex flex-col gap-20"
						: "flex flex-1 items-center justify-between"
				}
				role="navigation"
			>
				<ul
					className={
						isHorizontalCompact
							? "flex flex-col gap-5"
							: "flex flex-1 items-center justify-center gap-20"
					}
					role="list"
				>
					{headerLinks?.map(link => (
						<li
							key={link.href}
							role="listitem"
							onClick={handleShowMenu}
						>
							<HeaderLink {...link} />
						</li>
					))}
				</ul>
				<div
					className={
						isHorizontalCompact
							? "flex flex-col gap-5"
							: "flex items-center justify-center gap-6"
					}
				>
					<Button
						to="/register"
						variant={isHorizontalCompact ? "outline" : "secondary"}
						role="link"
						fullWidth={isHorizontalCompact}
						ariaLabel="S'inscrire"
						onClick={handleShowMenu}
					>
						S'inscrire
					</Button>
					<Button
						to="/connexion"
						variant="primary"
						role="link"
						fullWidth={isHorizontalCompact}
						ariaLabel="Se connecter"
						onClick={handleShowMenu}
					>
						Se connecter
					</Button>
				</div>
			</nav>
		</>
	)
}

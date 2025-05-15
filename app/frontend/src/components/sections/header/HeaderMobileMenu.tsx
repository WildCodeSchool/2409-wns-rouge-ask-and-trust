import { AnimatePresence, motion, Variants } from "motion/react"
import { HeaderMobileMenuProps } from "@/types/types"
import NavAndAuthButtons from "./NavAndAuthButtons"
import logoHeader from "/logos/logo-header.svg"
import { Link } from "react-router-dom"

const menuVariants: Variants = {
	closed: {
		opacity: 0,
		x: "100%",
		transition: {
			opacity: { duration: 0.15, ease: "easeInOut" },
			x: { duration: 0.25, ease: "easeInOut" },
		},
	},
	open: {
		opacity: 1,
		x: 0,
		transition: {
			type: "spring",
			duration: 0.2,
			damping: 20,
		},
	},
}

export default function HeaderMobileMenu({
	showMenu,
	handleShowMenu,
	headerLinks,
}: HeaderMobileMenuProps) {
	return (
		<AnimatePresence>
			{showMenu && (
				<>
					<motion.div
						className="fixed inset-0 z-40 h-full w-full bg-transparent backdrop-blur-xl"
						onClick={handleShowMenu}
						initial="closed"
						animate="open"
						exit="closed"
						variants={{
							open: { opacity: 1, transition: { duration: 0.2 } },
							closed: {
								opacity: 0,
								transition: { duration: 0.2 },
							},
						}}
					/>
					<motion.div
						className="bg-primary-50 absolute top-0 right-0 z-50 flex h-dvh w-60 flex-col justify-between gap-20 overflow-hidden p-5"
						initial="closed"
						animate="open"
						exit="closed"
						variants={menuVariants}
					>
						<NavAndAuthButtons
							headerLinks={headerLinks}
							isMobile
							handleShowMenu={handleShowMenu}
						/>
						<div className="flex items-center justify-center">
							<Link
								to="/"
								className="max-w-36"
								onClick={handleShowMenu}
							>
								<img
									src={logoHeader}
									alt="Logo AskTrust"
									className="w-full"
									aria-hidden
								/>
							</Link>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

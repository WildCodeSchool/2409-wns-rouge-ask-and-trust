import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"
import { motion } from "motion/react"
import React, { useEffect, useState } from "react"

interface ButtonScrollTopProps {
	containerRef: React.RefObject<HTMLElement | null>
	className?: string
	ariaLabel?: string
}

export const ButtonScrollTop: React.FC<ButtonScrollTopProps> = ({
	containerRef,
	className,
	ariaLabel,
}) => {
	const [isVisible, setIsVisible] = useState(false)
	const [isBouncing, setIsBouncing] = useState(false)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const onScroll = () => {
			setIsVisible(container.scrollTop > 50)
		}

		container.addEventListener("scroll", onScroll)
		onScroll()

		return () => container.removeEventListener("scroll", onScroll)
	}, [containerRef])

	const handleClick = () => {
		if (containerRef.current) {
			containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
		}
		setIsBouncing(true)
	}

	return (
		<Button
			ariaLabel={ariaLabel ?? "Remonter en haut de la page"}
			onClick={handleClick}
			type="button"
			variant="primary"
			size="square"
			className={cn(
				className,
				"fixed right-6 bottom-6 z-50",
				"transition-opacity duration-200 ease-in-out",
				isVisible
					? "pointer-events-auto opacity-100"
					: "pointer-events-none opacity-0"
			)}
		>
			<AnimatedArrowUp
				isBouncing={isBouncing}
				onBounceEnd={() => setIsBouncing(false)}
			/>
		</Button>
	)
}

const AnimatedArrowUp: React.FC<{
	isBouncing: boolean
	onBounceEnd: () => void
}> = ({ isBouncing, onBounceEnd }) => (
	<motion.div
		animate={isBouncing ? { y: [-2, -6, 0] } : { y: 0 }}
		transition={{ duration: 0.3, bounce: 1 }}
		onAnimationComplete={onBounceEnd}
	>
		<ArrowUp />
	</motion.div>
)
